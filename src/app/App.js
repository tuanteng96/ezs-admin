import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthInit } from 'src/_ezs/core/Auth'
import { LayoutSplashScreen } from 'src/_ezs/core/EzsSplashScreen'
import { LayoutProvider } from 'src/_ezs/layout/LayoutProvider'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <LayoutProvider>
        <AuthInit>
          <Outlet />
          <ToastContainer
            autoClose={1500}
            rtl={false}
            closeOnClick
            position="top-center"
            theme="colored"
            icon={false}
          />
        </AuthInit>
      </LayoutProvider>
    </Suspense>
  )
}

export default App
