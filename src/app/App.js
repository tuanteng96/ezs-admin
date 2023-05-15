import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthInit } from 'src/_ezs/core/Auth'
import { LayoutSplashScreen } from 'src/_ezs/core/EzsSplashScreen'
import { LayoutProvider } from 'src/_ezs/layout/LayoutProvider'
import { ToastContainer } from 'react-toastify'
import { LazyMotion, domAnimation } from 'framer-motion'

function App() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <LayoutProvider>
        <AuthInit>
          <LazyMotion features={domAnimation}>
            <Outlet />
            <ToastContainer
              autoClose={1500}
              rtl={false}
              closeOnClick
              position="top-center"
              theme="colored"
              icon={false}
            />
          </LazyMotion>
        </AuthInit>
      </LayoutProvider>
    </Suspense>
  )
}

export default App
