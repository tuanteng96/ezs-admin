import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import { IconDarkTheme } from './IconDarkTheme'
import { DropdownUser } from './DropdownUser'
import { DropdownStocks } from './DropdownStocks'
import { NotificationDrawer } from './NotificationDrawer'
import { DropdownCheckin } from './DropdownCheckin'
import { Link, useLocation } from 'react-router-dom'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const Header = () => {
  const { pathname, search } = useLocation()
  const { pos_mng } = useRoles(['pos_mng'])

  return (
    <div
      id="header"
      className="h-[70px] bg-white dark:bg-dark-aside fixed w-full top-0 left-0 z-[1001] flex justify-between transition"
    >
      <div className="flex items-center justify-center w-[72px] bg-site-aside border-b border-[#393945] border-dashed dark:border-r">
        <Link className="block" to="/">
          <img
            className="h-5"
            src={toAbsoluteUrl('/assets/images/logos/logo-ezs.png')}
            alt="EZS - Phần mềm quản lý Spa"
          />
        </Link>
      </div>
      <div className="flex justify-between flex-1 pr-4 border-b border-separator dark:border-dark-separator">
        <div className="flex items-center pl-4">
          <DropdownStocks />
          <DropdownCheckin />
        </div>
        <div className="flex items-center">
          {pos_mng.hasRight && (
            <div>
              <Link
                to="/search"
                state={{ previousPath: pathname + search }}
                className="flex items-center justify-center text-gray-700 transition rounded cursor-pointer dark:text-dark-muted w-11 h-11 hover:bg-light dark:hover:bg-dark-light hover:text-primary"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </Link>
            </div>
          )}

          <div className="ml-1">
            <NotificationDrawer />
          </div>
          <IconDarkTheme />
          <DropdownUser />
        </div>
      </div>
    </div>
  )
}

export { Header }
