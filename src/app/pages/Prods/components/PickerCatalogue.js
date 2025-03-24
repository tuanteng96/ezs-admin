import React, { useState } from 'react'
import { m } from 'framer-motion'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useEscape from 'src/_ezs/hooks/useEscape'
import { formatString } from 'src/_ezs/utils/formatString'
import { useMutation, useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import PerfectScrollbar from 'react-perfect-scrollbar'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'
import { FloatingPortal } from '@floating-ui/react'
import PickerAddCategories from './PickerAddCategories'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const SortableIcon = () => (
  <SortableKnob>
    <div className="flex items-center justify-center w-16">
      <svg
        className="w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 39 39"
      >
        <path
          d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 19 0 C 21.761 0 24 2.239 24 5 C 24 7.761 21.761 10 19 10 C 16.239 10 14 7.761 14 5 C 14 2.239 16.239 0 19 0 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 33 0 C 35.761 0 38 2.239 38 5 C 38 7.761 35.761 10 33 10 C 30.239 10 28 7.761 28 5 C 28 2.239 30.239 0 33 0 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 33 14 C 35.761 14 38 16.239 38 19 C 38 21.761 35.761 24 33 24 C 30.239 24 28 21.761 28 19 C 28 16.239 30.239 14 33 14 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 19 14 C 21.761 14 24 16.239 24 19 C 24 21.761 21.761 24 19 24 C 16.239 24 14 21.761 14 19 C 14 16.239 16.239 14 19 14 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 5 14 C 7.761 14 10 16.239 10 19 C 10 21.761 7.761 24 5 24 C 2.239 24 0 21.761 0 19 C 0 16.239 2.239 14 5 14 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 5 28 C 7.761 28 10 30.239 10 33 C 10 35.761 7.761 38 5 38 C 2.239 38 0 35.761 0 33 C 0 30.239 2.239 28 5 28 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 19 28 C 21.761 28 24 30.239 24 33 C 24 35.761 21.761 38 19 38 C 16.239 38 14 35.761 14 33 C 14 30.239 16.239 28 19 28 Z"
          fill="#CCC"
        ></path>
        <path
          d="M 33 28 C 35.761 28 38 30.239 38 33 C 38 35.761 35.761 38 33 38 C 30.239 38 28 35.761 28 33 C 28 30.239 30.239 28 33 28 Z"
          fill="#CCC"
        ></path>
      </svg>
    </div>
  </SortableKnob>
)

const SortableItems = ({ item, TypeOf }) => {
  return (
    <SortableItem>
      <div className="flex z-[10001] bg-white border-b cursor-pointer border-separator dark:border-dark-separator hover:bg-light">
        <PickerAddCategories initialValues={item} TypeOf={TypeOf}>
          {({ open }) => (
            <div className="flex-1 block px-5 py-4" onClick={() => open()}>
              <div className="mb-1 font-semibold">{item.Title}</div>
              <div className="font-light text-muted2">ID : {item.ID}</div>
            </div>
          )}
        </PickerAddCategories>

        <SortableIcon />
      </div>
    </SortableItem>
  )
}

function PickerCatalogue({ children, TypeOf }) {
  const { ReadCate } = useRoles(['ReadCate'])

  const [Items, setItems] = useState([])
  const [visible, setVisible] = useState(false)

  const { isLoading } = useQuery({
    queryKey: ['Catalogue-lists', TypeOf],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListCategory()
      let result = []
      if (data) {
        result = data[TypeOf]
      }
      return result
    },
    onSuccess: data => setItems(data ? data.filter((_, i) => i > 0) : []),
    enabled: visible
  })

  const updateCategoryMutation = useMutation({
    mutationFn: body => ProdsAPI.addEditCategory(body)
  })

  const onSortEnd = (oldIndex, newIndex) => {
    const ItemsMove = arrayMoveImmutable(Items, oldIndex, newIndex)
    setItems(ItemsMove)
    const dataUpdate = {
      categies: ItemsMove.map((x, index) => ({
        ID: x.ID,
        $type: TypeOf,
        Order: index
      }))
    }
    updateCategoryMutation.mutate(dataUpdate)
  }

  const onToBack = () => {
    setVisible(false)
  }

  useEscape(onToBack)

  const onHide = () => {
    setVisible(false)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <div className="fixed inset-0 flex items-center justify-center z-[1003]">
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[500px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="bg-white dark:bg-dark-aside max-w-full w-[600px] h-full rounded shadow-lg flex flex-col">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-semibold">
                    Danh mục {formatString.formatTypesOf(TypeOf)}
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onToBack}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                {ReadCate?.hasRight && (
                  <div className="border-b border-separator dark:border-dark-separator">
                    <PickerAddCategories TypeOf={TypeOf}>
                      {({ open }) => (
                        <div
                          className="flex items-center px-5 py-4 cursor-pointer text-primary"
                          onClick={() => open()}
                        >
                          <PlusCircleIcon className="w-7 mr-1.5" />
                          Thêm mới danh mục
                        </div>
                      )}
                    </PickerAddCategories>
                  </div>
                )}

                <PerfectScrollbar
                  options={perfectScrollbarOptions}
                  className="relative grow"
                >
                  {isLoading && (
                    <>
                      {Array(4)
                        .fill()
                        .map((_, index) => (
                          <div
                            className="px-5 py-4 transition border-b cursor-pointer animate-pulse border-separator dark:border-dark-separator"
                            key={index}
                          >
                            <div className="mb-2.5 font-bold">
                              <div className="w-2/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                            </div>
                            <div className="text-muted2">
                              <div className="w-1/3 h-2.5 bg-gray-200 rounded dark:bg-gray-700"></div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                  {!isLoading && (
                    <>
                      <SortableList
                        onSortEnd={onSortEnd}
                        className="list"
                        draggedItemClassName="shadow-lg bg-white z-[1000001]"
                      >
                        {Items &&
                          Items.map((item, index) => (
                            <SortableItems
                              key={index}
                              item={item}
                              TypeOf={TypeOf}
                            />
                          ))}
                      </SortableList>

                      {(!Items || Items.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            className="w-16"
                            viewBox="0 0 64 64"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g fill="none" fillRule="evenodd">
                              <path fill="#FBD74C" d="M27 11h16v34H27z" />
                              <path
                                d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM39 14a1 1 0 011 1v26a1 1 0 01-1 1H17a1 1 0 01-1-1V15a1 1 0 011-1zm-1 2H18v24h20V16zm-3 16a1 1 0 01.117 1.993L35 34H21a1 1 0 01-.117-1.993L21 32h14zm0-12a1 1 0 011 1v7a1 1 0 01-1 1H21a1 1 0 01-1-1v-7a1 1 0 011-1zm-1 2H22v5h12v-5z"
                                fill="#101928"
                                fillRule="nonzero"
                              />
                            </g>
                          </svg>
                          <div className="mt-4 font-medium">
                            Chưa có danh mục nào ở đây.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </PerfectScrollbar>
              </div>
            </m.div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerCatalogue
