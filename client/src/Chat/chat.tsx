import './chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import e from 'express';

const backendPORT = process.env.REACT_APP_BACKEND_PORT || '3001';

const socket = io(`http://localhost:${backendPORT}`, {
  transports: ['websocket'],
});

function Chat() {
  const [messages, setMessages] = useState([] as any);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    socket.emit('sendMessage', newMessage);
    console.log(newMessage);
    setNewMessage('');
  };

  useEffect(() => {
    console.log(messages);
    socket.on('receiveMessage', (message: any) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-form">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>

      <div className="chat-messages">
        {messages.map((message: String) => (
          <div className="chat-message">
            <div className="chat-message-text">{message}</div>

            <div className="chat-message-time">
              <span>{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="chat-message-avatar">
              <img src="https://via.placeholder.com/150" alt="avatar" />

              <div className="chat-message-avatar-name">
                <span>John Doe</span>

                <span>
                  <i className="fas fa-circle"></i>
                </span>
              </div>

              <div className="chat-message-avatar-status">
                <span>Online</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
