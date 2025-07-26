import React, { useContext, useEffect, useState } from 'react'
import { StudentContext } from '../context/StudentContext'

const SearchBar = ({ home,practice,subject }) => {
  const [text, setText] = useState('')
  const { courses, setCourses,showC, setShowC,subjects,setSubjects,topics, setTopics } = useContext(StudentContext)
  
const [originalCourses, setOriginalCourses] = useState([]);
const [allSubjects, setAllSubjects] = useState([]);
const [allTopics, setAllTopics] = useState([]);


useEffect(() => {
  if(home){
    if (text.trim() === '') {
    setCourses(originalCourses);
  } else {
    const filtered = originalCourses.filter(course =>
      (course?.courseName?.toLowerCase().includes(text.toLowerCase()) ||
       course?.description?.toLowerCase().includes(text.toLowerCase()))
    );

    setCourses(filtered);
  }
  }else if (practice){
    if (text.trim() === '') {
    setSubjects(allSubjects);
  } else {
    const filtered = allSubjects.filter(subject =>
      (subject?.name?.toLowerCase().includes(text.toLowerCase()) ||
       subject?.description?.toLowerCase().includes(text.toLowerCase()))
    );

    setSubjects(filtered);
  }
  }else if (subject){
    if (text.trim() === '') {
    setTopics(allTopics);
  } else {
    const filtered = allTopics.filter(topic =>
      (topic?.name?.toLowerCase().includes(text.toLowerCase()) ||
       topic?.description?.toLowerCase().includes(text.toLowerCase()))
    );

    setTopics(filtered);
  }
  }
}, [text]);


useEffect(() => {
  // only set originalCourses once when `courses` first arrives
  if (courses.length && originalCourses.length === 0) {
    setOriginalCourses(courses);
  }
}, [courses]);
useEffect(() => {
  // only set originalCourses once when `courses` first arrives
  if (subjects?.length && allSubjects.length === 0) {
    setAllSubjects(subjects);
  }
}, [subjects]);
useEffect(() => {
  // only set originalCourses once when `courses` first arrives
  if (topics?.length && allTopics.length === 0) {
    setAllTopics(topics);
  }
}, [topics]);



  return (
    <div className='text-center'>
      <div className="inline-flex items-center justify-center border-1 border-[#dfebff] shadow px-5 py-2 mt-3 mx-3 rounded-md w-md hover:border-[#9fc1fb] hover:shadow-2xl bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setShowC(true)
          }}
          placeholder='Search'
          className='flex-1 outline-none bg-inherit text-sm'
        />
        {!text ? (
          <img className='w-4 cursor-pointer' src='/search.png' alt="search" />
        ) : (
          <img
            src="/cross.png"
            alt="clear"
            className='inline w-3 cursor-pointer'
            onClick={() => setText('')}
          />
        )}
      </div>
    </div>
  )
}

export default SearchBar
