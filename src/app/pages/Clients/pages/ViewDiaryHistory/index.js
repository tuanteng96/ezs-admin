import { XMarkIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MembersAPI from 'src/_ezs/api/members.api'

const initialCare = [
  {
    Title: 'Lịch nhắc',
    Key: 'NotiDates'
  },
  {
    Title: 'Hình ảnh & Clip',
    Key: 'Attachments'
  },
  {
    Title: 'Lịch nhắc',
    Key: 'NotiDates'
  },
  {
    Title: 'Ghi chú',
    Key: 'NotiServices'
  }
]

function ViewDiaryHistory(props) {
  const { id } = useParams()
  const { pathname, state } = useLocation()
  const navigate = useNavigate()

  const resultCare = useQuery({
    queryKey: ['MemberListCare', { MemberID: id }],
    queryFn: async () => {
      const { data } = await MembersAPI.memberListCare({
        MemberID: id
      })
      console.log(data)
      return data
    },
    initialData: initialCare
  })

  console.log(resultCare)

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() => navigate(state?.previousPath || `/clients/${id}`)}
          ></div>
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 z-10 flex w-full h-full max-w-3xl bg-white dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="w-[150px] flex flex-col">
            <div className="flex items-center justify-center border-b py-7 border-separator dark:border-dark-separator">
              <div
                className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() =>
                  navigate(state?.previousPath || `/clients/${id}`)
                }
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <div className="overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
              a
            </div>
          </div>
          <div className="flex-1 bg-site-app dark:bg-dark-app">a</div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}

export default ViewDiaryHistory
