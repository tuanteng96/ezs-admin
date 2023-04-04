import React, { Fragment, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { motion, LayoutGroup } from 'framer-motion'
import { Tab } from '@headlessui/react'
import {
  CreditCardIcon,
  WalletIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import MembersAPI from 'src/_ezs/api/members.api'
import { useQuery } from '@tanstack/react-query'
import WalletList from './WalletList'
import MoneyCardList from './MoneyCardList'
import AddWallet from './components/AddWallet/AddWallet'

const ListTabs = [
  {
    Title: 'Ví điện tử',
    Icon: <WalletIcon className="w-7" />
  },
  {
    Title: 'Thẻ tiền',
    Icon: <CreditCardIcon className="w-7" />
  }
]

function ViewWalletMoney(props) {
  const { pathname } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onOpenAddWallet = () => {
    setIsOpen(true)
  }

  const onHideAddWallet = () => {
    setIsOpen(false)
  }

  const resultWallet = useQuery({
    queryKey: ['MemberListWallet', id],
    queryFn: async () => {
      var bodyFormData = new FormData()
      bodyFormData.append('cmd', 'list_money')
      bodyFormData.append('MemberID', id)
      const { data } = await MembersAPI.memberListsWallet(bodyFormData)
      return data
    },
    enabled: selectedIndex === 0,
    onSuccess: () => {
      isOpen && onHideAddWallet()
    }
  })

  const resultMoneyCard = useQuery({
    queryKey: ['MemberListMoneyCard', { MemberID: id }],
    queryFn: async () => {
      const { data } = await MembersAPI.memberListMoneyCard({ MemberID: id })
      return (
        (data?.data &&
          data?.data.map(x => ({
            ...x,
            children: [{ id: x.id + '-detail', content: x.Lich_su }]
          }))) ||
        []
      )
    },
    enabled: selectedIndex === 1
  })

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() => navigate(-1)}
          ></div>
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 z-10 flex w-full h-full max-w-7xl bg-white dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="w-[150px] flex flex-col">
              <div className="flex items-center justify-center border-b py-7 border-separator dark:border-dark-separator">
                <div
                  className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                  onClick={() => navigate(-1)}
                >
                  <XMarkIcon className="w-9" />
                </div>
              </div>
              <div className="overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                <Tab.List className="flex flex-col">
                  {ListTabs &&
                    ListTabs.map((item, index) => (
                      <Tab as={Fragment} key={index}>
                        {({ selected }) => (
                          <div
                            className={clsx(
                              'flex flex-col items-center justify-center px-4 py-4 cursor-pointer transition group',
                              selected
                                ? 'text-primary'
                                : 'text-gray-700 dark:text-graydark-800 hover:text-primary dark:hover:text-primary'
                            )}
                          >
                            <div
                              className={clsx(
                                'w-[50px] h-[50px] rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition relative',
                                selected
                                  ? 'bg-primary text-white'
                                  : 'bg-[#F3F6F9] text-[#878c93] dark:bg-dark-light dark:text-graydark-800'
                              )}
                            >
                              {item.Icon}
                            </div>
                            <div className="mt-2 font-medium transition text-[13px] leading-5 text-center">
                              {item.Title}
                            </div>
                          </div>
                        )}
                      </Tab>
                    ))}
                </Tab.List>
              </div>
            </div>
            <Tab.Panels className="flex-1 bg-site-app dark:bg-dark-app">
              <Tab.Panel className="relative flex flex-col h-full p-5">
                <WalletList
                  resultWallet={resultWallet}
                  onOpenAddWallet={onOpenAddWallet}
                />
              </Tab.Panel>
              <Tab.Panel className="relative h-full p-5 flex flex-col">
                <MoneyCardList resultMoneyCard={resultMoneyCard} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </motion.div>
      </div>
      <AddWallet isOpen={isOpen} onHide={onHideAddWallet} />
    </LayoutGroup>
  )
}

export default ViewWalletMoney
