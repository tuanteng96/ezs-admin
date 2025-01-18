import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { uniqueId } from 'lodash-es'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import { Button } from 'src/_ezs/partials/button'
import { Checkbox } from 'src/_ezs/partials/forms'
import { ReactBaseTable } from 'src/_ezs/partials/table'
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
        From: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'), //'2025-01-17'
        To: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD') //'2025-01-17'
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
              </>
            ) : (
              <></>
            )}
          </>
        ),

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
          <div className="flex pb-1">
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
            <Button
              type="button"
              className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
              onClick={() => {
                axios
                  .post(
                    'https://testapi.meinvoice.vn/api/integration/invoice',
                    {
                      SignType: 5,
                      InvoiceData: [
                        {
                          RefID: '1f269f4c-08af-4665-b7b6-eb62581f583c',
                          InvSeries: '1C25MFB',
                          InvDate: '2024-09-25',
                          CurrencyCode: 'VND',
                          ExchangeRate: 1.0,
                          PaymentMethodName: 'TM/CK',
                          BuyerLegalName: 'Công ty cổ phần MISA',
                          BuyerTaxCode: '0101243150',
                          BuyerAddress:
                            'Tầng 9 tòa nhà Technosoft, Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
                          BuyerCode: 'MS001',
                          BuyerPhoneNumber: '0241 522 526',
                          BuyerEmail: 'contact@misa.com.vn',
                          BuyerFullName: 'Nguyễn Xuân Hoàng',
                          BuyerBankAccount: '010124315087210',
                          BuyerBankName: 'Ngân hàng Việt Nam Thịnh Vượng',
                          TotalAmountWithoutVATOC: 5000000.0,
                          TotalVATAmountOC: 500000.0,
                          TotalDiscountAmountOC: 0,
                          TotalAmountOC: 5500000.0,
                          TotalAmountInWords: 'Năm triệu năm trăm nghìn đồng.',
                          OriginalInvoiceDetail: [
                            {
                              ItemType: 1,
                              LineNumber: 1,
                              ItemCode: 'AOSM01',
                              ItemName: 'Áo sơ mi Nam 40',
                              UnitName: 'Chiếc',
                              Quantity: 10.0,
                              UnitPrice: 500000.0,
                              DiscountRate: 0,
                              DiscountAmountOC: 0,
                              AmountOC: 5000000.0,
                              AmountWithoutVATOC: 5000000.0,
                              VATRateName: '10%',
                              VATAmountOC: 500000.0,
                              VATAmount: 500000.0
                            }
                          ],
                          TaxRateInfo: [
                            {
                              VATRateName: '10%',
                              AmountWithoutVATOC: 5000000.0,
                              VATAmountOC: 500000.0
                            }
                          ]
                        }
                      ],
                      PublishInvoiceData: null
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                          'Bearer ' +
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJZCI6IjBhNjA5ZWIxLWMxMmQtNGUyZS1hYTVkLWJhNGU4ODRjOGVlMSIsIkNvbXBhbnlJZCI6IjExMzQ5MyIsIlJvbGVUeXBlIjoiMSIsIlVzZXJJZCI6ImI1YzcxZWM0LTM0NDgtNDdjOC1hYjAzLTA3ZGQyMGVlZmU4YyIsIlVzZXJOYW1lIjoidGVzdG1pc2FAeWFob28uY29tIiwiTWlzYUlkIjoiYTkxZjA3ODEtMzE3Ny00NmFmLWI5YmItZjFiOWVmNzY3MjI4IiwiUGhvbmVOdW1iZXIiOiIwOTcxNTAwNzMxIiwiRW1haWwiOiJ0ZXN0bWlzYUB5YWhvby5jb20iLCJUYXhDb2RlIjoiMDEwMTI0MzE1MC0yODYiLCJTZWN1cmVUb2tlbiI6IlBUQ2o4ZFhzejlIVFk1UE1oU29VSjMyTnZadFlHbXNiMDN6cUtPTjB3eE9pSmJTMEdwY2ttbUtzSkgyNWRqMHAiLCJuYmYiOjE3MzcxODU2ODUsImV4cCI6MTczOTc3NzY4NSwiaWF0IjoxNzM3MTg1Njg1LCJpc3MiOiJodHRwczovL21laW52b2ljZS52biIsImF1ZCI6Imh0dHBzOi8vbWVpbnZvaWNlLnZuIn0.rK52mnxRNZuahiV9NXBAga8xjEkTt_WgVszkVfzQ83c'
                      }
                    }
                  )
                  .then(rs => {
                    console.log(rs)
                  })
                  .catch(err => {
                    console.log(err)
                  })

                // InvoiceAPI.urlAction({
                //   url: 'https://testapi.meinvoice.vn/api/integration/auth/token',
                //   headers: {
                //     'Content-Type': 'application/json'
                //   },
                //   param: {},
                //   method: 'POST',
                //   include: 'ENV',
                //   body: {
                //     appid: '0a609eb1-c12d-4e2e-aa5d-ba4e884c8ee1',
                //     taxcode: '0101243150-286',
                //     username: 'testmisa@yahoo.com',
                //     password: '123456Aa'
                //   },
                //   resultType: 'json'
                // })
                //   .then(rs => {
                //     console.log(rs)
                //   })
                //   .catch(err => {
                //     console.log(err)
                //   })

                // axios
                //   .post(
                //     `https://testapi.meinvoice.vn/api/integration/auth/token`,
                //     {
                //       appid: '0a609eb1-c12d-4e2e-aa5d-ba4e884c8ee1',
                //       taxcode: '0101243150-286',
                //       username: 'testmisa@yahoo.com',
                //       password: '123456Aa1'
                //     }
                //   )
                //   .then(rs => {
                //     console.log(rs)
                //   })
                //   .catch(err => {
                //     console.log(err)
                //   })
              }}
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
