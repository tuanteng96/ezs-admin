import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import React, { Fragment } from 'react'
import { toast } from 'react-toastify'
import StocksAPI from 'src/_ezs/api/stocks.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { DropdownStocksItem } from './DropdownStocksItem'

const DropdownStocks = () => {
  const { CrStocks, Stocks, saveStocks } = useAuth()
  const { updateLoadingContent } = useLayout()

  const stocksMutation = useMutation({
    mutationFn: body => StocksAPI.change(body)
  })

  const onChangeStock = stock => {
    updateLoadingContent(true)
    var bodyFormData = new FormData()
    bodyFormData.append('StockID', stock.ID)

    stocksMutation.mutate(bodyFormData, {
      onSuccess: ({ data }) => {
        if (data.error) {
          toast.error(data.error)
        } else {
          toast.success('Chuyển đổi cơ sở thành công.')
          saveStocks(stock)
        }
        updateLoadingContent(false)
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <>
      <Listbox value={CrStocks} onChange={val => onChangeStock(val)}>
        <div className="relative h-full">
          <div className="flex items-center justify-center h-full">
            <Listbox.Button
              type="button"
              className="flex items-center px-3 mr-2 text-sm font-medium transition rounded text-primary font-inter h-11 bg-light dark:bg-dark-light focus:outline-none focus:shadow-none focus:z-10 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white dark:text-white"
            >
              <span className="block w-[135px] text-left truncate">
                {CrStocks?.Title}
              </span>
              <ChevronDownIcon className="w-3.5 ml-2" />
            </Listbox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-[1001] rounded px-0 py-2 border-0 max-w-[200px] w-full bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute left-0">
              {Stocks.map((item, index) => (
                <Listbox.Option key={index} value={item}>
                  {({ selected }) => (
                    <DropdownStocksItem selected={selected} item={item} />
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  )
}

export { DropdownStocks }
