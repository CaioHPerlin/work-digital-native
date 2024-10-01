import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

type Notifications = {
  unreadChats: string[];
  unreadChatAmount: number;
  messageNotifications: { [chatId: string]: number };
};

interface ChatNotificationsContextProps {
  unreadChats: string[];
  unreadChatAmount: number;
  messageNotifications: { [chatId: string]: number };
  markChatAsRead: (chatId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

// Create the context
const ChatNotificationsContext = createContext<
  ChatNotificationsContextProps | undefined
>(undefined);

// Create the provider component
export const ChatNotificationsProvider: React.FC<{
  userId: string;
  children: any;
}> = ({ userId, children }) => {
  const [notifications, setNotifications] = useState<Notifications>({
    unreadChats: [],
    unreadChatAmount: 0,
    messageNotifications: {},
  });

  const fetchNotifications = useCallback(async () => {
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

      await Promise.all(
        chatsData.map(async (chat) => {
          const isUser1 = chat.user_1_id === userId;
          const isUnread = isUser1 ? !chat.user_1_read : !chat.user_2_read;

          if (isUnread) {
            unreadChatsSet.add(chat.id);

            const { data: messagesData, error: messagesError } = await supabase
              .from("messages")
              .select("id, created_at")
              .eq("chat_id", chat.id)
              .gt(
                "created_at",
                isUser1 ? chat.user_1_read_at ?? "" : chat.user_2_read_at ?? ""
              );

            if (messagesError) throw messagesError;

            messageNotificationMap[chat.id] = messagesData.length;
          }
        })
      );

      setNotifications({
        unreadChats: Array.from(unreadChatsSet),
        unreadChatAmount: unreadChatsSet.size,
        messageNotifications: messageNotificationMap,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userId]);

  const markChatAsRead = useCallback(
    async (chatId: string) => {
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

        let updateData = {};
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

        const { error: updateError } = await supabase
          .from("chats")
          .update(updateData)
          .eq("id", chatId);

        if (updateError) throw updateError;

        setNotifications((prev) => ({
          ...prev,
          unreadChats: prev.unreadChats.filter((id) => id !== chatId),
          unreadChatAmount: prev.unreadChats.filter((id) => id !== chatId)
            .length,
          messageNotifications: {
            ...prev.messageNotifications,
            [chatId]: 0,
          },
        }));
      } catch (error) {
        console.error("Error marking chat as read:", error);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchNotifications();

    const messageSub = supabase
      .channel(userId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    const chatSub = supabase
      .channel(userId + "_chat")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chats" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      messageSub.unsubscribe();
      chatSub.unsubscribe();
    };
  }, [userId, fetchNotifications]);

  return (
    <ChatNotificationsContext.Provider
      value={{
        unreadChats: notifications.unreadChats,
        unreadChatAmount: notifications.unreadChatAmount,
        messageNotifications: notifications.messageNotifications,
        markChatAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </ChatNotificationsContext.Provider>
  );
};

// Custom hook to use the context
export const useChatNotifications = () => {
  const context = useContext(ChatNotificationsContext);
  if (!context) {
    throw new Error(
      "useChatNotifications must be used within a ChatNotificationsProvider"
    );
  }
  return context;
};
