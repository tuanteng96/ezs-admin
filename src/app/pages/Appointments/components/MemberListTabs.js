import { useQuery } from '@tanstack/react-query'
import React from 'react'
import MembersAPI from 'src/_ezs/api/members.api'
import { formatString } from 'src/_ezs/utils/formatString'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function MemberListTabs({ value }) {
  const MemberHistory = useQuery({
    queryKey: ['MemberUseHistory', value?.ID],
    queryFn: async () => {
      const { data } = await MembersAPI.memberBought({
        MemberID: value?.ID,
        Pi: 1,
        Ps: 1000
      })
      return data?.items || []
    },
    enabled: !!value?.ID
  })

  return (
    <>
      {!MemberHistory.isLoading && (
        <div className="relative overflow-auto grow">
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-separator dark:border-dark-separator">
            <div className="text-center">
              <div className="mb-px font-bold dark:text-white">
                {formatString.formatVND(value?.Present?.nap_vi)}
              </div>
              <div className="text-gray-400 dark:text-graydark-700">
                Ví khả dụng
              </div>
            </div>
            <div className="text-center">
              <div className="mb-px font-bold dark:text-white">
                {formatString.formatVND(value?.Present?.the_tien_kha_dung)}
              </div>
              <div className="text-muted dark:text-graydark-700">Thẻ tiền</div>
            </div>
            <div className="text-center">
              <div className="mb-px font-bold dark:text-white">
                {formatString.formatVND(value?.Present?.no)}
              </div>
              <div className="text-muted dark:text-graydark-700">Công nợ</div>
            </div>
          </div>
          <div className="px-6 py-4 text-lg font-bold border-b border-separator dark:border-dark-separator dark:text-white">
            Lịch sử mua sản phẩm, dịch vụ
            {MemberHistory.data && MemberHistory.data.length > 0 && (
              <span className="pl-1">({MemberHistory.data.length})</span>
            )}
          </div>
          {MemberHistory.data && MemberHistory.data.length > 0 ? (
            MemberHistory.data.map((item, index) => (
              <div
                className="px-6 py-5 border-b border-separator dark:border-dark-separator"
                key={index}
              >
                <div className="mb-px text-gray-800 dark:text-graydark-800 text-[15px]">
                  {moment(item.CreateDate).format('dd, D MMMM, YYYY')}
                </div>
                <div className="font-bold dark:text-white">{item.Title}</div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded shadow-sm dark:bg-dark-aside">
              <svg
                className="w-16"
                stroke="currentColor"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#FBD74C" d="M6 39h36V7H6z" />
                <path
                  d="M53.5 32.25a.75.75 0 01.743.648l.007.102v25a.75.75 0 01-.648.743l-.102.007h-36a.75.75 0 01-.743-.648L16.75 58V33a.75.75 0 011.493-.102l.007.102v24.25h34.5V33a.75.75 0 01.648-.743l.102-.007zm-12 3a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75zm-.75 1.5h-10.5v4.5h10.5v-4.5zm14.75-19a2.75 2.75 0 012.75 2.75v6a2.75 2.75 0 01-2.75 2.75h-40a2.75 2.75 0 01-2.75-2.75v-6a2.75 2.75 0 012.75-2.75zm0 1.5h-40c-.69 0-1.25.56-1.25 1.25v6c0 .69.56 1.25 1.25 1.25h40c.69 0 1.25-.56 1.25-1.25v-6c0-.69-.56-1.25-1.25-1.25z"
                  fill="#101928"
                />
              </svg>

              <div className="mt-4 mb-1 text-xl font-semibold dark:text-graydark-800">
                Không có dữ liệu
              </div>
              <div className="text-base text-muted">
                Dữ liệu mua sản phẩm, dịch vụ trống.
              </div>
            </div>
          )}
        </div>
      )}
      {MemberHistory.isLoading && (
        <div className="relative grow">
          <LoadingComponentFull
            bgClassName="bg-white dark:bg-dark-aside"
            loading={true}
          />
        </div>
      )}
    </>
  )
}

export { MemberListTabs }
