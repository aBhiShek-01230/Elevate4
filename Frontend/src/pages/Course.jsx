import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { StudentContext } from "../context/StudentContext";
import axios from "axios";
import axiosInstance from "../Config/axiosConfig.js";
import Chat from "../components/Chat.jsx"
const Course = () => {
  const { navigate, backendUrl, userData,courseAi,setCourseAi } = useContext(StudentContext);

  const { id } = useParams();
  const [active, setActive] = useState("Lessons");
  const [course, setCourse] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [video, setVideo] = useState(null);
  const [state, setState] = useState("Lessons");

  const buttons = [
    "Lessons",
    "Quizes",
    "Asignment",
    "Doubt",
    "Summary",
    "Teacher",
  ];

  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await axios.post(backendUrl + "/global/course", {
          courseId: id,
        });
        setCourse(response.data.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };

    const hasSubscribed = async () => {
      if (!userData?._id) return; // ✅ Ensure userData is available
      try {
        const response = await axios.post(backendUrl + "/users/subscribed", {
          userId: userData._id,
          courseId: id,
        });
        setSubscribed(response.data.data);
      } catch (err) {
        console.error("Failed to check subscription", err);
      }
    };

    getCourse();
    hasSubscribed();
  }, [id, userData]); // ✅ include userData as a dependency

  const handleSubscribe = async () => {
    if (subscribed) {
      const response = await axiosInstance.post(
        backendUrl + "/users/unsubscribe",
        {
          courseId: id,
        }
      );

      setSubscribed(false);
    } else {
      const response = await axiosInstance.post(
        backendUrl + "/users/subscribe",
        {
          courseId: id,
        }
      );
      setSubscribed(true);
    }
  };

 

  return (
    <div className="flex bg-[#f3f5f9] ">
      <SideBar />
      <div className=" m-5 pr-3 overflow-scroll">
        <p className="font-semibold text-2xl">{course?.courseName}</p>

        <div
          className="w-3xl h-3/5 border-1 mt-2 rounded flex items-center justify-center bg-cover bg-center bg-no-repeat bg-white shadow "
          style={
            video
              ? {} // No background if video is selected
              : { backgroundImage: `url(${course?.thumbnail})` }
          }
        >
          {subscribed ? (
            video ? (
              <video
                src={video}
                controls
                autoPlay
                className="w-full h-full object-contain rounded"
              />
            ) : null
          ) : (
            <img src="/lock.svg" className="w-10" alt="Locked" />
          )}
        </div>

        <div className="flex justify-between mt-3 items-center">
          <button
            className={`border-1 border-white p-3 rounded-md cursor-pointer shadow hover:shadow-2xl ${
              subscribed ? "bg-[#4e4c4c]" : "bg-[#2b2b2b]"
            } hover:bg-[#4e4c4c] text-white`}
            onClick={handleSubscribe}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
          <p className="flex underline">{`By ${course?.teacher}`}</p>
        </div>
        <div className="dis border-1 rounded mt-2 bg-white w-3xl h-auto p-5">
          <p>
            <span className="font-bold">About the course:</span>{" "}
            {course?.description}
          </p>{" "}
        </div>
      </div>

      {/* -------------- Left ------------- */}
      <div className="left m-5">
        <div className="top flex items-center gap-2 flex-wrap">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => {
                setActive(btn);
                setState(btn);
                
              }}
              className={`border border-white p-1.5 rounded-xl cursor-pointer shadow hover:shadow-2xl ${
                active === btn ? "bg-gray-300 border-0" : "bg-white"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
        <div className="down mt-5 bg-white shadow p-3 rounded h-[85vh] flex flex-col gap-3 overflow-scroll">
          {/* ----------------features------------ */}

          {/* videos */}
          {state === "Lessons"
            ? course?.videos.map((video, index) => (
                <div
                  className=" flex items-center gap-2 cursor-pointer hover:bg-gray-300 p-2 rounded w-full"
                  onClick={() => subscribed && setVideo(video.video)}
                  key={video._id}
                >
                  <p>{index + 1}</p>
                  <div className="right flex gap-5">
                    <img
                      src={video.thumbnail}
                      className="w-30 rounded"
                      alt=""
                    />
                    <p>{video.title}</p>
                  </div>
                </div>
              ))
            : null}

          {/* -------------- Quizes ------------ */}
          {state === "Quizes" ? 

          course?.quizzes.map((quiz, index) => (
              <button 
                onClick={()=>subscribed && navigate(`/quiz/${quiz._id}`)}                key={quiz._id}
                className ="w-full text-center rounded border border-gray-300 p-4 font-medium shadow hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <p>{`${index+1} ${quiz.title}`}</p>
            </button>
          )) : null}

          {state === "Doubt" ? 
            <Chat  from={"course"}/>
              : null}

          


        </div>
        <div className="list"></div>
      </div>
    </div>
  );
};

export default Course;
