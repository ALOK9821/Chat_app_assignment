import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = ({ authToken }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null); // Using useRef to persist WebSocket across renders

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Fetch chat history from the backend
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/messages', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setMessages(response.data);
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

  const sendMessage = async () => {
    if (message && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);

      try {
        await axios.post(
          'http://localhost:1337/api/messages',
          { content: message, timestamp: new Date() },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } catch (error) {
        console.error('Error saving message:', error);
      }

      setMessage('');
    } else {
      console.error('WebSocket is not open or message is empty');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
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
