import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { UploadFilePlus } from 'src/_ezs/partials/files'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatString } from 'src/_ezs/utils/formatString'
import Viewer from 'react-viewer'

const MemberOs = ({ ServiceOs }) => {
  const { pathname } = useLocation()
  const { control, watch } = useFormContext()

  const watchForm = watch()

  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'Attachment'
  })

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center w-full max-w-full p-5 border-b border-separator dark:border-dark-separator">
          <div className="w-14">
            <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
              {formatString.getLastFirst(ServiceOs?.Member?.FullName)}
            </div>
          </div>
          <div className="flex-1 px-3.5 flex flex-col items-baseline justify-center overflow-hidden">
            <div className="flex w-full mb-px font-semibold dark:text-graydark-800 font-inter">
              <div className="max-w-[calc(100%-130px)] capitalize truncate">
                {ServiceOs?.Member?.FullName || 'Chưa xác định'}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700 text-dark dark:text-graydark-800">
              <span>{ServiceOs?.Member?.MobilePhone || 'Chưa xác định'}</span>
            </div>
          </div>
          <div className="w-8">
            <EllipsisHorizontalIcon className="w-8" />
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items className="z-[1001] rounded px-0 py-2 border-0 max-w-[200px] w-full bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute right-2 top-3/4">
            <div>
              <Menu.Item>
                {({ close }) => (
                  <Fragment>
                    <Link
                      to={`/clients/edit/${ServiceOs?.Member?.ID}`}
                      state={{
                        previousPath: pathname,
                        formState: watchForm
                      }}
                      className="flex items-center px-4 py-3 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium"
                    >
                      <div className="flex-1 truncate">Chỉnh sửa thông tin</div>
                    </Link>
                  </Fragment>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <div className="overflow-auto grow">
        <div className="px-6 py-4 text-lg font-bold border-b border-separator dark:border-dark-separator dark:text-white">
          Thông tin buổi dịch vụ
        </div>
        <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
          <div className="text-gray-500">ID</div>
          <div className="w-3/5 font-medium text-right">{ServiceOs?.ID}</div>
        </div>
        <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
          <div className="text-gray-500">Dịch vụ</div>
          <div className="w-3/5 font-medium text-right">{ServiceOs?.Title}</div>
        </div>
        <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
          <div className="text-gray-500">Giá bán</div>
          <div className="w-3/5 font-medium text-right">
            {formatString.formatVND(
              ServiceOs?.Cost1 || ServiceOs?.Cost2 || ServiceOs?.Cost3
            )}
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
          <div className="text-gray-500">Giá Cost</div>
          <div className="w-3/5 font-medium text-right">
            {formatString.formatVND(ServiceOs?.CostBase)}
          </div>
        </div>
        {ServiceOs?.StaffHis && (
          <div className="flex flex-col px-6 py-4 border-b border-separator dark:border-dark-separator">
            <div className="text-gray-500">Chữ ký khách hàng</div>
            <div className="w-3/5 font-medium text-right mt-2">
              <img
                className="max-w-full"
                src={toAbsolutePath(ServiceOs?.StaffHis)}
                alt="Chữ ký khách hàng"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col px-6 py-4">
          <div className="mb-2 text-gray-500">File đính kèm</div>
          <div className="grid grid-cols-5 gap-4">
            {fields &&
              fields.map((image, index) => (
                <div className="relative group" key={image.id}>
                  <div
                    className="absolute z-10 flex items-center justify-center w-6 h-6 text-gray-700 transition bg-white rounded-full shadow-lg opacity-0 cursor-pointer dark:text-darkgray-800 dark:bg-graydark-200 -top-3 -right-3 hover:text-primary group-hover:opacity-100"
                    onClick={() => remove(index)}
                  >
                    <XMarkIcon className="w-3" />
                  </div>
                  <img
                    onClick={() => {
                      setActiveIndex(index)
                      setVisible(true)
                    }}
                    className="object-cover w-full rounded aspect-square"
                    src={toAbsolutePath(image.Src)}
                    alt={ServiceOs?.Title}
                  />
                </div>
              ))}
            <div className="aspect-square">
              <UploadFilePlus
                width="w-full"
                height="h-full"
                onChange={val => prepend({ Src: val })}
              />
            </div>
          </div>
        </div>
        <Viewer
          visible={visible}
          activeIndex={activeIndex}
          onClose={() => {
            setVisible(false)
          }}
          images={
            fields
              ? fields.map(x => ({
                  src: toAbsolutePath(x.Src)
                }))
              : []
          }
          zIndex={1013}
        />
      </div>
    </>
  )
}

export { MemberOs }
