import React from 'react'
import { StudentContext } from "../context/StudentContext";
import { useContext, useEffect } from "react";
import Navbar from './Navbar';

const ListLabs = () => {


  const { allLabs,labType } =useContext(StudentContext);
  const filteredLabs = Array.isArray(allLabs)? allLabs.filter((lab) => lab.type === labType): [];

  return (

     <div className={'relative h-screen flex flex-col'}>
      {/* Background image blur */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-[2px]" style={{ backgroundImage: "url('/background.jpg')" }}></div>

      <Navbar/>


     <div className="flex flex-col  gap-5 overflow-scroll  w-full">
        <div className="rounded-md  p-5 ">
          <div className=" flex flex-col  mt-3 rounded-t-xl rounded-b-none w-full bg-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] pt-3 border-t-1 border-l-1 border-r-1 ">
            <div className="flex items-center gap-2 font-bold text-2xl  border-b-1 pb-3 ">
              <p className="pl-3">{labType == "Chemistry" ? "Chemistry":labType == "Physics"?"Physics":labType == "Biology"?"Biology":labType == "Electrical"?"Electrical":"Chemistry"}</p>
              <img src={labType == "Chemistry" ? "/cLab.gif":labType == "Physics"?"/pLab.gif":labType == "Biology"?"/bLab.gif":labType == "Electrical"?"/eLab.svg":null} className="w-10" alt="" />
            </div>
            {/* ----------------------Experiment list--------------- */}

            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab, index) => (
                <div
                  key={lab._id || index}
                  className="exp p-4 w-full flex items-center justify-between border-b-1 bg-[#f3f5f9] hover:bg-[#cbcdd1] cursor-pointer font-semibold "
                >
                  <p>{lab.name}</p>
                  <button className="border-1 border-black p-1.5 pl-10 pr-10 text-white hover:bg-[#5e865b] rounded bg-amber-600 cursor-pointer" onClick={()=>{
                    window.location.href = `${lab.simulation}`;
                  }}> 
                    <img src="/play.svg" className="w-3" alt="play" />
                  </button>
                </div>
              ))
            ) : (
              <img className="w-20" csrc="/loading2.gif" alt="" />
            )}

          </div>
        </div>
      </div>
      </div>
  )
}

export default ListLabs
