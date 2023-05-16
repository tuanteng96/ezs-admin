import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Aside } from './components/aside/Aside'
import { Content } from './components/Content'
import { Header } from './components/header/header'
import useQueryParams from '../hooks/useQueryParams'
import clsx from 'clsx'
import { useLayout } from './LayoutProvider'

const MasterLayout = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryConfig = useQueryParams()

  const { LayoutIframe } = useLayout()

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, queryConfig])

  const keydownHandler = e => {
    if (!e.ctrlKey && !e.metaKey) {
      switch (e.keyCode) {
        case 112:
          e.preventDefault()
          navigate(
            `/search?type=${
              queryConfig.type === 'member' ? 'order' : 'member'
            }`,
            {
              state: {
                previousPath: pathname === '/search' ? '/' : pathname + search
              }
            }
          )
          return
        case 113:
          e.preventDefault()
          navigate(`/clients/add`, {
            state: {
              previousPath: pathname + search
            }
          })
          return
        case 114:
          e.preventDefault()
          navigate(`/appointments/new`, {
            state: {
              previousPath: pathname + search
            }
          })
          return
        default:
          return
      }
    }

    if (e.ctrlKey || e.metaKey) {
      // switch (String.fromCharCode(e.which).toLowerCase()) {
      //   case 'o':
      //     e.preventDefault()
      //     navigate('/search?type=order', {
      //       state: {
      //         previousPath: pathname === '/search' ? '/' : pathname + search
      //       }
      //     })
      //     return false
      //   default:
      //     return false
      // }
    }
  }

  return (
    <div className="h-full transition bg-site-app dark:bg-dark-app dark:text-dark-muted">
      {!LayoutIframe && <Header />}
      {!LayoutIframe && <Aside />}
      <div
        id="wrapper"
        className={clsx(
          '"w-full h-full',
          !LayoutIframe && 'pt-[70px] pl-[72px]'
        )}
      >
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  )
}

export { MasterLayout }
