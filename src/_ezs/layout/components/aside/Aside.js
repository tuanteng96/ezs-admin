import React from 'react'
import {
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FaceSmileIcon,
  HomeIcon,
  IdentificationIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import Tooltip from 'rc-tooltip'
import { AsideMenuItem } from './AsideMenuItem'

const AsideMenuList = [
  {
    to: '/dashboard',
    icon: () => <HomeIcon className="w-8 h-8 text-white" />,
    title: 'Home'
  },
  {
    to: '/calendar',
    icon: () => <CalendarIcon className="w-8 h-8 text-white" />,
    title: 'Calendar',
    actives: ['/clients/']
  },
  {
    to: '/sale',
    icon: () => <TagIcon className="w-8 h-8 text-white" />,
    title: 'Sales'
  },
  {
    to: '/clients1',
    icon: () => <FaceSmileIcon className="w-8 h-8 text-white" />,
    title: 'Clients'
  },
  {
    to: '/catalogue',
    icon: () => <BookOpenIcon className="w-8 h-8 text-white" />,
    title: 'Catalogue'
  },
  {
    to: '/profile',
    icon: () => <IdentificationIcon className="w-8 h-8 text-white" />,
    title: 'Profile'
  },
  {
    to: '/promote',
    icon: () => <MegaphoneIcon className="w-8 h-8 text-white" />,
    title: 'Promote'
  },
  {
    to: '/reports',
    icon: () => <ChartBarIcon className="w-8 h-8 text-white" />,
    title: 'Reports'
  },
  {
    to: '/settings',
    icon: () => <Cog6ToothIcon className="w-8 h-8 text-white" />,
    title: 'Settings'
  }
]

const Aside = () => {
  return (
    <div
      id="aside"
      className="fixed top-[70px] left-0 w-[72px] h-[calc(100%-70px)] bg-site-aside"
    >
      <div className="flex flex-col items-center justify-between h-full p-3 overflow-x-hidden overflow-y-auto scrollbar-dark">
        <div>
          {AsideMenuList.map((menu, index) => (
            <AsideMenuItem {...menu} key={index} />
          ))}
        </div>
        <div>
          <Tooltip
            //visible={true}
            overlayClassName="text-white dark:text-dark-light"
            placement="right"
            trigger={['hover']}
            overlay={
              <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800">
                Hướng dẫn
              </div>
            }
            align={{
              offset: [9, 0]
            }}
          >
            <a
              className="flex items-center justify-center w-12 h-12 transition rounded-md hover:bg-site-aside-hover"
              href="https://huongdan.ezs.vn"
            >
              <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export { Aside }
