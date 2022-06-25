import './chat.css';
import io from 'socket.io-client';

import { useEffect } from 'react';

const backendPORT = process.env.REACT_APP_BACKEND_PORT || '3001';

const socket = io(`http://localhost:${backendPORT}`, {
  transports: ['websocket'],
});

// const socket = socketIOClient(`http://localhost:${backendPORT}`);

function Chat() {
  // useEffect(() => {
  //   socket.on('message', (message) => {
  //     console.log(message);
  //   });
  // }, []);

  return (
    <div className="chat">
      <div className="chat-form">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
}

export default Chat;
