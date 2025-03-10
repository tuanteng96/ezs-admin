import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from 'src/_ezs/core/Auth'
import { Avatar } from './Avatar'

const DropdownUser = () => {
  const { logout, auth } = useAuth()

  return (
    <>
      <Popover className="relative h-full">
        {({ open }) => (
          <>
            <Popover.Button className="flex items-center justify-center h-full ml-3">
              <Avatar classes="w-11 h-11" bgStatus="bg-success" />
            </Popover.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel className="absolute z-10 shadow-lg rounded border-0 w-[275px] bg-white dark:bg-site-aside dark:shadow-dark-shadow right-0">
                <div className="py-4">
                  <div className="px-4">
                    <div className="flex items-center pt-1 pb-2">
                      <div className="w-12">
                        <Avatar classes="w-12 h-12" />
                      </div>
                      <div className="flex-1 pl-3 overflow-hidden">
                        <div className="w-full">
                          <div className="text-lg font-semibold capitalize truncate font-inter text-site-color dark:text-white">
                            {auth?.User?.FullName || 'Chưa cập nhật'}
                          </div>
                          <div className="text-sm dark:text-dark-muted">
                            {auth?.User?.Phone || 'Chưa cập nhật'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-2 transition border-b border-separator dark:border-dark-separator"></div>
                  <div>
                    <Popover.Button
                      className="inline-flex items-center px-5 font-medium transition h-9 text-site-color hover:text-primary dark:hover:text-primary dark:text-dark-gray"
                      as={Fragment}
                    >
                      <NavLink to="/profile">Thông tin cá nhân</NavLink>
                    </Popover.Button>
                  </div>
                  {/* <div>
                    <Popover.Button
                      className="inline-flex items-center px-5 font-medium transition h-9 text-site-color hover:text-primary dark:hover:text-primary dark:text-dark-gray"
                      as={Fragment}
                    >
                      <NavLink to="/">Cài đặt</NavLink>
                    </Popover.Button>
                  </div>
                  <div>
                    <Popover.Button
                      className="inline-flex items-center px-5 font-medium transition h-9 text-site-color hover:text-primary dark:hover:text-primary dark:text-dark-gray"
                      as={Fragment}
                    >
                      <NavLink to="/">Trợ giúp</NavLink>
                    </Popover.Button>
                  </div>
                  <div className="my-2 transition border-b border-separator dark:border-dark-separator"></div> */}
                  <div>
                    <button
                      type="button"
                      className="flex items-center px-5 font-medium transition h-9 text-site-color hover:text-danger dark:hover:text-dark-danger dark:text-dark-gray"
                      onClick={logout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  )
}

export { DropdownUser }
