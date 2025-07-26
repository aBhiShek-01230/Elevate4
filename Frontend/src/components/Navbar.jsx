import React, { useContext, useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { StudentContext } from '../context/StudentContext';
import { toast } from 'react-toastify';
import Logo from "./Logo"

const Navbar = () => {
  const [showDrop, setShowDrop] = useState(false);

  const { navigate, token, setToken } = useContext(StudentContext);

  const Logout = () => {
    localStorage.removeItem('token');
    setToken('');
    localStorage.removeItem('hasRefreshed');
    navigate("/login")
    toast.success('Successfully Signed Out');
  };

  

  return (
    <div className="flex items-center justify-between w-full px-4 sm:px-6 py-2 font-medium z-50 relative">
      {/* Logo */}
      <div className="w-36" onClick={()=>navigate('/lab')}>
        <Logo size='30px'/>
        <p className="text-white text-sm">Virtual Lab</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <NavLink to="/lab" className="flex flex-col items-center text-black no-underline">
          <div className="flex items-center justify-center gap-1">
            <img src="/homeD.svg" alt="Home" className="w-7 hover:scale-110" onClick={()=>navigate('/')}/>
          </div>
        </NavLink>

        {/* Profile & Dropdown */}
        <div className="relative p-5">
          <img
            
            src="/profile.svg"
            className="w-[23px] cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_10px_rgba(255,140,0,0.7)] transition duration-300 ease-in-out"
            alt="Profile"
            onMouseEnter={() => setShowDrop(true)}
            onMouseLeave={() => setShowDrop(false)}
          />
          {  showDrop && (
            <div
              className="absolute right-0 top-10 bg-slate-100 text-gray-500 rounded-md p-2 w-36 flex flex-col gap-2 shadow-md z-10"
              onMouseEnter={() => setShowDrop(true)}
              onMouseLeave={() => setShowDrop(false)}
            >
              <p
                onClick={() => navigate('/lab-profile')}
                className="cursor-pointer hover:text-black transition"
              >
                Lab Profile
              </p>
              <p
                onClick={Logout}
                className="cursor-pointer hover:text-black transition"
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
