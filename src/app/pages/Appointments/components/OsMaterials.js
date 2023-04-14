import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { ReactBaseTable } from 'src/_ezs/partials/table'

const OsMaterials = props => {
  const [isOpen, setIsOpen] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      rootid: ''
    }
  })

  const onOpen = () => {
    setIsOpen(true)
  }

  const onHide = () => {
    setIsOpen(false)
  }

  const onSubmit = event => {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault()
      }
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation()
      }
    }

    return handleSubmit(async values => {
      console.log(values)
    })(event)
  }

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'STT',
        dataKey: 'ID',
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'TypeText',
        title: 'Nguyên vật liệu',
        dataKey: 'TypeText',
        cellRenderer: ({ rowData }) => <div>a</div>,
        width: 280,
        sortable: false
        //align: 'center',
      },
      {
        key: 'TypeText1',
        title: 'Số lượng',
        dataKey: 'TypeText1',
        cellRenderer: ({ rowData }) => <div>a</div>,
        width: 190,
        sortable: false
        //align: 'center',
      },
      {
        key: 'TypeText2',
        title: '#',
        dataKey: 'TypeText2',
        cellRenderer: ({ rowData }) => (
          <div className="px-2.5 h-6 flex items-center text-[13px] text-white rounded cursor-pointer bg-danger hover:bg-dangerhv">
            Xóa
          </div>
        ),
        width: 80,
        sortable: false,
        align: 'center'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
        <div className="text-gray-500">Nguyên vật liệu</div>
        <div
          className="w-3/5 font-medium text-right cursor-pointer text-primary"
          onClick={onOpen}
        >
          Thêm mới
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <LayoutGroup key={isOpen}>
              <Dialog open={isOpen} onClose={onHide}>
                <motion.div
                  className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></motion.div>
                <form
                  onSubmit={onSubmit}
                  className="fixed inset-0 flex items-center justify-center z-[1010]"
                >
                  <motion.div
                    className="absolute flex flex-col justify-center h-full py-8"
                    initial={{ opacity: 0, top: '60%' }}
                    animate={{ opacity: 1, top: 'auto' }}
                    exit={{ opacity: 0, top: '60%' }}
                  >
                    <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[650px] max-h-full rounded shadow-lg flex flex-col">
                      <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                        <div className="text-2xl font-bold">
                          Nguyên vật liệu
                        </div>
                        <div
                          className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                          onClick={onHide}
                        >
                          <XMarkIcon className="w-8" />
                        </div>
                      </Dialog.Title>
                      <div className="relative p-5 overflow-auto grow">
                        <ReactBaseTable
                          wrapClassName="h-[300px]"
                          rowKey="ID"
                          columns={columns}
                          data={[{}]}
                          estimatedRowHeight={50}
                          emptyRenderer={
                            <div className="flex items-center justify-center h-full">
                              Không có Nguyên vật liệu
                            </div>
                          }
                        />
                      </div>
                      <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                        <Button
                          type="button"
                          className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                          onClick={onHide}
                        >
                          Đóng
                        </Button>
                        <Button
                          type="submit"
                          className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                          onClick={onSubmit}
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </motion.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export { OsMaterials }
