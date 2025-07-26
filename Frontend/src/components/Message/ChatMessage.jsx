import React from 'react';

const ChatMessage = ({ message, isSender }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${isSender ? 'bg-[#6DB6DF] text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;