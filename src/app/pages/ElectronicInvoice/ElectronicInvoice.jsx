import { useMutation, useQuery } from '@tanstack/react-query'
import { chunk, uniqueId } from 'lodash-es'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import { Button } from 'src/_ezs/partials/button'
import { Checkbox } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'

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
                let PriceVAT = (x.Thanh_toan * x.VAT) / 100
                let PriceTotalVAT = x.Thanh_toan - PriceVAT
                return {
                  ItemType: 1,
                  LineNumber: i + 1,
                  ItemCode: x.ProdCode,
                  ItemName: x.ProdTitle,
                  UnitName: x.StockUnit || '',
                  Quantity: x.Qty,
                  UnitPrice: PriceTotalVAT / x.Qty,
                  DiscountRate: 0,
                  DiscountAmountOC: 0,
                  Amount: PriceTotalVAT,
                  AmountOC: PriceTotalVAT,
                  AmountWithoutVATOC: x.Thanh_toan,
                  AmountWithoutVAT: x.Thanh_toan,
                  VATRateName: x.VAT + '%',
                  VATAmountOC: PriceVAT,
                  VATAmount: PriceVAT
                }
              })
              let TotalOrderVAT = formatArray.sumTotalKey(newItems, 'Amount')
              let obj = {
                RefID:
                  item.ID +
                  '-' +
                  moment(
                    moment(filters.From).format('YYYY-MM-DD'),
                    'YYYY-MM-DD'
                  ).unix(),
                InvSeries: '1C25MFB',
                InvDate: moment().format('YYYY-MM-DD'),
                CurrencyCode: 'VND',
                ExchangeRate: 1.0,
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
                TaxRateInfo: [
                  {
                    VATRateName: '10%',
                    AmountWithoutVATOC: formatArray.sumTotalKey(
                      newItems.filter(x => x.VATRateName === '10%'),
                      'Amount'
                    ),
                    VATAmountOC: formatArray.sumTotalKey(
                      item.Items.filter(x => x.VAT === 10),
                      'Thanh_toan'
                    )
                  },
                  {
                    VATRateName: '8%',
                    AmountWithoutVATOC: formatArray.sumTotalKey(
                      newItems.filter(x => x.VATRateName === '8%'),
                      'Amount'
                    ),
                    VATAmountOC: formatArray.sumTotalKey(
                      item.Items.filter(x => x.VAT === 8),
                      'Thanh_toan'
                    )
                  }
                ]
              }
              dataPost.InvoiceData.push(obj)
            }
            invoiceMutation.mutate(
              {
                url: process.env.REACT_APP_API_URL_INVOICE + '/invoice',
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
    console.log([InvoiceID])
    invoiceMutation.mutate(
      {
        url: process.env.REACT_APP_API_URL_INVOICE + '/invoice/publishview',
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
          console.log(rs)
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
                    className="text-primary cursor-pointer font-medium w-full text-center"
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
          console.log(rs)
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
          <div className="flex pb-1 gap-4">
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
