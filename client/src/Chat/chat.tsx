import './chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io('http://localhost:3000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    socket.emit('sendMessage', { message });
  };

  useEffect(() => {
    socket.on('receiveMessage', (data: String) => {});
  }, [socket]);

  return (
    <div className="chat">
      <div className="chat-form">
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button>Send</button>
      </div>
    </div>
  );
}

export default Chat;
