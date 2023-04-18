import React, { useState } from 'react'
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { useMutation, useQuery } from '@tanstack/react-query'
import ConfigAPI from 'src/_ezs/api/config'
import { useAuth } from 'src/_ezs/core/Auth'
import { CalendarLockChildren } from './CalendarLockChildren'
import { toast } from 'react-toastify'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const CalendarLock = props => {
  const { CrStocks, Stocks } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      ListLocks: []
    }
  })
  const { fields } = useFieldArray({
    control,
    name: 'ListLocks'
  })

  const resultLock = useQuery({
    queryKey: ['LockSpa'],
    queryFn: async () => {
      const { data } = await ConfigAPI.getName('giocam')
      return data?.data && data?.data.length > 0 ? data?.data[0].Value : null
    },
    onSuccess: data => {
      let initialValue = []
      if (data) {
        const ListLock = JSON.parse(data)

        initialValue = ListLock.map(x => ({
          ...x,
          ListDisable:
            x.ListDisable && x.ListDisable.length > 0
              ? x.ListDisable.filter(item => {
                  let dateDisable = moment(item.Date, 'DD/MM/YYYY').format(
                    'YYYY/MM/DD'
                  )
                  let dateCurrent = moment(new Date()).format('YYYY/MM/DD')
                  return (
                    !item.Date ||
                    moment(dateCurrent).isSameOrBefore(dateDisable)
                  )
                })
                  .map(item => ({
                    ...item,
                    Date: moment(item.Date, 'DD/MM/YYYY').toDate(),
                    TimeClose:
                      item.TimeClose && item.TimeClose.length > 0
                        ? item.TimeClose.map(time => ({
                            Start: time.Start
                              ? moment(time.Start, 'HH:mm').toDate()
                              : null,
                            End: time.End
                              ? moment(time.End, 'HH:mm').toDate()
                              : null
                          }))
                        : [{ Start: null, End: null }]
                  }))
                  .sort(
                    (a, b) =>
                      moment(a.Date).valueOf() - moment(b.Date).valueOf()
                  )
              : [
                  {
                    Date: null,
                    TimeClose: [{ Start: null, End: null }]
                  }
                ]
        }))
      } else {
        initialValue = Stocks
          ? Stocks.map(x => ({
              StockID: x.ID,
              ListDisable: [
                {
                  Date: null,
                  TimeClose: [{ Start: null, End: null }]
                }
              ]
            }))
          : []
      }
      setValue('ListLocks', initialValue)
    },
    enabled: isOpen
  })

  const onOpen = () => setIsOpen(true)

  const onHide = () => setIsOpen(false)

  const LockUpdateMutation = useMutation({
    mutationFn: body => ConfigAPI.saveName(body)
  })

  const onSubmit = values => {
    const newValues = values.ListLocks.map(({ ListDisable, ...Stock }) => {
      const newListDisable = ListDisable.map(x => {
        let newTimeClose = [
          {
            Start: null,
            End: null
          }
        ]
        if (x.Date) {
          let lengthTimeClose = x.TimeClose.filter(x => x.Start && x.End).length
          newTimeClose =
            x.TimeClose && x.TimeClose.length > 0
              ? x.TimeClose.map(time => ({
                  Start: time.Start
                    ? moment(time.Start).format('HH:mm')
                    : lengthTimeClose === 0
                    ? '00:00'
                    : null,
                  End: time.End
                    ? moment(time.End).format('HH:mm')
                    : lengthTimeClose === 0
                    ? '23:59'
                    : null
                }))
              : [{ Start: '00:00', End: '23:59' }]
        }
        return {
          Date: x.Date ? moment(x.Date).format('DD/MM/YYYY') : null,
          TimeClose: newTimeClose.filter(time => time.Start && time.End)
        }
      }).filter(x => x.Date)
      return {
        ...Stock,
        ListDisable: newListDisable
      }
    })

    LockUpdateMutation.mutate(
      {
        name: 'giocam',
        body: JSON.stringify(newValues)
      },
      {
        onSuccess: ({ data }) => {
          toast.success('Cập nhập đơn vị vận chuyển thành công.')
          onHide()
        },
        onError: error => {
          console.log(error)
        }
      }
    )
  }

  return (
    <>
      <button
        onClick={onOpen}
        type="button"
        className="flex items-center justify-center font-semibold text-gray-900 bg-white border rounded border-light h-11 w-11 dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
      >
        <Cog6ToothIcon className="w-6" />
      </button>
      <AnimatePresence>
        <LayoutGroup key={isOpen}>
          <Dialog open={isOpen} onClose={onHide}>
            <motion.div
              className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1003]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="fixed inset-0 flex items-center justify-center z-[1003]"
              autoComplete="off"
            >
              <motion.div
                className="absolute flex flex-col justify-center h-full py-8"
                initial={{ opacity: 0, top: '60%' }}
                animate={{ opacity: 1, top: 'auto' }}
                exit={{ opacity: 0, top: '60%' }}
              >
                <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                  <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                    <div className="text-2xl font-bold">Khóa lịch</div>
                    <div
                      className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                      onClick={onHide}
                    >
                      <XMarkIcon className="w-8" />
                    </div>
                  </Dialog.Title>
                  <div className="relative p-5 overflow-auto grow">
                    <div
                      className="px-6 py-4 mb-5 border border-dashed rounded bg-warninglight border-warning dark:text-graydark-200"
                      tabIndex={0}
                    >
                      Bạn đang thực hiện khóa lịch tại cơ sở
                      <span className="pl-1.5 font-bold">
                        {CrStocks?.Title}
                      </span>
                    </div>
                    {fields &&
                      fields.map((item, index) => (
                        <CalendarLockChildren
                          Stocks={item}
                          key={item.id}
                          childrenIndex={index}
                          {...{ control }}
                        />
                      ))}
                    <LoadingComponentFull
                      bgClassName="bg-white dark:bg-dark-aside"
                      loading={resultLock.isLoading}
                    />
                  </div>
                  <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                    <Button
                      type="button"
                      className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                      onClick={onHide}
                    >
                      Hủy
                    </Button>
                    <Button
                      loading={LockUpdateMutation.isLoading}
                      disabled={LockUpdateMutation.isLoading}
                      type="submit"
                      className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Thực hiện
                    </Button>
                  </div>
                </Dialog.Panel>
              </motion.div>
            </form>
          </Dialog>
        </LayoutGroup>
      </AnimatePresence>
    </>
  )
}

export { CalendarLock }
