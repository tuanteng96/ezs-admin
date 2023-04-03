import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Aside } from './components/aside/Aside'
import { Content } from './components/Content'
import { Header } from './components/header/header'

const MasterLayout = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const keydownHandler = e => {
    if (e.ctrlKey || e.metaKey) {
      switch (String.fromCharCode(e.which).toLowerCase()) {
        case 'o':
          e.preventDefault()
          navigate('/search?type=order', {
            state: {
              previousPath: pathname === '/search' ? '/' : pathname + search
            }
          })
          return false
        case 'm':
          e.preventDefault()
          navigate('/search?type=member', {
            state: {
              previousPath: pathname === '/search' ? '/' : pathname + search
            }
          })
          return false
        default:
          return false
      }
    }
  }

  return (
    <div className="h-full transition bg-site-app dark:bg-dark-app dark:text-dark-muted">
      <Header />
      <Aside />
      <div className="w-full h-full pt-[70px] pl-[72px]">
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  )
}

export { MasterLayout }
