import React from 'react'
import { Outlet } from 'react-router-dom'
import { Aside } from './components/aside/Aside'
import { Content } from './components/Content'
import { Header } from './components/header/header'

const MasterLayout = () => {
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
