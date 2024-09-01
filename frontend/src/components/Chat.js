import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { addMessage, getMessages, clearMessages } from './db';

const Chat = ({ authToken, onLogout }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      const newMessage = { content: event.data, timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      addMessage(newMessage); // Store the message locally in IndexedDB
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    const fetchChatHistory = async () => {
      try {
        const localMessages = await getMessages(); // Fetch from IndexedDB
        setMessages(localMessages);

        const response = await axios.get('http://localhost:1337/api/messages', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setMessages((prevMessages) => [...prevMessages, ...response.data]);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [authToken]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (message && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);

      const newMessage = {
        content: message,
        timestamp: new Date(),
      };

      try {
        await axios.post(
          'http://localhost:1337/api/messages',
          newMessage,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        await addMessage(newMessage); // Store the message locally

      } catch (error) {
        console.error('Error saving message:', error);
      }

      setMessage('');
    } else {
      console.error('WebSocket is not open or message is empty');
    }
  };

  return (
    <div className="container chat-container">
      <h2>Chat</h2>
      <button onClick={onLogout} style={{ marginBottom: '10px', alignSelf: 'flex-end' }}>
        Logout
      </button>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.content || msg}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll to this element */}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
