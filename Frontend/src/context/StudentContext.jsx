import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
export const StudentContext = createContext();
import { toast } from 'react-toastify';
import axiosInstance from '../Config/axiosConfig.js'

const StudentContextProvider = (props) => {
    
  const backendUrl ="http://localhost:8000/api/v1"
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [dark, setDark] = useState(false); 
  const [width, setWidth] = useState("100"); 
  const[hidden,setHidden] = useState(true)
  const [showC,setShowC] = useState(false)
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [userCourses, setUserCourses] = useState({});
  const [dForm, setdForm] = useState(false);
  const [allLabs, setAllLabs] = useState({});
  const [courses, setCourses] = useState({});
  const [labType, setLabType] = useState(() => { return localStorage.getItem("labType") || "Chemistry"; 
});

const [language, setLanguage] = useState("java");
const [sourceCode,setSourceCode] = useState(null);
 const [subjects, setSubjects] = useState(null);
 const [topics, setTopics] = useState(null);


 const getTopic = async (id) => {
      try {
        const response = await axios.post(backendUrl + "/practice/topic",{subjectId:id});
        setTopics(response.data.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };

const getUserData = async () => {
  try {
    const response = await axiosInstance.post('/users/profile');
    if(!response.data.success){
      toast.error(response.data.message)
      navigate('/login')
    }
    setUserData(response.data.data)
    
    
    // setUserData(response.data);
  } catch (error) {
    console.error(error.response?.data || 'Error fetching user data');
  }
};
const getAllCourses = async () => {
  try {
    const response = await axiosInstance.post('/users/courses');
    setUserCourses(response.data.data)
  } catch (error) {
    console.error(error.response?.data || 'Error fetching user data');
  }
};

const fetchAllLabs = async () => {
  try {
   const response = await axios.get(backendUrl + '/global/lab')
   
    setAllLabs(response.data.data); 
  } catch (err) {
    console.error("Failed to fetch labs", err);
  }
};
const getCourses = async () => {
  try {
   const response = await axios.get(backendUrl + '/global/courses')
   
    setCourses(response.data.data); 

  } catch (err) {
    console.error("Failed to fetch courses", err);
  }
};

  useEffect(()=>{
    if(!token && localStorage.getItem('token')){
      setToken(localStorage.getItem('token'))
  }
      getUserData()
      getAllCourses()
     fetchAllLabs()
     getCourses()
  },[])

  const getSubjects = async () => {
      try {
        const response = await axios.get(backendUrl + "/practice/subject");
        setSubjects(response.data.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };








  const value = {
   navigate, backendUrl,
    token,setToken,userData,setUserData,
    userCourses, allLabs,labType, setLabType,
    dark, setDark, width, setWidth, hidden,setHidden,courses,setCourses,showC,setShowC,language,setLanguage,sourceCode,setSourceCode,getSubjects,subjects,setSubjects,topics, setTopics,getTopic
  };   

  return (
    <StudentContext.Provider value={value}>
      {props.children}
    
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
