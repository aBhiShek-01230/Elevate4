import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StudentContext } from "../context/StudentContext";
import Navbar from "../components/Navbar";

const Lab = () => {

  const { token, navigate,setToken,setLabType } = useContext(StudentContext);
 
 
  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  }, []);




  return (
    <div className={'relative min-h-screen flex flex-col items-center gap-12'}>
      {/* Background image blur */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-[2px]" style={{ backgroundImage: "url('/background.jpg')" }}></div>

      <Navbar />

    

       <p className="text-white text-4xl font-bold text-center ">What are you learning today?</p>

      
        <div className="flex flex-wrap gap-16 items-center justify-center">
          {[
            { label: "Chemistry Lab", img: "/cLab.gif" },
            { label: "Physics Lab", img: "/pLab.gif" },
            { label: "Electrical Lab", img: "/eLab.gif" },
            { label: "Biology Lab", img: "/bLab.gif", noNav: true }
          ].map(({ label, img, noNav }) => (
            <div
              key={label}
              onClick={()=>{
                setLabType(label.replace(" Lab",""));
               localStorage.setItem("labType", label.replace(" Lab",""));
               navigate("/labs");
              }}
              className="flex flex-col items-center justify-center text-white text-2xl border-1 border-white rounded-2xl p-4 cursor-pointer transition-transform duration-300 hover:scale-120 hover:border-transparent hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.8)]"
            >
              <img src={img} alt={label} className="w-48" />
              <p>{label}</p>
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default Lab;
