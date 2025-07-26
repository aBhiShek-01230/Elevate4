import React, { useState } from 'react';

const ChatHeader = ({ user }) => {
  const[close,setClose] = useState(true)
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700">
      <div className="flex itc gap-4">
        <h2 className="text-lg font-semibold dark:text-white">{user.name}</h2>
      <img src={close? "/star.svg" : "/star-y.svg"} alt="" className='w-5 cursor-pointer' onClick={()=>setClose(!close)} />
      </div>
      <div className="flex items-center gap-5">
      <img src="/call.svg"       className='w-5 cursor-pointer hover:shadow-2xl' alt="" />
      <img src="/video-call.svg" className='w-5 cursor-pointer hover:shadow-2xl' alt="" />
      </div>
    </div>
  );
};

export default ChatHeader;