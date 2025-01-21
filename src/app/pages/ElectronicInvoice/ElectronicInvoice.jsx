import { useMutation, useQuery } from '@tanstack/react-query'
import { chunk, uniqueId } from 'lodash-es'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Button } from 'src/_ezs/partials/button'
import { Checkbox } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'

window.toastId = null

const formatRowRenderer = arr => {
  let newArray = []
  if (!arr || arr.length === 0) return newArray
  for (let [o, lst] of arr.entries()) {
    if (lst?.Items) {
      for (let [k, item] of lst?.Items.entries()) {
        const newObj = {
          ...item,
          ...lst,
          rowIndex: o,
          Ids: uniqueId(),
          Origin: true
        }
        if (k !== 0) {
          delete newObj.Items
          newObj.Origin = false
        }
        newArray.push(newObj)
      }
    } else {
      newArray.push({
        ...lst,
        Origin: false
      })
    }
  }
  return newArray
}

function ElectronicInvoice(props) {
  const [filters, setFilters] = useState({
    StockID: [],
    From: new Date(), //'2025-01-17'
    To: new Date(), //'2025-01-17'
    Type: '', //XUAT,CHUA_XUAT
    Invoice: '',
    Pi: 1,
    Ps: 20
  })

  const { GlobalConfig } = useLayout()
  
  const [selected, setSelected] = useState([])

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListBanners', filters],
    queryFn: async () => {
      let { data } = await InvoiceAPI.getList({
        ...filters,
        From: moment(filters.From).format('YYYY-MM-DD'), //'2025-01-17'
        To: moment(filters.To).format('YYYY-MM-DD') //'2025-01-17'
      })
      return data
        ? {
            ...data,
            lst: formatRowRenderer(data?.lst)
          }
        : null
    },
    keepPreviousData: true
  })

  const invoiceMutation = useMutation({
    mutationFn: body => InvoiceAPI.urlAction(body)
  })

  const updateInvoiceMutation = useMutation({
    mutationFn: async body => {
      let selecteds = []

      if (selected && selected.length > 0) {
        selecteds = selected || []
      } else {
        let rs = await InvoiceAPI.getList({
          ...filters,
          From: moment(filters.From).format('YYYY-MM-DD'),
          To: moment(filters.To).format('YYYY-MM-DD'),
          Ps: data.Total
        })
        selecteds = rs?.data?.lst || []
      }

      let newLst = selecteds.filter(
        x =>
          x.Items &&
          x.Items.length > 0 &&
          (x.CK || x.QT || x.TM) &&
          !x.Items.some(o => !o.VAT)
      )
      newLst = chunk(newLst, 30)
      let newRs = []
      await Promise.all(
        newLst.map(async list => {
          return new Promise(async (resolve, reject) => {
            let dataPost = {
              SignType: 5,
              PublishInvoiceData: null,
              InvoiceData: []
            }
            for (let item of list) {
              let TotalOrder = formatArray.sumTotalKey(item.Items, 'Thanh_toan')
              let newItems = item.Items.map((x, i) => {
                let PriceVAT = Math.round(x.Thanh_toan / ((100 + x.VAT) / 100))
                let PriceTotalVAT = x.Thanh_toan - PriceVAT
                return {
                  ItemType: 1,
                  LineNumber: i + 1,
                  SortOrder: i + 1,
                  ItemCode: x.ProdCode,
                  ItemName: x.ProdTitle,
                  UnitName: x.StockUnit || '',
                  Quantity: x.Qty,
                  UnitPrice: PriceVAT / x.Qty,
                  DiscountRate: 0,
                  DiscountAmountOC: 0,
                  Amount: PriceVAT,
                  AmountOC: PriceVAT,
                  AmountWithoutVATOC: PriceVAT,
                  AmountWithoutVAT: PriceVAT,
                  VATRateName: x.VAT + '%',
                  VATAmountOC: PriceTotalVAT,
                  VATAmount: PriceTotalVAT
                }
              })
              let TotalOrderVAT = formatArray.sumTotalKey(newItems, 'Amount')

              let TaxRateInfo = [
                {
                  VATRateName: '10%',
                  AmountWithoutVATOC: formatArray.sumTotalKey(
                    newItems.filter(x => x.VATRateName === '10%'),
                    'Amount'
                  ),
                  VATAmountOC: formatArray.sumTotalKey(
                    newItems.filter(x => x.VATRateName === '10%'),
                    'VATAmount'
                  )
                },
                {
                  VATRateName: '8%',
                  AmountWithoutVATOC: formatArray.sumTotalKey(
                    newItems.filter(x => x.VATRateName === '8%'),
                    'Amount'
                  ),
                  VATAmountOC: formatArray.sumTotalKey(
                    newItems.filter(x => x.VATRateName === '8%'),
                    'VATAmount'
                  )
                }
              ].filter(x => x.AmountWithoutVATOC && x.VATAmountOC)

              let obj = {
                RefID:
                  item.ID +
                  '-' +
                  moment(
                    moment(filters.From).format('YYYY-MM-DD'),
                    'YYYY-MM-DD'
                  ).unix(),
                InvSeries: GlobalConfig?.Admin?.hddt?.InvSeries,
                InvDate: moment().format('YYYY-MM-DD'),
                CurrencyCode: 'VND',
                ExchangeRate: 1.0,
                IsTaxReduction43: TaxRateInfo.some(x => x.VATRateName === '8%'),
                PaymentMethodName: [
                  {
                    Title: 'TM',
                    Value: item.TM
                  },
                  {
                    Title: 'CK',
                    Value: item.CK
                  },
                  {
                    Title: 'QT',
                    Value: item.QT
                  }
                ]
                  .filter(x => x.Value)
                  .map(x => x.Title)
                  .join('/'),
                BuyerLegalName: '',
                BuyerTaxCode: '',
                BuyerAddress: '',
                BuyerCode: '',
                BuyerPhoneNumber: item.SenderPhone,
                BuyerEmail: '',
                BuyerFullName: item.SenderName,
                BuyerBankAccount: '',
                BuyerBankName: '',
                TotalSaleAmountOC: formatArray.sumTotalKey(newItems, 'Amount'),
                TotalSaleAmount: formatArray.sumTotalKey(newItems, 'Amount'),
                TotalAmountWithoutVATOC: TotalOrderVAT,
                TotalAmountWithoutVAT: TotalOrderVAT,
                TotalVATAmountOC: formatArray.sumTotalKey(
                  newItems,
                  'VATAmount'
                ),
                TotalVATAmount: formatArray.sumTotalKey(newItems, 'VATAmount'),
                TotalDiscountAmountOC: 0,
                TotalDiscountAmount: 0,
                TotalAmountOC: TotalOrder, // tổng tiền thanh toán
                TotalAmount: TotalOrder, // Tổng tiền thanh toán
                TotalAmountInWords: window.to_vietnamese(TotalOrder),
                OriginalInvoiceDetail: newItems,
                TaxRateInfo: TaxRateInfo
              }
              dataPost.InvoiceData.push(obj)
            }
            invoiceMutation.mutate(
              {
                url: GlobalConfig?.Admin?.hddt?.url + '/invoice',
                headers: {
                  'Content-Type': 'application/json'
                },
                param: {},
                method: 'POST',
                include: 'ENV',
                body: dataPost,
                resultType: 'json'
              },
              {
                onSuccess: rs => {
                  resolve(rs)
                }
              }
            )
          }).then(rs => {
            let result = rs?.data?.result?.publishInvoiceResult
            if (result) {
              result = JSON.parse(result)
              newRs = [...newRs, ...result]
            }
          })
        })
      )
      let updatePost = {
        arr: newRs
          .filter(x => !x.ErrorCode)
          .map(x => ({
            ID: Number(x.RefID.split('-')[0]),
            InvoiceID: x.TransactionID
          }))
      }

      let totalUpdate = updatePost.arr.length
      if (updatePost.arr && updatePost.arr.length > 0) {
        await InvoiceAPI.updateInvoiceIDs(updatePost)
      }

      await refetch()
      return {
        data: newRs,
        TotalUpdate: totalUpdate
      }
    }
  })

  const onPreviewInvoice = InvoiceID => {
    if (window.toastId) return
    window.toastId = toast.loading(`Đang tải hoá đơn ${InvoiceID} ...`, {
      icon: (
        <div className="absolute left-4 top-2/4 -translate-y-2/4">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )
    })

    invoiceMutation.mutate(
      {
        url: GlobalConfig?.Admin?.hddt?.url + '/invoice/publishview',
        headers: {
          'Content-Type': 'application/json'
        },
        param: {},
        method: 'POST',
        include: 'ENV',
        body: [InvoiceID],
        resultType: 'json'
      },
      {
        onSuccess: rs => {
          toast.dismiss()
          window.toastId = null
          if (rs?.data?.result?.data) {
            window.open(rs?.data?.result?.data, '_blank').focus()
          }
        }
      }
    )
  }

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    if (isScrolling)
      return (
        <div className="pl-15px d-flex align-items">
          <div className="spinner spinner-primary w-40px"></div> Đang tải ...
        </div>
      )
    const indexList = [0, 1, 2, 3, 4, 5, 6]
    for (let index of indexList) {
      const rowSpan = columns[index].rowSpan({ rowData, rowIndex })
      if (rowSpan > 1) {
        const cell = cells[index]
        const style = {
          ...cell.props.style,
          backgroundColor: 'var(--ezs-element-bg)',
          height: rowSpan * 70 - 1,
          alignSelf: 'flex-start',
          zIndex: 1
        }
        cells[index] = React.cloneElement(cell, { style })
      }
    }
    return cells
  }

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        width: 100,
        sortable: false,
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'TM',
        title: 'Tiền mặt',
        dataKey: 'TM',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.TM),
        width: 160,
        sortable: false,
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'CK',
        title: 'Chuyển khoản',
        dataKey: 'CK',
        width: 160,
        sortable: false,
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.CK),
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'QT',
        title: 'Quẹt thẻ',
        dataKey: 'QT',
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1),
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.QT),
        width: 160,
        sortable: false
      },
      {
        key: 'SenderName',
        title: 'Khách hàng',
        dataKey: 'SenderName',
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1),
        width: 250,
        sortable: false
      },
      {
        key: 'SenderPhone',
        title: 'Số điện thoại',
        dataKey: 'SenderPhone',
        width: 180,
        sortable: false,
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'InvoiceID',
        title: 'Mã hoá đơn',
        dataKey: 'InvoiceID',
        cellRenderer: ({ rowData }) => (
          <>
            {(rowData.TM > 0 || rowData.CK > 0 || rowData.QT > 0) &&
            rowData.Items &&
            rowData.Items.length > 0 &&
            rowData.Items.every(x => x.VAT) ? (
              <>
                {rowData.InvoiceID ? (
                  <div
                    className="w-full font-medium text-center cursor-pointer text-primary"
                    onClick={() => onPreviewInvoice(rowData.InvoiceID)}
                  >
                    {rowData.InvoiceID}
                  </div>
                ) : (
                  <div className="flex justify-center w-full">
                    <Checkbox
                      onChange={e => {
                        let index = selected.findIndex(x => x.ID === rowData.ID)
                        if (index > -1) {
                          setSelected(prevState =>
                            prevState.filter(x => x.ID !== rowData.ID)
                          )
                        } else {
                          setSelected(prevState => [...prevState, rowData])
                        }
                      }}
                      className="!w-auto"
                      checked={selected.some(x => x.ID === rowData.ID)}
                    />
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        ),
        headerClassName: 'justify-center',
        width: 180,
        sortable: false,
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'ProdCode',
        title: 'Mã sản phẩm',
        dataKey: 'ProdCode',
        width: 150,
        sortable: false
      },
      {
        key: 'ProdTitle',
        title: 'Tên sản phẩm',
        dataKey: 'ProdTitle',
        width: 250,
        sortable: false
      },
      {
        key: 'Qty',
        title: 'Số lượng',
        dataKey: 'Qty',
        width: 100,
        sortable: false
      },
      {
        key: 'Thanh_toan',
        title: 'Thanh toán',
        dataKey: 'Thanh_toan',
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData.Thanh_toan),
        width: 160,
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected]
  )

  const onElectronicInvoices = async () => {
    updateInvoiceMutation.mutate(
      {},
      {
        onSuccess: rs => {
          toast.success(`Xuất thành công ${rs?.TotalUpdate} hoá đơn điện tử.`)
        }
      }
    )
  }

  return (
    <div className="relative h-full bg-white dark:bg-dark-app">
      <div className="flex flex-col h-full px-8 pt-8 pb-5 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-3xl font-bold dark:text-white">
              Hoá đơn điện tử
            </div>
            <div className="mt-1.5">Quản lý hoá đơn điện tử</div>
          </div>
          <div className="flex gap-4 pb-1">
            {/* <NavLink
              to={{
                pathname: 'filter',
                search: search
              }}
              className="flex items-center justify-center text-gray-900 bg-light border rounded border-light h-12 w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary mr-2.5"
            >
              <AdjustmentsVerticalIcon className="w-7" />
            </NavLink>
            <NavLink
              to={{
                pathname: 'categories',
                search: search
              }}
              className="flex items-center px-3.5 border border-gray-300 dark:border-gray-700 hover:border-gray-700 dark:hover:border-graydark-700 transition rounded h-12 bg-white mr-2.5 font-semibold"
            >
              Quản lý vị trí
            </NavLink> */}
            <InputDatePicker
              placeholderText="Chọn thời gian"
              autoComplete="off"
              onChange={e => {
                setFilters(prevState => ({
                  ...prevState,
                  From: e,
                  To: e
                }))
              }}
              selected={filters.From ? new Date(filters.From) : null}
              dateFormat="dd/MM/yyyy"
            />
            <Button
              type="button"
              className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
              onClick={async () => {
                onElectronicInvoices()
              }}
              loading={updateInvoiceMutation.isLoading}
              disabled={updateInvoiceMutation.isLoading}
            >
              {selected && selected.length > 0 ? (
                <span>Xuất {selected.length} hoá đơn</span>
              ) : (
                'Xuất tất cả hoá đơn'
              )}
            </Button>
          </div>
        </div>

        <ReactBaseTable
          pagination
          wrapClassName="grow"
          rowKey="Ids"
          columns={columns}
          data={data?.lst || []}
          rowHeight={70}
          emptyRenderer={() =>
            !isLoading && (
              <div className="flex items-center justify-center h-full">
                Không có dữ liệu
              </div>
            )
          }
          isPreviousData={isPreviousData}
          loading={isLoading || isPreviousData}
          pageCount={data?.PCount}
          pageOffset={Number(filters.Pi)}
          pageSizes={Number(filters.Pi)}
          onChange={({ pageIndex, pageSize }) => {
            setFilters(prevState => ({
              ...prevState,
              Pi: pageIndex,
              Ps: pageSize
            }))
          }}
          rowRenderer={rowRenderer}
          rowClassName={({ rowData }) => {
            return (
              (!rowData.VAT ||
                !(rowData.TM > 0 || rowData.CK > 0 || rowData.QT > 0)) &&
              '!bg-dangerlight'
            )
          }}
        />
      </div>
    </div>
  )
}

export default ElectronicInvoice
