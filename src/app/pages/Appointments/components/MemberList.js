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
import { useQuery } from '@tanstack/react-query'
import useDebounce from 'src/_ezs/hooks/useDebounce'
import { Link, useLocation } from 'react-router-dom'
import { formatString } from 'src/_ezs/utils/formatString'
import { useFormContext } from 'react-hook-form'
import { Menu, Transition } from '@headlessui/react'

const MemberList = ({
  onOpen,
  valueKey,
  onChangeKey,
  onChange,
  value,
  isShowing
}) => {
  const { pathname } = useLocation()
  const debouncedKey = useDebounce(valueKey, 200)
  const watchForm = useFormContext().watch()

  const descRef = useRef()

  useEscape(() => {
    descRef?.current?.blur()
  })

  const ListMember = useQuery({
    queryKey: ['ListMembers', debouncedKey],
    queryFn: async () => {
      const { data } = await MembersAPI.memberList({ Key: debouncedKey })
      return data?.data || []
    }
  })

  return (
    <>
      {value && (
        <>
          <Menu as="div" className="relative">
            <Menu.Button className="p-5 border-b border-separator dark:border-dark-separator w-full flex items-center">
              <div className="flex items-center justify-center w-14 h-14 font-bold uppercase rounded-full font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
                {formatString.getLastFirst(value.FullName)}
              </div>
              <div className="px-3.5 grow flex justify-center items-baseline flex-col">
                <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                  {value.FullName}
                </div>
                <div className="text-sm font-medium text-gray-700 text-dark dark:text-graydark-800">
                  <span>{value.MobilePhone}</span>
                </div>
              </div>
              <div>
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
                    <Link
                      to={`/clients/edit/${value.ID}`}
                      state={{ previousPath: pathname, formState: watchForm }}
                      className="flex items-center px-4 py-3 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium"
                    >
                      <div className="flex-1 truncate">Chỉnh sửa thông tin</div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className="flex items-center px-4 py-3 text-[15px] hover:bg-dangerlight text-danger font-inter transition cursor-pointer font-medium"
                      onClick={() => onChange('')}
                    >
                      <div className="flex-1 truncate">Đổi khách đặt lịch</div>
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="grow relative p-5 overflow-auto">Thông tin thêm</div>
        </>
      )}
      {!value && (
        <>
          <div className="p-5 border-b border-separator dark:border-dark-separator">
            <div className="relative">
              {valueKey && (
                <div
                  className="text-gray-500 absolute right-0 h-full w-12 flex items-center justify-center cursor-pointer"
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
                className="w-full pr-5 py-3 font-medium text-gray-700 transition bg-white autofill:bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700 pl-12 border-gray-300 dark:border-graydark-400 focus:border-primary dark:focus:border-primary"
                placeholder="Nhập tên khách hàng"
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
              {ListMember.isLoading && (
                <div className="grow relative">
                  <LoadingComponentFull bgClassName="bg-white" loading={true} />
                </div>
              )}
              <div className="flex items-center justify-center py-3.5 border-b border-separator dark:border-dark-separator font-semibold">
                <Link
                  className="flex items-center text-primary"
                  to="/clients/add"
                  state={{ previousPath: pathname, formState: watchForm }}
                >
                  <PlusSmallIcon className="w-7 justify-center pr-1" />
                  Thêm mới khách hàng
                </Link>
              </div>
              {!ListMember.isLoading && (
                <div className="grow overflow-auto relative">
                  {ListMember.data && ListMember.data.length > 0 ? (
                    ListMember.data.map((member, index) => (
                      <div
                        className="flex p-5 border-b border-separator dark:border-dark-separator last:mb-0 last:pb-0 last:border-0 cursor-pointer"
                        key={index}
                        onClick={() => onChange(member)}
                      >
                        <div className="flex items-center justify-center w-14 h-14 font-bold uppercase rounded-full font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
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
                    <>Không có dữ liệu</>
                  )}
                </div>
              )}
            </>
          )}
          {!isShowing && (
            <div className="grow">
              <div className="flex items-center justify-center flex-col px-10 py-14">
                <svg
                  className="w-14"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                >
                  <g fill="none" fillRule="evenodd">
                    <circle fill="#FBD74C" cx="28.5" cy="23.5" r="9.5" />
                    <path
                      d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM28 32c3.856 0 7.096.928 9.689 2.392 1.362.77 2.226 2.143 2.305 3.66l.006.229V40a1 1 0 01-.883.993L39 41H17a1 1 0 01-.993-.883L16 40v-1.739c0-1.599.871-3.067 2.29-3.877C20.856 32.924 24.095 32 28 32zm0 2c-3.545 0-6.446.827-8.719 2.122-.748.426-1.216 1.16-1.275 1.966L18 38.26V39h20v-.72c0-.76-.364-1.472-.989-1.945l-.148-.105-.158-.097C34.401 34.832 31.495 34 28 34zm.5-17a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                      fill="#101928"
                      fillRule="nonzero"
                    />
                  </g>
                </svg>
                <div className="text-center mt-7 text-[17px] leading-7 font-medium">
                  Sử dụng tìm kiếm để thêm khách hàng hoặc để trống lưu dưới
                  dạng khách vãng lai.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

MemberList.propTypes = {
  onHide: PropTypes.func,
  onOpen: PropTypes.func
}

export { MemberList }
