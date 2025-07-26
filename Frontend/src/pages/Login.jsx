import React, { useContext, useEffect, useState } from 'react'
import Logo from '../components/Logo'
import { StudentContext } from '../context/StudentContext';
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

  const [currentState,setCurrentstate] = useState('Login')
  const[fullName,setName] = useState('')
  const[username,setUsername] = useState('')
  const[password,setPassword] = useState('')
  const[email,setEmail] = useState('')
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);


  const { navigate, backendUrl,token,setToken,setUserData,userData } = useContext(StudentContext);

 const onSubmitHandler = async (e) =>{
  
      e.preventDefault();
      try {
        if(currentState === 'Sign Up'){
          const formData = new FormData();
          formData.append('fullName', fullName);
          formData.append('username', username);
          formData.append('email', email);
          formData.append('password', password);
          formData.append('avatar', image);


          const response = await axios.post(`${backendUrl}/users/register`, formData);
          if(response.data.success){
            setToken(response.data.data.accessToken) 
            setUserData(response.data.data)
            localStorage.setItem('token',response.data.data.accessToken)
            
          }else{
            toast.error(response.data.message)
          }

        }else{
          
          const response = await axios.post(backendUrl + '/users/login', {email,password})
          if(response.data.success){
            setToken(response.data.data.accessToken)
            setUserData(response.data.data)
            localStorage.setItem('token',response.data.data.accessToken)
             
          }else{
            toast.error(response.data.message)
            console.log(response.data.message)
          }


        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(()=>{
  
    if(token){
      navigate('/')
    }
  },[token])



 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }
};

  return (


    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="flex flex-col lg:flex-row justify-center items-center w-full h-auto px-4 sm:px-10 lg:px-20 py-30 gap-8">
  {/* Form Section */}
  <div className="form w-full lg:w-1/2">
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-full sm:max-w-md m-auto gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-6">
        <p className="prata-regular text-3xl text-green-800 font-bold">
          {currentState === 'Login' ? "Hi, Welcome Back!" : "Sign Up"}
        </p>
      </div>

      {currentState !== 'Login' && (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Profile Upload */}
          <div className="relative">
  <input
    id="profile-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
  <label htmlFor="profile-upload">
    <div className="profile rounded-full border border-gray-800 w-20 h-20 bg-gray-100 overflow-hidden cursor-pointer flex items-center justify-center">
      {previewUrl ? (
        <img src={previewUrl} alt="profile" className="w-full h-full object-cover" />
      ) : (
        ""
      )}
    </div>
  </label>
  <label htmlFor="profile-upload">
    <div className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer">
      +
    </div>
  </label>
</div>


          <input
            onChange={(e) => setName(e.target.value)}
            value={fullName}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            required
          />
          <input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Username"
        required
      />
        </div>
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full px-3 py-2 border border-gray-800 text-gray-500 flex items-center justify-between cursor-pointer">
        <p>Role</p>
        <select className="cursor-pointer focus:outline-0 bg-none">
          <option>Student</option>
          <option>Teacher</option>
          <option>Admin</option>
        </select>
      </div>

      <div className="w-full flex justify-between text-sm -mt-2">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentstate('Sign Up')}
            className="cursor-pointer hover:text-green-800 hover:font-bold"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentstate('Login')}
            className="cursor-pointer hover:text-green-800 hover:font-bold"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="bg-[#2b2b2b] cursor-pointer hover:bg-green-800 rounded-xl text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  </div>

  {/* Banner / Visual Section */}
  <div className="w-full lg:w-1/2 border-2 border-[#2b2b2b] rounded-xl p-6 sm:p-10 mt-4 lg:mt-0 bg-[#2b2b2b] text-center flex flex-col items-center gap-4">
    <img src="/banner.png" className="w-full max-w-xs" alt="" />
    <Logo color="white" />
    <p className="text-white text-sm">Discover, Learn, and Grow with Elevate</p>
  </div>
</div>

      </div>
 


  
  )
}

export default Login
