import './chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';

const backendPORT = process.env.REACT_APP_BACKEND_PORT || '3001';

const socket = io(`http://localhost:${backendPORT}`, {
  transports: ['websocket'],
});

interface ArrivalMessage {
  text: String | any;
  time: Date;
}

function Chat() {
  const [messages, setMessages] = useState([] as ArrivalMessage[]);
  // const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState({
    text: '',
    time: new Date(),
  } as ArrivalMessage);

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    socket.emit('sendMessage', arrivalMessage);
    setArrivalMessage({
      text: '',
      time: new Date(),
    });
  };

  useEffect(() => {
    socket.on('receiveMessage', (data: any) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-form">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={arrivalMessage.text}
            onChange={(e) =>
              setArrivalMessage({ ...arrivalMessage, text: e.target.value })
            }
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>

      <div className="chat-messages">
        {messages.map((message: any) => (
          <div className="chat-message">
            <div className="chat-message-text">{message.text}</div>

            <div className="chat-message-time">{format(message.time)}</div>

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
