import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import OnBoardingPage from './pages/OnBoardingPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import CallPage from './pages/CallPage'
import NotificationPage from './pages/NotificationPage'
import SignupPage from './pages/SignupPage'
import { Toaster } from 'react-hot-toast'
import PageLoder from './components/PageLoder.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
// import './App.css'
const App = () => {

  const { isLoading, authUser } = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnBoarded = Boolean(authUser?.isOnBoarded)

  if (isLoading) return <PageLoder />;

  return (
    <div data-theme="coffee">
      <Routes>
        <Route path="/" element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>

            <HomePage />
          </Layout>
          ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={
          isOnBoarded ? "/" : "/onboarding"
        } />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={
          isOnBoarded ? "/" : "/onboarding"
        } />} />
        <Route path="/onboarding" element={isAuthenticated ? (
          !isOnBoarded ? <OnBoardingPage /> : <Navigate to="/" />
        ) : (
          <Navigate to={"/login"} />
        )} />
        <Route path="/chat" element={isAuthenticated ?
          
          <Layout showSidebar={false}>
          <ChatPage /> 
          </Layout>
          : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/notification" element={isAuthenticated ? <NotificationPage /> : <Navigate to="/login" />} />
      </Routes>


      <Toaster />
    </div>
  )
}

export default App
