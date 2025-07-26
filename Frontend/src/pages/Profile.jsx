import { React, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import Card from "../components/Card";
import { StudentContext } from "../context/StudentContext";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [activeButton, setActiveButton] = useState("Basic Detail");
  const buttons = ["Basic Detail", "Courses", "Your Playlist", "Quiz", "Lab"];

  const [hovered, setHovered] = useState(false);
  const basicRef = useRef(null);
  const courseRef = useRef(null);
  const playlistRef = useRef(null);
  const quizRef = useRef(null);
  const labRef = useRef(null); // if needed
  const { navigate, userData, setToken,token, userCourses } =useContext(StudentContext);

  const scrollToSection = (btn) => {
    setActiveButton(btn);
    const refs = {
      "Basic Detail": basicRef,
      Courses: courseRef,
      "Your Playlist": playlistRef,
      Quiz: quizRef,
      Lab: labRef,
    };
    refs[btn]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    localStorage.removeItem('hasRefreshed');
    navigate("/login");
    toast.success("User Logged out Successfully");
  };

  const handleClick = (btn) =>{
    if(btn === "Lab"){
      navigate('/lab')
    }else{
      scrollToSection(btn)
    }
  }

    useEffect(() => {
      if(!token){
        navigate('/login')
      }
    }, []);
  
 

  return (
    <div className="flex bg-[#f3f5f9] h-screen">
      <SideBar />
      {/* ----------------profile middle------------------- */}
      <div className="flex flex-col justify-between shadow p-5 gap-5 h-screen">
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

              <label htmlFor="profile-upload">
                <div className="absolute bottom-1 right-0 bg-green-600 text-white rounded-full w-6 h-6     flex-center items-center pl-2 text-sm cursor-pointer">
                  +
                </div>
              </label>
            </div>
          </div>
          <div className="detail">
            <p className="font-semibold text-xl">{userData.fullName||"loading..."}</p>
            <p className="text-gray-500">{userData.username || "loading...."}</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={(key)  => handleClick(btn)}
              
              className={`w-full shadow p-2 rounded-md cursor-pointer hover:scale-105 transition 
      ${
        activeButton === btn ? "bg-[#2b2b2b] text-white scale-105 " : "bg-white"
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

      <div className="flex flex-col justify-between  p-5 gap-5ail overflow-scroll">
        <div className="detail mt-2 shadow  rounded-md  transition  hover:shadow-md p-5">
          <div className="flex items-center gap-2 font-semibold text-2xl">
            <p>Basic Detail</p>
            <img src="/info.svg" className="w-6" alt="" />
          </div>
          {/* ----------------------Basic Detail--------------- */}
          <div
            ref={basicRef}
            className="space-y-4  p-20 mt-3 rounded-md w-6xl "
          >
            <div className="flex items-center">
              <p className="text-gray-500 w-32">Name:</p>
              <p>{userData.fullName || "loading"}</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 w-32">Username:</p>
              <p>{userData.username ||  "loading"}</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 w-32">Email:</p>
              <p>{userData.email ||  "loading"}</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 w-32">About me:</p>
              <p>{userData.aboutMe || "loading"}</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 w-32">Joined:</p>
              <p>{userData.createdAt?.split("T")[0] || "loading"}</p>
            </div>
          </div>
        </div>
        {/* ----------------------Course--------------- */}
        <div
          ref={courseRef}
          className="detail mt-5 shadow  rounded-md  transition  hover:shadow-md p-5"
        >
          <div className="flex items-center gap-3 font-semibold text-2xl">
            <p>My Courses</p>
            <img src="/courseD.svg" className="w-5" alt="" />
          </div>
          { userCourses && userCourses.length >= 0 ? (
            userCourses.length > 0 ?
            <div className="card flex gap-5 pt-10 pb-10 flex-wrap">
              {userCourses.map((course) => (
                <Card
                  key={course._id}
                  id={course._id}
                  completed={15} // or dynamic progress if available
                  courseImg={course.thumbnail || "/default.jpg"}
                  courseName={course.courseName}
                  mg=""
                />
              ))}
            </div>:<p>Currently not subscribed to any course.</p>
          ) : (
            <img src="/loading.gif" alt="" />
          )}
        </div>
        {/* ----------------------PlayList--------------- */}
        <div
          ref={playlistRef}
          className="detail mt-5 shadow  rounded-md  transition  hover:shadow-md p-5"
        >
          <div className="flex items-center gap-3 font-semibold text-2xl">
            <p>My Playlist</p>
            <img src="/playlist.svg" className="w-5" alt="" />
          </div>
          <div className="card flex gap-5 pt-10 pb-10 flex-wrap">
            <Card
              completed={15}
              courseImg={"/dsa.jpeg"}
              courseName={"A to Z DSA"}
              mg={""}
              playlist={true}
            />
            <Card
              completed={15}
              courseImg={"/math.jpeg"}
              courseName={"Math"}
              mg={""}
              playlist={true}
            />
            <Card
              completed={15}
              courseImg={"/physics.jpeg"}
              courseName={"Physics"}
              mg={""}
              playlist={true}
            />
          </div>
        </div>
        {/* ----------------------Quiz--------------- */}
        <div
          ref={quizRef}
          className="detail mt-5 shadow  rounded-md  transition  hover:shadow-md p-5"
        >
          <div className="flex items-center gap-3 font-semibold text-2xl">
            <p>Quizzes</p>
            <img src="/quiz.svg" className="w-5" alt="" />
          </div>
          <div className="card flex gap-5 pt-10 pb-10 flex-wrap">
            <Card
              completed={15}
              courseImg={"/dsa.jpeg"}
              courseName={"A to Z DSA"}
              mg={""}
              playlist={true}
              qz={true}
            />
            <Card
              completed={15}
              courseImg={"/math.jpeg"}
              courseName={"Math"}
              mg={""}
              playlist={true}
              qz={true}
            />
            <Card
              completed={15}
              courseImg={"/physics.jpeg"}
              courseName={"Physics"}
              mg={""}
              playlist={true}
              qz={true}
            />
            <Card
              completed={15}
              courseImg={"/physics.jpeg"}
              courseName={"Physics"}
              mg={""}
              playlist={true}
              qz={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
