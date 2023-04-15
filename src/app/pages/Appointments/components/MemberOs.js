import { Menu, Transition } from '@headlessui/react'
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import React, { Fragment, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Link, useLocation, useParams } from 'react-router-dom'
import { UploadFilePlus } from 'src/_ezs/partials/files'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatString } from 'src/_ezs/utils/formatString'
import Viewer from 'react-viewer'
import OsChangeService from './OsChangeService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CalendarAPI from 'src/_ezs/api/calendar.api'
import clsx from 'clsx'
import { OsMaterials } from './OsMaterials'

const MemberOs = ({ ServiceOs }) => {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const { control, watch, setValue } = useFormContext()
  const { id } = useParams()
  const watchForm = watch()

  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'Attachment'
  })

  const changeServiceOSMutation = useMutation({
    mutationFn: body => CalendarAPI.bookOsChangeService(body)
  })

  const onChangeService = values => {
    let bodyForm = {
      osid: id,
      prodid: ServiceOs.ConvertProdID,
      rootid: values?.rootid?.value
    }
    changeServiceOSMutation.mutate(bodyForm, {
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ['bookingOsID'] })
          .then(() => {
            onHide()
            toast.success('Chuyển đổi dịch vụ thành công.')
          })
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  const onOpen = () => {
    setIsOpen(true)
  }

  const onHide = () => {
    setIsOpen(false)
  }

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
          <div className="w-3/5 font-medium text-right">
            {ServiceOs?.ProdService2 || ServiceOs?.ProdTitle}
            {ServiceOs?.ConvertAddFeeID > 0 && (
              <>
                <div
                  className="flex justify-end mt-1.5 cursor-pointer text-primary"
                  onClick={onOpen}
                >
                  <ArrowPathIcon className="w-4 mr-1.5" />
                  Thay đổi
                </div>
                <OsChangeService
                  isOpen={isOpen}
                  onHide={onHide}
                  onChange={onChangeService}
                  loading={changeServiceOSMutation.isLoading}
                />
              </>
            )}
          </div>
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
        <OsMaterials
          initialValues={watchForm?.StockItems}
          onChange={(val, onClose) => {
            setValue('StockItems', val.StockItems)
            onClose()
          }}
        />
        {ServiceOs?.Rate > 0 && (
          <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
            <div className="text-gray-500">Đánh giá</div>
            <div className="w-3/5 font-medium text-right">
              <div className="flex items-center justify-end">
                {Array(5)
                  .fill()
                  .map((_, index) => (
                    <svg
                      aria-hidden="true"
                      className={clsx(
                        'w-5 h-5',
                        index + 1 > ServiceOs.Rate
                          ? 'text-gray-300 dark:text-gray-500'
                          : 'text-warning'
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      key={index}
                    >
                      <title>{index + 1}</title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
            </div>
          </div>
        )}
        {ServiceOs?.RateNote && (
          <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
            <div className="text-gray-500">Ghi chú</div>
            <div className="w-3/5 font-medium text-right">
              {ServiceOs?.RateNote}
            </div>
          </div>
        )}
        {ServiceOs?.StaffHis && (
          <div className="flex flex-col px-6 py-4 border-b border-separator dark:border-dark-separator">
            <div className="text-gray-500">Chữ ký khách hàng</div>
            <div className="w-3/5 mt-2 font-medium text-right">
              <div className="p-5 border rounded border-separator dark:border-dark-separator">
                <img
                  className="max-w-full"
                  src={toAbsolutePath(ServiceOs?.StaffHis)}
                  alt="Chữ ký khách hàng"
                />
              </div>
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
