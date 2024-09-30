import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const useChatNotifications = (userId: string) => {
  const [unreadChats, setUnreadChats] = useState<string[]>([]);
  const [messageNotifications, setMessageNotifications] = useState<{
    [chatId: string]: number;
  }>({});

  const fetchNotifications = async () => {
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select(
          "id, user_1_id, user_2_id, user_1_read, user_2_read, user_1_read_at, user_2_read_at, updated_at"
        )
        .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`);

      if (chatsError) throw chatsError;

      const unreadChatsSet = new Set<string>();
      const messageNotificationMap: { [chatId: string]: number } = {};

      const unreadCount = await Promise.all(
        chatsData.map(async (chat) => {
          const isUser1 = chat.user_1_id === userId;
          const isUnread = isUser1 ? !chat.user_1_read : !chat.user_2_read;

          if (isUnread) {
            unreadChatsSet.add(chat.id);

            // Fetch unread messages for this chat (messages sent after chat was last updated)
            const { data: messagesData, error: messagesError } = await supabase
              .from("messages")
              .select("id, created_at")
              .eq("chat_id", chat.id)
              .gt(
                "created_at",
                isUser1 ? chat.user_1_read_at : chat.user_2_read_at
              ); // Unread messages are those sent after the chat's updated_at timestamp

            if (messagesError) throw messagesError;

            // Store the unread message count for each chat
            messageNotificationMap[chat.id] = messagesData.length;
          }

          return isUnread ? 1 : 0;
        })
      );

      // Update unread chats
      setUnreadChats((prev) => {
        const newUnreadChats = [...unreadChatsSet];
        if (JSON.stringify(prev) !== JSON.stringify(newUnreadChats)) {
          return newUnreadChats;
        }
        return prev;
      });

      // Update unread message counts per chat
      setMessageNotifications(() => {
        return { ...messageNotificationMap };
      });

      const totalUnreadCount = unreadCount.reduce(
        (a: 0 | 1, b: 0 | 1) => (a + b) as 0 | 1,
        0
      );

      return totalUnreadCount;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const messageSub = supabase
      .channel(userId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (_) => {
          fetchNotifications();
        }
      )
      .subscribe();

    const chatSub = supabase
      .channel(userId + "_chat")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chats" },
        (_) => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      chatSub.unsubscribe();
      messageSub.unsubscribe();
    };
  }, [userId]);

  const markChatAsRead = async (chatId: string, userId: string) => {
    try {
      const { data: chat, error: fetchError } = await supabase
        .from("chats")
        .select(
          "user_1_id, user_2_id, user_1_read, user_2_read, user_1_read_at, user_2_read_at, updated_at"
        )
        .eq("id", chatId)
        .single();

      if (fetchError) {
        console.error("Error fetching chat:", fetchError);
        return;
      }

      let updateData: Partial<{
        user_1_read: boolean;
        user_1_read_at: string;
        user_2_read: boolean;
        user_2_read_at: string;
      }> = {};

      if (chat.user_1_id === userId) {
        updateData = {
          user_1_read: true,
          user_1_read_at: new Date().toISOString(),
        };
      } else if (chat.user_2_id === userId) {
        updateData = {
          user_2_read: true,
          user_2_read_at: new Date().toISOString(),
        };
      }

      console.log("data: ", updateData);
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from("chats")
          .update(updateData)
          .eq("id", chatId);

        if (updateError) {
          console.error("Error marking chat as read:", updateError);
        } else {
          console.log("Chat marked as read successfully.");

          const { data: _, error: messagesError } = await supabase
            .from("messages")
            .select("id")
            .eq("chat_id", chatId)
            .gt(
              "created_at",
              chat.user_1_id === userId
                ? updateData.user_1_read_at
                : updateData.user_2_read_at
            );

          if (messagesError) {
            console.error("Error fetching unread messages:", messagesError);
            return;
          }

          setMessageNotifications((prev) => {
            const newNotifications = { ...prev };
            delete newNotifications[chatId]; // Remove the chat from message notifications when it's read
            return newNotifications;
          });
        }
      }

      setUnreadChats((prev) => prev.filter((id) => id !== chatId));
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  };

  return {
    unreadChats,
    messageNotifications, // { [chatId]: number of unread messages }
    markChatAsRead,
    fetchNotifications,
  };
};

export default useChatNotifications;
