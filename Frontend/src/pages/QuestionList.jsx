import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import { StudentContext } from '../context/StudentContext';
import axios from 'axios';

const QuestionList = () => {
  const sectionRefs = useRef({});
  const containerRef = useRef(null);
  const { id } = useParams(); 
  const { navigate, backendUrl } = useContext(StudentContext);
  const [subTopics, setSubTopics] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handler = () => {
      const offsetY = containerRef.current.scrollTop;
      const entries = subTopics.map((sub, index) => {
        const el = sectionRefs.current[sub.subTopic];
        if (!el) return { id: sub.subTopic, diff: Infinity };
        const top = el.offsetTop;
        return { id: sub.subTopic, diff: Math.abs(offsetY - top) };
      });
      const sorted = entries.sort((a, b) => a.diff - b.diff);
      setActiveId(sorted[0]?.id);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handler);
      return () => container.removeEventListener('scroll', handler);
    }
  }, [subTopics]);

  useEffect(() => {
    const getSubTopics = async () => {
      try {
        const response = await axios.post(`${backendUrl}/practice/all-question`, { topicId: id });
        console.log(response.data.data)
        setSubTopics(response.data.data);
        if (response.data.data.length > 0) setActiveId(response.data.data[0].subTopic);
      } catch (err) {
        console.error("Failed to fetch subtopics", err);
      }
    };

    getSubTopics();
  }, [id, backendUrl]);

  return (
    <div className="flex bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <SideBar />

      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[#f3f5f9] backdrop-blur-md p-6 shadow-xl border-r rounded-tr-2xl rounded-br-2xl">
          <h1 className="text-xl font-bold mb-6 text-purple-700">Topics</h1>
          {subTopics.map((sub, index) => (
            <button
              key={index}
              onClick={() => scrollTo(sub.subTopic)}
              className={`text-left py-3 px-4 mb-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 hover:shadow-lg
                ${activeId === sub.subTopic
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-inner'
                  : 'bg-white text-gray-800 hover:bg-purple-100'
                }`}
            >
              {sub.subTopic}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="overflow-auto p-4 w-full md:w-[60vw]" ref={containerRef}>
          <SearchBar />
          {subTopics.map((sub, index) => (
            <section
              key={index}
              ref={(el) => (sectionRefs.current[sub.subTopic] = el)}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4">{sub.subTopic}</h2>
              <ul className="space-y-2">
                {sub.questions.map((q) => (
                  <li
                    key={q._id}
                    className="p-3 bg-white rounded-md shadow hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/problem/${q._id}`)}
                  >
                    {q.title}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default QuestionList;
