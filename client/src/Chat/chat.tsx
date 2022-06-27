import './chat.scss';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';
import Prism from 'prismjs';
import '../themes/prism-one-dark.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

const backendPORT = process.env.REACT_APP_BACKEND_PORT || '3001';

const socket = io(`http://localhost:${backendPORT}`, {
  transports: ['websocket'],
});

interface ArrivalMessage {
  text: string | any;
  time: Date;
  language: string;
}

function Chat() {
  const [messages, setMessages] = useState([] as ArrivalMessage[]);
  const [showLangDropDown, setShowLangDropDown] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState({
    text: '',
    time: new Date(),
    language: '',
  } as ArrivalMessage);

  const langList = [
    'javascript',
    'css',
    'html',
    'java',
    'python',
    'typescript',
  ];

  const handleChange = (event: any) => {
    arrivalMessage.language = event.target.value;
  };

  const handleInputTypeClick = (e: any) => {
    e.preventDefault();
    setShowLangDropDown(!showLangDropDown);
  };

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    socket.emit('sendMessage', arrivalMessage);
    setArrivalMessage({
      text: '',
      time: new Date(),
      language: '',
    });
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  useEffect(() => {
    socket.on('receiveMessage', (data: any) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-form">
        <form className="text-area-form" onSubmit={sendMessage}>
          {/* <input
            type="text"
            value={arrivalMessage.text}
            onChange={(e) =>
              setArrivalMessage({ ...arrivalMessage, text: e.target.value })
            }
            placeholder="Type a message..."
          /> */}
          <textarea
            value={arrivalMessage.text}
            onChange={(e) =>
              setArrivalMessage({ ...arrivalMessage, text: e.target.value })
            }
            placeholder="Type a message..."
          />
          <button className="send-btn" type="submit">
            ✈️
          </button>
        </form>
        <form className="input-type-form">
          {showLangDropDown ? (
            <select onChange={handleChange} name="languages">
              <option value="" selected>
                Select a language
              </option>
              {langList.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          ) : null}
          <button className="input-type-btn" onClick={handleInputTypeClick}>
            <img src="../assets/code-icon-32.png" alt="code-icon" />
          </button>
        </form>
      </div>

      <div className="chat-messages">
        {messages.map((message: any) => (
          <div className="chat-message">
            {message.language === '' ? (
              <div className="chat-message-text">{message.text}</div>
            ) : (
              <div className="chat-message-text">
                <pre>
                  <code className={`language-${message.language}`}>
                    {message.text}
                  </code>
                </pre>
              </div>
            )}

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
