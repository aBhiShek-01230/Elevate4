import React, { useContext, useState } from 'react'
import { StudentContext } from '../context/StudentContext';

const Card = ({ courseName, completed, courseImg, mg,playlist,qz,id }) => {
    const {navigate} = useContext(StudentContext)
  

  return (
    <div className={`pb-4 w-55 bg-white rounded-[15px] flex flex-col gap-[30px]             cursor-pointer  hover:shadow-2xl mt-2.5 ${!mg?'mx-3':null} shadow`} onClick={()=>navigate(`/course/${id}`)}>

      <div className="flex flex-col ">
        <img 
          src={courseImg || "/course.jpeg"} 
          alt="course" 
          className="p-5 w-[207px] h-35 rounded-tr-[40px] rounded-tl-[40px] " 
        />
        <p className="mt-0 ml-5">{courseName || "NA"}</p>
      </div>
      {
        !qz?
        <div>
        
        <div 
          className="h-[5px] w-[83%] ml-5 rounded-[10px] mb-0" 
          style={{ background: `linear-gradient(to right, #4CAF50 ${completed || 0}%, #ccc ${completed || 0}%)` }}>
        </div>  
        <div className="px-5 flex items-center justify-between mt-2">
          <p className="text-[#8F8F91] ">{playlist||'Course'} Completed</p>
          
          <p className="text-[#8F8F91]">{completed || "0"}%</p>
        </div>
      </div>:null
      }
      
    </div>
  );
};

export default Card;
