import React from 'react'
import StudentHome from './pages/StudentHome'
import {Routes,Route} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Lab from './pages/Lab';
import LabProfile from './pages/LabProfile';
import ListLabs from './components/ListLabs';
import Course from './pages/Course';
import { Video } from 'lucide-react';
import Editor from "./components/Editor/src/components/CodeEditor"
import Quiz from './pages/Quiz';
import Chat from './components/Chat';
import Practice from './pages/Practice';
import Subject from './pages/Subject';
import QuestionList from './pages/QuestionList';
import Question from './pages/Question';
import Drawing from './pages/Drawing';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
        <div>
          <ToastContainer />
          <Routes>
            <Route path='/' element={<StudentHome/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/lab' element={<Lab/>}/>
            <Route path='/lab-profile' element={<LabProfile/>}/>
            <Route path='/labs' element={<ListLabs/>}/>
            <Route path="/course/:id" element={<Course />} />
            <Route path='/editor' element={<Editor/>}/>
            <Route path='/quiz/:id' element={<Quiz/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/practice' element={<Practice/>}/>
            <Route path='/subject/:id' element={<Subject/>}/>
            <Route path='/problems/:id' element={<QuestionList/>}/>
            <Route path='/problem/:id' element={<Question/>}/>
            <Route path='/draw' element={<Drawing/>}/>
            <Route path='/message' element={<ChatPage/>}/>

          </Routes>
        </div>
  )
}

export default App
