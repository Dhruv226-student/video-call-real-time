import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import OnBoardingPage from './pages/OnBoardingPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import CallPage from './pages/CallPage'
import NotificationPage from './pages/NotificationPage'
import SignupPage from './pages/SignUpPage'
import { Toaster } from 'react-hot-toast'
import PageLoder from './components/PageLoder.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'
// import './App.css'
const App = () => {

  const { isLoading, authUser } = useAuthUser()
  const { theme } = useThemeStore()
  const isAuthenticated = Boolean(authUser)
  const isOnBoarded = Boolean(authUser?.isOnBoarded)

  if (isLoading) return <PageLoder />;

  return (
    <div data-theme={theme}>
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

        <Route path="/chat/:id" element={
          isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={false}>
              <ChatPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        } />




        <Route path="/call/:id" element={
          isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={false}>
              <CallPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        } />
        <Route path="/notifications" element={
          isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <NotificationPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        } />
      </Routes>


      <Toaster />
    </div>
  )
}

export default App
