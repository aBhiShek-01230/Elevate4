import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import { StudentContext } from "../context/StudentContext";
import axios from 'axios'



const Subject = () => {

  const { id } = useParams(); 
  const { navigate,backendUrl,topics, setTopics, getTopic } = useContext(StudentContext)
  
  
  const bg = ["bg-blue-100","bg-yellow-100","bg-pink-100","bg-green-100","bg-purple-100","bg-orange-100"]
  
  useEffect(()=>{

    

    getTopic(id);

  },[])
  


  return (
    <div className="div flex bg-[#f3f5f9]">
      <SideBar/>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-h-screen overflow-scroll">

        <div className="div flex items-center max-w-2/3 justify-between mb-3">
         <Logo size='35px' />
         <h1 className="text-3xl font-bold  text-center text-gray-800">
         Practice Questions by Subject
         </h1>
       </div>

       <SearchBar home={false} practice={false} subject={true}/>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3 overflow-scroll ">
          {topics?.length> 0 ? topics?.map((topic, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:scale-105 ${bg[Math.floor(Math.random() * bg.length)]}`}
              onClick={()=>navigate(`/problems/${topic._id}`)}
            >
              <div className="text-5xl mb-4">
                 <img src={topic?.thumbnail} alt={topic?.name} className='w-10' />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {topic?.name}
              </h2>
              <p className="text-gray-700">{topic?.description}</p>
              <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer">
                Start Now
              </button>
            </div>
          ))
        :
        <div className="text-3xl font-bold text-gray-800 text-center mt-10
        ">No topics available</div>
        }
        </div>
      </div>
    </div>
  );
};

export default Subject;
