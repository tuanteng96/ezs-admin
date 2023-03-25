import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { Button } from 'src/_ezs/partials/button'

function ClientAddEdit(props) {
  //console.log(useMatch('/clients/add'))
  const { id } = useParams()
  //console.log(Boolean(id > 0))
  //console.log(useLocation())
  const { pathname, state } = useLocation()

  const navigate = useNavigate()
  console.log(state?.previousPath)
  return (
    <FixedLayout>
      <div className="relative flex flex-col h-full">
        <div className="transition border-b z-[10] border-separator bg-white">
          <div className="grid justify-between grid-cols-4 gap-4 px-5 h-[85px]">
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-12 h-12 cursor-pointer"
                onClick={() => navigate(state?.previousPath || '/clients')}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2 text-2xl font-extrabold transition">
              Thêm mới khách hàng
            </div>
            <div className="flex items-center justify-end">
              <Button className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70">
                Thêm mới khách hàng
              </Button>
            </div>
          </div>
        </div>
        <div className="relative overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
          <div className="h-[1000px]"></div>
        </div>
      </div>
    </FixedLayout>
  )
}

export default ClientAddEdit
