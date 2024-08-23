import axios from "axios";

const API_BASE_URL = "https://app-api-pied.vercel.app";

interface StartConversationResponse {
  conversationId: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  user_id: string;
  freelancer_id: string;
  freelancer_name?: string;
}

interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
}

export const startConversation = async (
  userId: string,
  freelancerId: string
): Promise<StartConversationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/conversations`, {
      user_id: userId,
      freelancer_id: freelancerId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error starting conversation:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getConversationById = async (
  conversationId: string
): Promise<ConversationWithMessages> => {
  try {
    const response = await axios.get<ConversationWithMessages>(
      `${API_BASE_URL}/conversations/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

interface SendMessageResponse {
  messageId: string;
  sender: string;
}

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string
): Promise<SendMessageResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getConversationsByUser = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations for user:", error);
    throw error;
  }
};

export const getConversationsByFreelancer = async (freelancerId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations`, {
      params: { freelancer_id: freelancerId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations for freelancer:", error);
    throw error;
  }
};
