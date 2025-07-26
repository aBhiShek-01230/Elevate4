import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { StudentContext } from "../context/StudentContext";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import LeaderBoard from "../components/LeaderBoard";
import Activity from "../components/Activity";
import Select from "../components/Select";
import CustomCalendar from "../components/Calendar/CustomCalendar";
import Chat from "../components/Chat";

const StudentHome = () => {
  const { userData, navigate, userCourses, courses, showC, setShowC} =
    useContext(StudentContext);
  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      localStorage.setItem("hasRefreshed", "true");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
  }, []);

  return (
    <div className="flex bg-[#f3f5f9]">
      {/* -------------------------Left--------------------------- */}
      <Sidebar />

      {/* -------------------------Middle---------------------------*/}
      <div className="w-[70%] bg-[#f3f5f9] h-screen overflow-scroll ">
        <div className="flex items-center justify-start gap-10 ">
          <p className="font-bold text-[#A7A7A8] pl-3 pr-3">Dashboard</p>
          <SearchBar home={true} practice={false} subject={false}/>
        </div>
        <div className="pl-3 pr-3 ">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold">
              {showC
                ? "Explore Courses"
                : userCourses && userCourses.length > 0
                ? "My Courses"
                : "Explore Courses"}
            </p>
            <div className="view" onClick={()=>{
              setShowC(!showC)
            }}>
              <p className="cursor-pointer text-[#A7A7A8] hover:text-black ">
                View All
              </p>
              <hr className="text-[#A7A7A8] " />
            </div>
          </div>
        </div>

        {showC ? (
          <div className="flex  items-center flex-wrap">
            { courses?.length > 0 ?
            courses.map((course) => (
              <Card
                key={course._id}
                completed={0} // or dynamic progress if available
                courseImg={course.thumbnail || "/default.jpg"}
                courseName={course.courseName}
                id={course._id}
              />
            )):
            <div className="div flex items-center justify-center w-full">
              Not Available
            </div>
            }
          </div>
        ) : userCourses && userCourses.length >= 0 ? (
          userCourses.length > 0 ? (
            <div className="flex  items-center ">
              {userCourses.slice(0, 3).map((course) => (
                <Card
                  key={course._id}
                  completed={0} // or dynamic progress if available
                  courseImg={course.thumbnail || "/default.jpg"}
                  courseName={course.courseName}
                  id={course._id}
                />
              ))}
            </div>
          ) : (
            <div className="flex  items-center">
              {courses.slice(0,4).map((course) => (
                <Card
                  key={course._id}
                  completed={0} // or dynamic progress if available
                  courseImg={course.thumbnail || "/default.jpg"}
                  courseName={course.courseName}
                  id={course._id}
                />
              ))}
            </div>
          )
        ) : (
         <div className="flex items-center justify-center w-full">
           <img src="/loading3.gif" alt="" className="w-13"/>
         </div>
        )}

        <div
          className={` ${showC ? "hidden" : null} bottom flex justify-between`}
        >
          <LeaderBoard />
          <Activity />
        </div>
      </div>

      {/* -------------------------Right--------------------------- */}

      <div
        className={`  flex flex-col items-center  mt-3  w-[30%]`}
      >
       <div className="div flex flex-col items-center  h-full justify-between mb-25 ">
         <Select username={"Abhishek"} image={"/prof.jpg"} />
        <div className="bg-[#2b2b2b] border-2   flex flex-col items-center justify-center text-white p-7 rounded-2xl w-full ">
          <p>Hi👋, {userData?.fullName && userData?.fullName?.split(" ")[0]}</p>
          <p>Good luck with your studies.</p>
        </div>
        <CustomCalendar />
       </div>
        <Chat  />
      </div>
    </div>
  );
};

export default StudentHome;
