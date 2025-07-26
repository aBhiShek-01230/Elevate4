import React, { useState } from "react";
import { useContext } from "react";
import { MessageContext } from "../../context/MessageContext";
import { useEffect } from "react";
import axiosInstance from "../../Config/axiosConfig";
const Sidebar = ({ onSelectUser, theme, setTheme }) => {

  const[expanded,setExpanded] = useState(true)
  const[hidden,setHidden] = useState(true);
 const { getUserChats, userChats,currentUserId } = useContext(MessageContext)



  useEffect(()=>{
    getUserChats()
    console.log(userChats?.length)
  },[])




  return (
    <div className={`w-full sm:w-1/3 md:w-1/4 bg-white dark:bg-[#10172a] border-r border-gray-300 dark:border-gray-700 h-full flex flex-col  ${expanded ? "max-w-screen" : "max-w-18"}`}>
      <div className={`p-4 flex justify-center items-center border-b border-gray-300 dark:border-gray-700 gap-4   }`}>
        <input
          type="text"
          placeholder="Search"
          className={`w-full p-1 pl-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-0 ${!expanded && "hidden"}  `}
        />
        <button className="cursor-pointer" onClick={()=>setHidden(!hidden)}>
          <img src="/edit-dark.svg" alt="" className="w-7.5" />{" "}
        </button>
      </div>
      <div className={`overflow-auto flex-1  `}>

       {userChats?.map((chat) => {
  const isGroup = chat?.isGroupChat;
  const otherUser = isGroup
    ? null
    : chat?.users?.find((u) => u._id !== currentUserId);

  return (
    <div
      key={chat?._id}
      onClick={() => onSelectUser(chat)}
      className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex gap-4 items-center "
    >
      <div
        className="w-13 h-13 rounded-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${isGroup ? "/group.svg" : otherUser?.avatar || "/profile.svg"}')`,
        }}
      />
      <div className={`${!expanded && "hidden"}`}>
        <h3 className="text-sm font-semibold dark:text-white">
          {isGroup ? chat?.chatName : otherUser?.fullName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {chat?.latestMessage?.content || "No messages yet"}
        </p>
      </div>
    </div>
  );
})}

      </div>
      <div className="border border-gray-700 text-white p-3 flex items-center justify-between  ">
      {expanded && <img src="/light.svg" className="w-4 cursor-pointer" alt="" />}
        <img src="/previous.png" className="w-5 cursor-pointer ml-2" alt=""  onClick={()=>setExpanded(!expanded)}/>
      </div>


      { !hidden && 
      <div className="fixed left-2/5 m-2 p-3 border-1 border-gray-700 rounded text-white flex flex-col items-center pt-1  w-1/4 max-h-screen bg-black">
      <div className="div flex items-center justify-between w-full p-1">
        <img src="/previous.png" alt=""  className="w-5 cursor-pointer" onClick={()=>setHidden(true)} />
        <p>New Chat</p>
      </div>
        <input
          type="text"
          placeholder="Search name / Student id"
          className={`w-full p-1 pl-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-0   mt-2 `}
        />
        <div className="div flex itc justify-between w-full pl-5 pr-5 mt-3 bg-gray-800 p-2 rounded hover:bg-gray-900">
          <img src="/group.svg" alt="" className="w-5"/>
          <p>New Group</p>
        </div>
        <div className={`overflow-auto flex-1 w-full mt-2 `}>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="p-1 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 flex gap-4 items-center w-full rounded bg-gray-800 mt-2 "
          >
            <div className="w-13 h-13  rounded-full  bg-[url('/profile.svg')] bg-cover bg-center " />

            <div className= {` `}>
              <h3 className="text-sm font-semibold dark:text-white">
                {user.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
      </div>
      
      }
    </div>
  );
};

export default Sidebar;
