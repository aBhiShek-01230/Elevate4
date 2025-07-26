import React, { useEffect, useRef, useState } from 'react';

const ChatInput = ({ message, setMessage, onSend }) => {
  const [sendBtn, setSendBtn] = useState(false);
  const [options, setOptions] = useState(false);
  const textareaRef = useRef();

  useEffect(() => {
    if (message.length > 0) {
      setSendBtn(true);
    } else {
      setSendBtn(false);
    }
  }, [message]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // set to scroll height
    }
  }, [message]);
  return (
    <div className="  bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 ">
      {options && (
        <div className="bg-gray-800 text-white w-1/8 ml-2 p-2 fixed bottom-16 flex flex-col  rounded-md">
          <div className="div flex items-center gap-4  p-2  rounded-md hover:bg-gray-900 cursor-pointer">
            <img src="/file.svg" className="w-4" alt="" />
            <p>File</p>
          </div>
          <div className="div flex items-center gap-4  p-2  rounded-md hover:bg-gray-900 cursor-pointer">
            <img src="/lab-m.svg" className="w-5" alt="" />
            <p>Lab</p>
          </div>
          <div className="div flex items-center gap-4  p-2  rounded-md hover:bg-gray-900 cursor-pointer">
            <img src="/quiz.png" className="w-5" alt="" />
            <p>Quiz</p>
          </div>

          <div className="div flex items-center gap-4  p-2  rounded-md hover:bg-gray-900 cursor-pointer">
            <img src="/course-m.png" className="w-5" alt="" />
            <p>Course</p>
          </div>

          <div className="div flex items-center gap-4  p-2  rounded-md hover:bg-gray-900 cursor-pointer">
            <img src="/lecture.svg" className="w-5" alt="" />
            <p>Lecture</p>
          </div>
        </div>
      )}
      <div className="flex p-4 gap-2 items-center">
        <button className="mt-1 hover:bg-gray-800 p-2 rounded-full cursor-pointer" onClick={() => setOptions(!options)}>
          <img src={options ? "/close.svg" : "/add.svg"} alt="" className="w-5" />
        </button>

        <textarea
  ref={textareaRef}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }}
  placeholder="Type a message"
  rows={1}
  className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-0 resize-none overflow-y-auto max-h-32"
/>


        {sendBtn && (
          <button
            onClick={onSend}
            className="ml-2 h-10 w-10 bg-[#6DB6DF] text-white rounded-full hover:opacity-90 flex items-center justify-center cursor-pointer"
          >
            <img src="/send.png" className="w-5" alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
