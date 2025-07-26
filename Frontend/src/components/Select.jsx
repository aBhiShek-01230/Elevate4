import React, { useState } from "react";
import { StudentContext } from "../context/StudentContext";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const Select = ({ image, username }) => {
  const { navigate, token, setToken, userData } = useContext(StudentContext);
  const [selectedOption, setSelectedOption] = useState('');
const handleSelectChange = (e) => {
  const selected = e.target.value;
  console.log(selected)
  setSelectedOption(selected);

  if (selected === 'logout') {
    localStorage.removeItem('token');
    setToken('');
    localStorage.removeItem('hasRefreshed');
    toast.success('User Logged out Successfully');
  } else if (selected === 'profile') {
    navigate('/profile');
  }
};


  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  const [user, setUser] = useState(true);
  return (
    <div className="select flex items-center justify-between border-1 border-[#dfebff] shadow px-5 py-2  rounded-md  gap-2 hover:border-[#9fc1fb] hover:shadow-2xl ">
      <img
        className="w-10  rounded-full"
        src={userData?.avatar || "/user.svg"}
        alt=""
      />
      <select
        className="outline-0"
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="">{userData?.username}</option>
        <option value="profile">My Profile</option>
        <option value="logout">Log Out</option>
      </select>
    </div>
  );
};

export default Select;
