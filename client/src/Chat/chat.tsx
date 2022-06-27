//@ts-nocheck
import './chat.scss';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';

import { format } from 'timeago.js';
import Prism from 'prismjs';
import '../themes/prism-one-dark.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import { ChangeEvent } from 'react';

const backendPORT = process.env.REACT_APP_BACKEND_PORT || '3001';

const socket = io(`http://localhost:${backendPORT}`, {
  transports: ['websocket'],
});

interface ArrivalMessage {
  text?: string | any;
  time: Date;
  language?: string;
  type?: string;
  mimeType?: string;
  fileName?: string;
}

function Chat() {
  const [messages, setMessages] = useState([] as ArrivalMessage[]);
  const [imgSources, setImgSources] = useState('');
  const [blob, setBlob] = useState(new Blob());
  const [file, setFile] = useState();
  const [showLangDropDown, setShowLangDropDown] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState({
    text: '',
    time: new Date(),
    language: '',
    type: '',
    mimeType: '',
    fileName: '',
  } as ArrivalMessage);

  const langList = [
    'javascript',
    'css',
    'html',
    'java',
    'python',
    'typescript',
  ];

  const handleLanguageChange = (event: any) => {
    arrivalMessage.language = event.target.value;
  };

  const handleInputTypeClick = (e: any) => {
    e.preventDefault();
    setShowLangDropDown(!showLangDropDown);
  };

  const createMessage = (e: any) => {
    if (file) {
      const messageObject = {
        text: file,
        time: new Date(),
        type: 'file',
        //@ts-ignore
        mimeType: file.type,
        //@ts-ignore
        fileName: file.name,
      };

      setArrivalMessage(messageObject);
      const blob = new Blob([arrivalMessage.text], {
        type: arrivalMessage.type,
      });
      setBlob(blob);
    } else {
      const messageObject = {
        text: e.target.value,
        time: new Date(),
        language: arrivalMessage.language,
        type: 'text',
      };
      setArrivalMessage(messageObject);
    }
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

  const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
    setArrivalMessage({
      ...arrivalMessage,
      fileName: e.target.files[0].name,
      mimeType: e.target.files[0].type,
    });
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  useEffect(() => {
    socket.on('receiveMessage', (data: any) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  useEffect(() => {
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      setImgSources(reader.result);
    };
  }, [blob]);

  return (
    <div className="chat-container">
      <img src="../assets/send-icon.png" alt="" />
      <div className="chat-form">
        <form className="text-area-form" onSubmit={sendMessage}>
          <textarea
            value={arrivalMessage.text}
            onChange={createMessage}
            placeholder="Type a message..."
            required
          />
          {arrivalMessage.text === '' ? (
            <button className="send-btn" type="submit" disabled>
              <img
                src={require('../assets/send-icon.png')}
                alt="send icon"
                className="send-icon"
              ></img>
            </button>
          ) : (
            <button className="send-btn" type="submit">
              <img
                src={require('../assets/send-icon.png')}
                alt="send icon"
                className="send-icon"
              ></img>
            </button>
          )}
        </form>

        <form className="input-type-form">
          {showLangDropDown ? (
            <select onChange={handleLanguageChange} name="languages">
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
            {showLangDropDown ? (
              <img
                src={require('../assets/text-button-icon-48.png')}
                alt="code-icon"
              />
            ) : (
              <img
                src={require('../assets/code-icon-32.png')}
                alt="code-icon"
              />
            )}
          </button>
        </form>

        <form className="upload-image-form">
          <input type="file" name="file" id="file" onChange={selectFile} />
          <button className="upload-image-btn" type="submit">
            A
          </button>
        </form>
      </div>

      <div className="chat-messages">
        {messages.map((message: any) => (
          <div className="chat-message">
            {/* {message.type === 'text' ? (
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
            ) : (
              <img src={imgSources} alt={message.fileName} />
            )
            } */}

            {message.type === 'text' ? (
              <div className="chat-message-text">
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
              </div>
            ) : (
              <img src={imgSources} alt={message.fileName} />
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
