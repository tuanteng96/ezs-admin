import { XMarkIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import OrdersAPI from 'src/_ezs/api/orders'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'

function ViewOrderDetail(props) {
  const { orderId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const resultOrder = useQuery({
    queryKey: ['MemberListPay', { ID: orderId }],
    queryFn: async () => {
      const { data } = await OrdersAPI.orderDetail({ ID: orderId })
      return data
    }
  })

  console.log(resultOrder)

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
          className="absolute top-0 right-0 z-10 flex w-full h-full bg-white max-w-7xl dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="w-[200px] flex flex-col">
            <div className="flex items-center justify-center py-7 border-b border-separator dark:border-dark-separator">
              <div
                className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() => navigate(-1)}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <div className="overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
              <div className="border-b border-separator dark:border-dark-separator p-3 cursor-pointer font-semibold">
                Thanh toán
              </div>
              <div className="border-b border-separator dark:border-dark-separator p-3 cursor-pointer font-semibold">
                Hoàn thành khách vãng lai
              </div>
            </div>
          </div>
          <div className="flex-1 bg-site-app dark:bg-dark-app relative">
            <div className="h-full">a</div>
            <LoadingComponentFull loading={resultOrder.isLoading} />
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}

export default ViewOrderDetail
