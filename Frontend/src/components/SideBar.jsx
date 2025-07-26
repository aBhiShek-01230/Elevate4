import React, { useContext, useState } from 'react'
import  colors  from "../constants/colors";
import Logo from "./Logo"
import { StudentContext } from '../context/StudentContext';
const SideBar = () => {


  const [display,setDisplay] = useState(false)
  const {navigate,showC,setShowC} = useContext(StudentContext)
  const toogle = ()=>{
    setDisplay(!display)
  }

  return (
    <div className={`sidebar bg-[#2b2b2b] h-auto text-[#cbc5c5] w-15 ${display?"w-full max-w-53":null}`} >
      <div className="items">
        <div className="flex justify-between items-center p-3 h-15">
          <img className='w-[20px] cursor-pointer ' src="/menu.png" alt="menu" onClick={toogle}/>
          {display ? <Logo color='white' size='25px'/> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>{
          setShowC(false)
          navigate('/')
          }}>
          <img className='w-[20px]' src="/home.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Dashboard</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>{
          navigate('/')
          setShowC(!showC)}}>
          <img className='w-[20px]' src="/course.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Courses</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>navigate('/message')}>
          <img className='w-[20px]' src="/message.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Messages</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15">
          <img className='w-[20px]' src="/video.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Live and upcoming</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>navigate("/practice")}>
          <img className='w-[20px]' src="/practise.png" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Practice</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15">
          <img className='w-[20px]' src="/doubt.png" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Ask a doubt</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15">
          <img className='w-[20px]' src="/playlist.png" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Your Playlist</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>navigate('/lab')}>
          <img className='w-[20px]' src="/lab.svg" alt="" />
                     {display ? <p className='hover:text-white hover:scale-110'>Labs</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>navigate('/editor')}>
          <img className='w-[20px]' src="/editor.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Code Editor</p> : null}
        </div>
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15" onClick={()=>navigate('/draw')}>
          <img className='w-[20px]' src="/draw.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Draw</p> : null}
        </div>
        <hr />
        <div className="flex gap-7 items-center p-3 cursor-pointer h-15">
          <img className='w-[20px]' src="/support.svg" alt="" />
          {display ? <p className='hover:text-white hover:scale-110'>Support</p> : null}
        </div>
      </div>
    </div>
  )
}

export default SideBar
