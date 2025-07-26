import React from 'react'
import pf1 from '/leaderboard/pf1.jpg'
import pf2 from '/leaderboard/pf2.jpg'
import pf3 from '/leaderboard/pf3.jpg'
import pf4 from '/leaderboard/pf4.jpg'
import gold from '/leaderboard/gold.png'
import silver from '/leaderboard/silver.png'
import bronze from '/leaderboard/bronze.png'
import { useContext,useEffect } from 'react';
import { StudentContext } from '../context/StudentContext';


const Card = () => {

  const { userData,navigate,userCourses } = useContext(StudentContext);
  const leaderboard = [
    { img: pf1, color: 'text-green-600', points: '500 pt', badge: gold, rank: null },
    // { img: pf2, color: 'text-orange-500', points: '400 pt', badge: silver, rank: null },
    // { img: pf3, color: 'text-blue-500', points: '300 pt', badge: bronze, rank: null },
    // { img: pf4, color: 'text-black', points: '250 pt', badge: null, rank: '4th' },
  ]

  return (
    <div className="mx-3 mt-4 w-[320px] bg-white rounded-[15px] p-4 space-y-3 shadow hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-bold">Leaderboard</p>
        <p className="font-extrabold text-green-600">Course</p>
        <p className="text-gray-500">Rank</p>
      </div>

      {/* Users */}
      { 
      userCourses && userCourses.length > 0 ? 
        leaderboard.map((user, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-2 border-[#dfebff] rounded-[10px] pr-2 py-2 transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between gap-2 pl-2">
            <img
              src={userData?userData.avatar:pf1}
              className="w-[50px] rounded-full transition-transform duration-300 hover:scale-110"
              alt="profile"
            />
            <div className="flex flex-col">
              <p className={`text-[13px] font-bold ${user.color}`}>
                {userData?.fullName.split(" ")[0]} <br /> {user.points}
              </p>

            </div>
            <br />
            <p className="text-[10px] font-bold text-black">{userCourses[0].courseName}</p>
          </div>

          <div className="flex items-center gap-2">
            {user.badge ? (
              <img src={user.badge} className="w-[25px]" alt="badge" />
            ) : (
              <p className="font-bold text-sm">{user.rank}</p>
            )}
          </div>
          
        </div>
      )) :""}

      {/* Footer */}
      <div className=" text-gray-500 text-center cursor-pointer hover:text-black transition-colors">
        <p>{userCourses && userCourses.length > 0 ? "View all":"Enroll in a course"}</p>
      </div>
       
    </div>
  )
}

export default Card
