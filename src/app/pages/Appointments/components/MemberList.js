import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  PlusSmallIcon
} from '@heroicons/react/24/outline'
import React, { Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import useEscape from 'src/_ezs/hooks/useEscape'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import MembersAPI from 'src/_ezs/api/members.api'
import { useInfiniteQuery } from '@tanstack/react-query'
import useDebounce from 'src/_ezs/hooks/useDebounce'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { formatString } from 'src/_ezs/utils/formatString'
import { useFormContext } from 'react-hook-form'
import { Menu, Transition } from '@headlessui/react'
import { MemberListTabs } from './MemberListTabs'
import { formatArray } from 'src/_ezs/utils/formatArray'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import MemberPassersBy from './MemberPassersBy'
import { useState } from 'react'
import clsx from 'clsx'

const MemberList = ({
  onOpen,
  valueKey,
  onChangeKey,
  onChange,
  value,
  isShowing
}) => {
  const isAddMode = useMatch('/appointments/new')
  const { pathname } = useLocation()
  const [isPassersBy, setIsPassersBy] = useState(false)
  const debouncedKey = useDebounce(valueKey, 200)
  const { setValue, formState } = useFormContext()
  const watchForm = useFormContext().watch()

  const descRef = useRef()

  useEscape(() => {
    descRef?.current?.blur()
  })
  const ListMembersQuery = useInfiniteQuery({
    queryKey: ['ListMembers', { debouncedKey, value }],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await MembersAPI.memberSearch({
        Pi: pageParam,
        Ps: 20,
        Key: debouncedKey
      })
      return data
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pi === lastPage.pCount ? undefined : lastPage.pi + 1
    },
    enabled: value === ''
  })

  const ListMembers = formatArray.useInfiniteQuery(
    ListMembersQuery?.data?.pages
  )

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: ListMembersQuery.isLoading,
    hasNextPage: ListMembersQuery.hasNextPage,
    onLoadMore: () => ListMembersQuery.fetchNextPage()
    //disabled: !!error,
  })

  const onOpenPassersBy = () => {
    setIsPassersBy(true)
  }

  const onHidePassersBy = () => {
    setIsPassersBy(false)
  }

  const hasIsAnonymous =
    watchForm.IsAnonymous ||
    (!isAddMode && watchForm?.MemberIDs?.MobilePhone === '0000000000')

  return (
    <>
      {value && (
        <>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center w-full max-w-full p-5 border-b border-separator dark:border-dark-separator">
              <div className="w-14">
                <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
                  {formatString.getLastFirst(
                    hasIsAnonymous ? watchForm.FullName : value.FullName
                  )}
                </div>
              </div>
              <div className="flex-1 px-3.5 flex flex-col items-baseline justify-center overflow-hidden">
                <div className="flex w-full mb-px font-semibold dark:text-graydark-800 font-inter">
                  <div className="max-w-[calc(100%-130px)] capitalize truncate">
                    {hasIsAnonymous ? watchForm.FullName : value.FullName}
                  </div>
                  {hasIsAnonymous && (
                    <span className="pl-1 w-[130px]">(Khách vãng lai)</span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700 text-dark dark:text-graydark-800">
                  <span>
                    {hasIsAnonymous ? watchForm.Phone : value.MobilePhone}
                  </span>
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
                        {hasIsAnonymous && (
                          <div
                            className="flex items-center px-4 py-3 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium"
                            onClick={() => {
                              setIsPassersBy(true)
                              close()
                            }}
                          >
                            <div className="flex-1 truncate">
                              Chỉnh sửa thông tin
                            </div>
                          </div>
                        )}
                        {!hasIsAnonymous && (
                          <Link
                            to={`/clients/edit/${value.ID}`}
                            state={{
                              previousPath: pathname,
                              formState: watchForm
                            }}
                            className="flex items-center px-4 py-3 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium"
                          >
                            <div className="flex-1 truncate">
                              Chỉnh sửa thông tin
                            </div>
                          </Link>
                        )}
                      </Fragment>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className="flex items-center px-4 py-3 text-[15px] hover:bg-dangerlight text-danger font-inter transition cursor-pointer font-medium"
                      onClick={() => {
                        if (watchForm.IsAnonymous) {
                          onChangeKey('')
                        }
                        onChange('')
                        setValue('Phone', '')
                        setValue('FullName', '')
                        setValue('IsAnonymous', false)
                        const autoFocus = () => {
                          if (descRef?.current) {
                            descRef?.current?.focus()
                          } else {
                            setTimeout(() => {
                              autoFocus()
                            }, 50)
                          }
                        }
                        autoFocus()
                      }}
                    >
                      <div className="flex-1 truncate">Đổi khách đặt lịch</div>
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <MemberListTabs value={value} hasIsAnonymous={hasIsAnonymous} />
        </>
      )}
      {!value && (
        <>
          <div className="p-5 border-b border-separator dark:border-dark-separator">
            <div className="relative">
              {valueKey && (
                <div
                  className="absolute right-0 flex items-center justify-center w-12 h-full text-gray-500 cursor-pointer"
                  onClick={() => onChangeKey('')}
                >
                  <svg
                    className="w-4"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M12.952 3.048c-2.73-2.73-7.173-2.73-9.904 0-2.73 2.73-2.73 7.173 0 9.904 2.73 2.73 7.173 2.73 9.904 0 2.73-2.73 2.73-7.174 0-9.904zm-2.19 7.714c-.21.21-.552.21-.762 0l-2-2-2.095 2.095c-.21.21-.55.21-.762 0-.21-.21-.21-.552 0-.762L7.238 8l-2-2c-.21-.21-.21-.552 0-.762.21-.21.552-.21.762 0l2 2 1.905-1.904c.21-.21.55-.21.76 0 .212.21.212.55 0 .76L8.763 8l2 2c.21.21.21.55 0 .762z"
                    />
                  </svg>
                </div>
              )}
              <input
                className={clsx(
                  'w-full py-3 pl-12 pr-5 font-medium text-gray-700 transition bg-white border rounded outline-none autofill:bg-white dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700 focus:border-primary dark:focus:border-primary',
                  formState?.errors?.MemberIDs
                    ? 'border-danger'
                    : 'border-gray-300 dark:border-graydark-400'
                )}
                placeholder="Nhập tên hoặc số điện thoại khách hàng"
                onChange={e => onChangeKey(e.target.value)}
                onFocus={onOpen}
                ref={descRef}
                value={valueKey}
              />
              <MagnifyingGlassIcon className="absolute w-5 text-gray-800 pointer-events-none dark:text-graydark-800 top-2/4 -translate-y-2/4 left-3" />
            </div>
          </div>
          {isShowing && (
            <>
              {ListMembersQuery.isLoading && (
                <div className="relative grow">
                  <LoadingComponentFull
                    bgClassName="bg-white dark:bg-dark-aside"
                    loading={ListMembersQuery.isLoading}
                  />
                </div>
              )}
              <div className="flex items-center justify-center py-3.5 border-b border-separator dark:border-dark-separator font-semibold">
                <Link
                  className="flex items-center text-primary"
                  to="/clients/add"
                  state={{
                    previousPath: pathname,
                    formState: watchForm,
                    key: valueKey
                  }}
                >
                  <PlusSmallIcon className="justify-center pr-1 w-7" />
                  Thêm mới khách hàng
                </Link>
              </div>
              {!ListMembersQuery.isLoading && (
                <div className="relative overflow-auto grow" ref={rootRef}>
                  {ListMembers && ListMembers.length > 0 ? (
                    ListMembers.map((member, index) => (
                      <div
                        className="flex p-5 border-b cursor-pointer border-separator dark:border-dark-separator last:mb-0 last:pb-0 last:border-0"
                        key={index}
                        onClick={() => onChange(member)}
                        ref={sentryRef}
                      >
                        <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
                          {formatString.getLastFirst(member.FullName)}
                        </div>
                        <div className="px-3.5 grow flex justify-center flex-col">
                          <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                            {member.FullName}
                          </div>
                          <div className="text-sm font-medium text-gray-700 text-dark dark:text-graydark-800">
                            <span>{member.MobilePhone}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="overflow-auto grow">
                      <div className="flex flex-col items-center justify-center px-10 py-14">
                        <svg
                          className="w-14"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 64 64"
                        >
                          <g fill="none" fillRule="evenodd">
                            <circle
                              fill="#FBD74C"
                              cx="28.5"
                              cy="23.5"
                              r="9.5"
                            />
                            <path
                              className="fill-[#101928] dark:fill-[#92929f]"
                              d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM28 32c3.856 0 7.096.928 9.689 2.392 1.362.77 2.226 2.143 2.305 3.66l.006.229V40a1 1 0 01-.883.993L39 41H17a1 1 0 01-.993-.883L16 40v-1.739c0-1.599.871-3.067 2.29-3.877C20.856 32.924 24.095 32 28 32zm0 2c-3.545 0-6.446.827-8.719 2.122-.748.426-1.216 1.16-1.275 1.966L18 38.26V39h20v-.72c0-.76-.364-1.472-.989-1.945l-.148-.105-.158-.097C34.401 34.832 31.495 34 28 34zm.5-17a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                              fillRule="nonzero"
                            />
                          </g>
                        </svg>
                        <div className="text-center mt-7 text-[17px] leading-7 font-medium dark:text-graydark-800">
                          Không tìm thấy khách hàng. Bạn có thể thực hiện
                          <span
                            className="px-2 cursor-pointer text-primary"
                            onClick={onOpenPassersBy}
                          >
                            Đặt lịch cho khách vãng lai.
                          </span>
                          {/* hoặc
                          <Link
                            className="pl-2 text-primary"
                            to="/clients/add"
                            state={{
                              previousPath: pathname,
                              formState: watchForm,
                              key: valueKey
                            }}
                          >
                            Tạo mới khách hàng
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  )}
                  {ListMembers.length > 0 && ListMembersQuery.hasNextPage && (
                    <div className="flex p-5 border-b cursor-pointer border-separator dark:border-dark-separator last:mb-0 last:pb-0 last:border-0">
                      <div className="flex items-center justify-center font-bold uppercase bg-gray-200 rounded-full w-14 h-14 font-inter dark:bg-gray-700 text-primary animate-pulse"></div>
                      <div className="px-3.5 grow flex justify-center flex-col">
                        <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                          <div className="w-9/12 h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
                        </div>
                        <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {!isShowing && (
            <div className="grow">
              <div className="flex flex-col items-center justify-center px-10 py-14">
                <svg
                  className="w-14"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                >
                  <g fill="none" fillRule="evenodd">
                    <circle fill="#FBD74C" cx="28.5" cy="23.5" r="9.5" />
                    <path
                      className="fill-[#101928] dark:fill-[#92929f]"
                      d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM28 32c3.856 0 7.096.928 9.689 2.392 1.362.77 2.226 2.143 2.305 3.66l.006.229V40a1 1 0 01-.883.993L39 41H17a1 1 0 01-.993-.883L16 40v-1.739c0-1.599.871-3.067 2.29-3.877C20.856 32.924 24.095 32 28 32zm0 2c-3.545 0-6.446.827-8.719 2.122-.748.426-1.216 1.16-1.275 1.966L18 38.26V39h20v-.72c0-.76-.364-1.472-.989-1.945l-.148-.105-.158-.097C34.401 34.832 31.495 34 28 34zm.5-17a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                      fillRule="nonzero"
                    />
                  </g>
                </svg>
                <div className="text-center mt-7 text-[17px] leading-7 font-medium dark:text-graydark-800">
                  Sử dụng tìm kiếm để thêm khách hàng hoặc để trống lưu dưới
                  dạng khách vãng lai.
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <MemberPassersBy
        isOpen={isPassersBy}
        onHide={onHidePassersBy}
        onChange={values => {
          setIsPassersBy(false)
          onChange({
            ID: 0,
            FullName: 'Khách vãng lai',
            label: 'Khách vãng lai',
            value: 0,
            MobilePhone: values.Phone
          })
          setValue('Phone', values.Phone)
          setValue('FullName', values.FullName)
          setValue('IsAnonymous', true)
        }}
        valueKey={valueKey}
      />
    </>
  )
}

MemberList.propTypes = {
  onHide: PropTypes.func,
  onOpen: PropTypes.func
}

export { MemberList }
