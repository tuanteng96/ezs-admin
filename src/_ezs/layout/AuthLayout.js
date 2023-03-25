/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Outlet } from 'react-router-dom'
import { toAbsoluteUrl } from '../utils/assetPath'

const AuthLayout = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-center w-3/6 px-10 py-6">
        <div className="flex items-center justify-center grow">
          <Outlet />
        </div>
        <div className="flex justify-between pt-5">
          <div className="text-sm text-[#3f4254]">
            <span className="text-site-muted">2023</span>
            <a
              href="https://ezs.vn"
              target="_blank"
              className="pl-2 transition hover:text-primary"
            >
              © EZS.VN
            </a>
            - Phần mềm quản lý Spa
          </div>
          <div className="flex">
            <a
              className="block text-sm transition text-site-muted hover:text-primary"
              href=""
            >
              Hướng dẫn
            </a>
            <a
              className="block ml-6 text-sm transition text-site-muted hover:text-primary"
              href=""
            >
              Liên hệ
            </a>
          </div>
        </div>
      </div>
      <div className="w-3/6 bg-[#edf5ff] flex items-center justify-center">
        <img
          className="w-full max-w-xl"
          src={toAbsoluteUrl('/assets/images/auth/banner-1.png')}
          alt="EZS - Phần mềm quản lý Spa"
        />
      </div>
    </div>
  )
}

export { AuthLayout }
