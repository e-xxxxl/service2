// hooks/useChat.js
import React, { useState, useCallback } from 'react';

export function useChat() {
  const [isConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [error, setError] = useState(null);

  const joinConversation = (conversationId) => {
    console.log('Join conversation:', conversationId);
  };

  const leaveConversation = (conversationId) => {
    console.log('Leave conversation:', conversationId);
  };

  const sendMessage = async (conversationId, recipientId, text) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const isProvider = localStorage.getItem('userAccountType') === 'provider';
      const endpoint = isProvider 
        ? `${API_URL}/provider/messages/${recipientId}`
        : `${API_URL}/customer/messages/${recipientId}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.warning || data.message);
        setTimeout(() => setError(null), 5000);
        return;
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'me',
        createdAt: new Date().toISOString()
      }]);

    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
      setTimeout(() => setError(null), 5000);
    }
  };

  const startTyping = () => {};
  const stopTyping = () => {};
  const markAsRead = () => {};

  return {
    isConnected,
    messages,
    conversations,
    typingUsers,
    error,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead
  };
}