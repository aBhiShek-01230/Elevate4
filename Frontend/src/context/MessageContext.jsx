import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import axiosInstance from '../Config/axiosConfig.js'

export const MessageContext = createContext();


const MessageContextProvider = (props) => {
    
const [userChats, setUserChats] = useState();

const[currentUserId, setCurrentUserId] = useState("");

const getUserChats = async () => {
  try {
    const response = await axiosInstance.get('/message/');
    console.log(response.data)
    
    
    setUserChats(response.data)
    
    
    // setUserData(response.data);
  } catch (error) {
    console.error(error.response?.data || 'Error fetching user data');
  }
};


useEffect(()=>{
  setCurrentUserId(JSON.parse(localStorage.getItem("user"))?._id)

},[])


  const value = { getUserChats, userChats,currentUserId };   

  return (
    <MessageContext.Provider value={value}>
      {props.children}
    
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
