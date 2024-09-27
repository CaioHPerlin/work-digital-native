import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const useChatNotifications = (userId: string) => {
	const [notificationCount, setNotificationCount] = useState(0);
	const [unreadChats, setUnreadChats] = useState<string[]>([]);

	const fetchNotifications = async () => {
		try {
			// Fetch chats where the user has unread messages
			const { data, error } = await supabase
				.from('chats')
				.select('*')
				.or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`);

			if (error) throw error;

			// Count unread chats
			const unreadCount = data.reduce((count, chat) => {
				const isUser1 = chat.user_1_id === userId;
				let isUnread = false;
				if (isUser1) {
					isUnread = !chat.user_1_read;
				} else {
					isUnread = !chat.user_2_read;
				}

				if (isUnread) {
					setUnreadChats((prev) => [...new Set([...prev, chat.id])]);
				}

				return count + (isUnread ? 1 : 0);
			}, 0);

			setNotificationCount(unreadCount);
			return unreadCount;
		} catch (error) {
			console.error('Error fetching notifications:', error);
		}
	};

	useEffect(() => {
		// Fetch notifications initially
		fetchNotifications();

		// Subscribe to new messages in real-time
		const messageSub = supabase
			.channel(userId)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
				},
				(_) => {
					fetchNotifications(); // Re-fetch notifications on new message
				}
			)
			.subscribe();

		const chatSub = supabase
			.channel(userId + '_chat')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'chats',
				},
				(_) => {
					fetchNotifications();
					console.log('refetch');
				}
			)
			.subscribe();

		// Cleanup subscription on unmount
		return () => {
			messageSub.unsubscribe();
			chatSub.unsubscribe();
		};
	}, [userId]);

	const markChatAsRead = async (chatId: string, userId: string) => {
		try {
			// Fetch the chat to check the user_1_id and user_2_id
			const { data: chat, error: fetchError } = await supabase
				.from('chats')
				.select('user_1_id, user_2_id, user_1_read, user_2_read')
				.eq('id', chatId)
				.single(); // Assuming chatId is unique

			if (fetchError) {
				console.error('Error fetching chat:', fetchError);
				return;
			}

			// Determine which user is reading the chat
			let updateData = {};

			if (chat.user_1_id === userId && !chat.user_1_read) {
				updateData = { user_1_read: true };
			} else if (chat.user_2_id === userId && !chat.user_2_read) {
				updateData = { user_2_read: true };
			}

			// Only update if there's unread messages
			if (Object.keys(updateData).length > 0) {
				const { error: updateError } = await supabase
					.from('chats')
					.update(updateData)
					.eq('id', chatId);

				if (updateError) {
					console.error('Error marking chat as read:', updateError);
				} else {
					console.log('Chat marked as read successfully.');
				}
			}

			setUnreadChats((prev) => prev.filter((id) => id !== chatId));
			setNotificationCount((prev) => prev - 1);
		} catch (error) {
			console.error('Error marking chat as read:', error);
		}
	};

	return { notificationCount, unreadChats, markChatAsRead, fetchNotifications }; // Return total notification count
};

export default useChatNotifications;
