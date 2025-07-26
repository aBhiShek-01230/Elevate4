import { React, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import Card from "../components/Card";
import { StudentContext } from "../context/StudentContext";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [activeButton, setActiveButton] = useState("Chemistry");
  const buttons = ["Chemistry", "Physics", "Biology", "Electrical"];

  const [hovered, setHovered] = useState(false);

  const { navigate, userData, setToken, token, userCourses, allLabs } =
    useContext(StudentContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    localStorage.removeItem("hasRefreshed");
    navigate("/login");
    toast.success("User Logged out Successfully");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const filteredLabs = Array.isArray(allLabs)? allLabs.filter((lab) => lab.type === activeButton):[];
 
  return (
    <div
      className="flex h-screen  bg-cover bg-center bg-no-repeat  "
      style={{ backgroundImage: "url('/pBgW.png')" }}
    >
      <SideBar />

      {/* ----------------profile middle------------------- */}
      <div className="flex flex-col justify-between shadow p-5 gap-5 h-screen border-r-1">
        <div className="top flex flex-col gap-5">
          <div className="w-full flex flex-col items-center gap-4">
            {/* Profile Upload */}
            <div className="relative">
              <div
                className={`profile rounded-full ${
                  !userData.avatar ? "border border-gray-800" : null
                } w-30 h-30  overflow-hidden cursor-pointer flex items-center justify-center bg-transparent`}
              >
                {userData ? (
                  <img
                    src={userData.avatar || "/loading2.gif"}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/loading.gif" alt="" />
                )}
              </div>
            </div>
          </div>
          <div className="detail">
            <p className="font-semibold text-xl">
              {userData.fullName || "loading..."}
            </p>
            <p className="text-gray-500">
              {userData.username || "loading...."}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => setActiveButton(btn)}
              className={`w-full shadow p-2 rounded-md cursor-pointer hover:scale-105 hover:bg-violet-300 hover:text-black  transition 
      ${
        activeButton === btn ? "bg-[#5e865b] text-white scale-105 " : "bg-white"
      }
    `}
            >
              {btn}
            </button>
          ))}
        </div>

        <button
          className="w-full shadow p-2 rounded-md cursor-pointer hover:scale-105 transition bg-white hover:bg-red-400 hover:text-white flex items-center justify-center gap-2"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={logout}
        >
          <p>Log out</p>
          <img
            className="w-5"
            src={hovered ? "/logout.svg" : "/logoutD.svg"} // white or dark icon
            alt="logout"
          />
        </button>
      </div>
      {/* ----------------Right Side------------------- */}

      <div className="flex flex-col  gap-5  overflow-scroll w-full">
        <div className="rounded-md  p-5">
          <div className=" flex flex-col  mt-3 rounded-t-xl rounded-b-none w-full bg-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] pt-3 border-t-1 border-l-1 border-r-1 ">
            <div className="flex items-center gap-2 font-bold text-2xl  border-b-1 pb-3">
              <p className="pl-3">{activeButton == "Chemistry" ? "Chemistry":activeButton == "Physics"?"Physics":activeButton == "Biology"?"Biology":"Electrical"}</p>
              <img src={activeButton == "Chemistry" ? "/cLab.gif":activeButton == "Physics"?"/pLab.gif":activeButton == "Biology"?"/bLab.gif":"/eLab.gif"} className="w-10" alt="" />
            </div>
            {/* ----------------------Experiment list--------------- */}

            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab, index) => (
                <div
                  key={lab._id || index}
                  className="exp p-4 w-full flex items-center justify-between border-b-1 bg-[#f3f5f9] hover:bg-[#cbcdd1] cursor-pointer font-semibold"
                >
                  <p>{lab.name}</p>
                  <button className="border-1 border-black p-1.5 pl-10 pr-10 text-white hover:bg-[#5e865b] rounded bg-amber-600 cursor-pointer">
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
  );
};

export default Profile;
