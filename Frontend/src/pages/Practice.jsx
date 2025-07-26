import React, { useContext, useEffect, useState } from 'react';
import Logo from '../components/Logo';
import SideBar from '../components/SideBar';
import SearchBar from '../components/SearchBar';
import { StudentContext } from '../context/StudentContext';
import axios from 'axios'
import { useMemo } from "react";




const Practice = () => {
  const { navigate,backendUrl } = useContext(StudentContext)
  const bg = ["bg-blue-100","bg-yellow-100","bg-pink-100","bg-green-100","bg-purple-100","bg-orange-100"]
  
  const{subjects,setSubjects,getSubjects} = useContext(StudentContext)

  useEffect(()=>{
    getSubjects();
  },[])

  

  
  return (

    <div className="div flex bg-[#f3f5f9]">
      <SideBar/>
      <div className="min-h-screen  p-4 md:p-8">
      
      <div className="div flex items-center max-w-2/3 justify-between mb-3">
        <Logo size='35px' />
        <h1 className="text-3xl font-bold  text-center text-gray-800">
        Practice Questions by Subject
      </h1>
      </div>
      <SearchBar home={false} practice={true} subject={false} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
        {subjects?.length > 0 ? subjects?.map((subject, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:scale-105 ${bg[Math.floor(Math.random() * bg.length)]}`}
            onClick={()=>navigate(`/subject/${subject._id}`)}
          >
            <div className="text-5xl mb-4">
              <img src={subject?.thumbnail} alt={subject?.name} className='w-10' />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{subject?.name}</h2>
            <p className="text-gray-700">{subject?.description}</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer">
              Start Practicing
            </button>
          </div>
        ))
      :
      <div className="div">
        <h1 className="text-3xl font-bold text-gray-800">No subjects found</h1>
      </div>
      }
      </div>
    </div>
    </div>
    
  );
};

export default Practice;
