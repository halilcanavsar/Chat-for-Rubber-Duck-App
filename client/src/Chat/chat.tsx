//@ts-nocheck
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
import { ChangeEvent } from 'react';

const backendPORT = process.env.REACT_APP_BACKEND_PORT || '3001';

const socket = io(`http://localhost:${backendPORT}`, {
  transports: ['websocket'],
});

interface ArrivalMessage {
  text: string;
  time: Date;
  language?: string;
  type?: string;
  mimeType?: string;
  body?: File;
  imgSource?: string;
}

function Chat() {
  const [messages, setMessages] = useState([] as ArrivalMessage[]);
  const [imgSources, setImgSources] = useState();
  const [file, setFile] = useState();
  const [showLangDropDown, setShowLangDropDown] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState({
    text: '',
    time: new Date(),
    language: '',
    type: '',
    mimeType: '',
    fileName: '',
    body: undefined,
    imgSource: '',
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
    //creating text object
    const messageObject = {
      text: e.target.value,
      time: new Date(),
      language: arrivalMessage.language,
      type: 'text',
    };
    setArrivalMessage(messageObject);
  };

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    socket.emit('sendMessage', arrivalMessage);
    setArrivalMessage({
      text: '',
      time: new Date(),
      language: '',
      type: '',
      mimeType: '',
      fileName: '',
    });

    setFile();
  };

  const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
    setArrivalMessage({
      ...arrivalMessage,
      text: e.target.files[0].name,
      fileName: e.target.files[0].name,
      mimeType: e.target.files[0].type,
      blob: new Blob([e.target.files[0]], {
        type: e.target.files[0].type,
      }),
      type: 'file',
      imgSource: URL.createObjectURL(e.target.files[0]),
    });
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  useEffect(() => {
    socket.on('receiveMessage', (data: any) => {
      if (data.type === 'file') {
        console.log('data', data);
        const blob = new Blob([data.blob], { type: data.mimeType });

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(blob);
        fileReader.onload = () => {
          // const arrayBuffer = fileReader.result;
          // const blob = new Blob([arrayBuffer], { type: data.mimeType });
          const url = URL.createObjectURL(blob);
          setImgSources(url);
        };
      }

      setMessages([...messages, data]);

      //   const recievedMessageBlob = new Blob([data.blob], {
      //     type: data.mimeType,
      //   });
      //   data.blob = blob;
      // }

      // setMessages([...messages, data]);
    });
  }, [messages]);

  // useEffect(() => {
  //   messages.forEach((message: any) => {
  //     if (message.type === file) {

  //     }

  //   if (arrivalMessage.blob) {
  //     console.log(arrivalMessage.blob);
  //     const reader = new FileReader();
  //     reader.readAsDataURL(arrivalMessage.blob);
  //     reader.onloadend = () => {
  //       setImgSources(reader.result);
  //     };
  //   }
  // }, [arrivalMessage.blob]);

  return (
    <div className="chat-container">
      <img src="../assets/send-icon.png" alt="" />
      <div className="chat-form">
        <form className="text-area-form" onSubmit={sendMessage}>
          {' '}
          {/* chat area */}
          <textarea
            value={arrivalMessage.text}
            onChange={createMessage}
            placeholder="Type a message..."
            required
          />
          {arrivalMessage.type !== 'file' && arrivalMessage.text === '' ? ( //button for sending message
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
          <input type="file" name="file" id="file" onChange={selectFile} />
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

        <form className="upload-image-form"></form>
      </div>

      <div className="chat-messages">
        {messages.map(
          (
            message: any //chat messages
          ) => (
            <div className="chat-message">
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
                <img src={message.imgSource} alt={message.fileName} />
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
          )
        )}
      </div>
    </div>
  );
}

export default Chat;
