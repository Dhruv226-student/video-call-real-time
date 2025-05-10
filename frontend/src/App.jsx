import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import OnBoardingPage from './pages/OnBoardingPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import CallPage from './pages/CallPage'
import NotificationPage from './pages/NotificationPage'
import SignupPage from './pages/SignupPage'
import  { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import {axiosInstance} from './lib/axios.js'
// import './App.css'
const App = () => {
  
  const {data:authData , isLoading , error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me')

      const data= res.json()
      return data

    }, 
    retry: false,
  })
   const authUser = authData?.user
  return (
    <div data-theme="coffee">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to ="/" />} />
        <Route path="/login" element={!authUser?<LoginPage />  : <Navigate to ="/" />}/>
        <Route path="/onboarding" element={authUser ?<OnBoardingPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ?<ChatPage />: <Navigate to="/login" />}/>
        <Route path="/call" element={authUser ?<CallPage /> : <Navigate to="/login" />}/>
        <Route path="/notification" element={authUser ?<NotificationPage />: <Navigate to="/login" />}/>
      </Routes>


      <Toaster />
    </div>
  )
}

export default App
