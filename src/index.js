import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import reportWebVitals from './reportWebVitals'
import { AuthProvider } from './_ezs/core/Auth'
import AppRoutes from './app/routing/AppRoutes'

import './_ezs/utils/n2vi.js'

import 'react-texty/styles.css'
import './index.css'

import { EzsSplashScreenProvider } from './_ezs/core/EzsSplashScreen'
import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

const helmetContext = {}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <EzsSplashScreenProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </EzsSplashScreenProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
