import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Message/SideBar';
import ChatHeader from '../components/Message/ChatHeader';
import ChatMessage from '../components/Message/ChatMessage';
import ChatInput from '../components/Message/ChatInput';

const dummyUsers = [
  { id: 1, name: 'Alice', lastMessage: 'See you tomorrow!', messages: ['Hello!', 'How are you?', 'See you tomorrow!'] },
  { id: 2, name: 'Bob', lastMessage: 'Sure, I will do that.', messages: ['Hi!', 'I got the files.', 'Sure, I will do that.'] },
  
  
];

const ChatPage = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const onSend = () => {
    if (!message.trim()) return;
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? { ...u, messages: [...u.messages, message], lastMessage: message } : u
    );
    setUsers(updatedUsers);
    setCurrentUser((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-[#f3f5f9] dark:bg-[black]">
      <Sidebar users={users} onSelectUser={setCurrentUser} theme={theme} setTheme={setTheme} />
      <div className="flex-1 flex flex-col">
        {currentUser ? (
          <>
            <ChatHeader user={currentUser} />
            <div className="flex-1 overflow-auto p-4">
              {currentUser.messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} isSender={index % 2 === 0} />
              ))}
            </div>
            <ChatInput message={message} setMessage={setMessage} onSend={onSend} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;