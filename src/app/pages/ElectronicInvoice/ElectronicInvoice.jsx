import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { chunk, uniqueId } from 'lodash-es'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Button } from 'src/_ezs/partials/button'
import { Checkbox } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { SelectStocks } from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import ExcelHepers from 'src/_ezs/utils/ExcelHepers'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'
import { PickerSettings } from './components'

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
        Origin: false,
        Ids: uniqueId()
      })
    }
  }
  return newArray
}

function ElectronicInvoice(props) {
  const { CrStocks } = useAuth()
  const { GlobalConfig, InvoiceConfig } = useLayout()

  const [filters, setFilters] = useState({
    StockID: [CrStocks],
    From: new Date(), //'2025-01-17'
    To: new Date(), //'2025-01-17'
    Type: '', //XUAT,CHUA_XUAT
    Invoice: '',
    Pi: 1,
    Ps: 15
  })

  const { thu_chi, tong_hop, adminTools_byStock } = useRoles([
    'thu_chi',
    'tong_hop',
    'adminTools_byStock'
  ])

  const [selected, setSelected] = useState([])

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListInvoices', filters],
    queryFn: async () => {
      let { data } = await InvoiceAPI.getList({
        ...filters,
        From: moment(filters.From).format('YYYY-MM-DD'), //'2025-01-17'
        To: moment(filters.To).format('YYYY-MM-DD'), //'2025-01-17'
        StockID:
          filters.StockID && filters.StockID.length > 0
            ? filters.StockID.map(x => x.value)
            : thu_chi?.IsStocks
            ? []
            : thu_chi?.StockRoles?.map(x => x.value)
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

  const invoiceMutationPA = useMutation({
    mutationFn: body => InvoiceAPI.urlActionPA(body)
  })

  const invoiceRefIDMutation = useMutation({
    mutationFn: body => InvoiceAPI.createRefId(body)
  })

  const getProdTitle = Title => {
    if (GlobalConfig?.Admin?.hddt?.replaceProdTitle)
      return Title.replace(/\(.*?\)/g, '')
    return Title
  }

  const getRefID = ({ RefIds, ID, CDate }) => {
    if (!RefIds || RefIds.length === 0) return null
    let index = RefIds.findIndex(
      x =>
        x.OrderID === ID &&
        moment(x.Date, 'YYYY-MM-DD').format('DD-MM-YYYY') === CDate
    )
    if (index === -1) return null
    return (
      RefIds[index].NewInvoiceID ||
      (RefIds[index].InvoiceIDs[0].Status !== 'done' &&
        RefIds[index].InvoiceIDs[0].InvoiceID)
    )
  }

  const updateInvoiceMutation = useMutation({
    mutationFn: async body => {
      let selecteds = []

      if (selected && selected.length > 0) {
        selecteds = selected || []
      } else {
        let rs = await InvoiceAPI.getList({
          ...filters,
          StockID:
            filters.StockID && filters.StockID.length > 0
              ? filters.StockID.map(x => x.value)
              : thu_chi?.IsStocks
              ? []
              : thu_chi?.StockRoles?.map(x => x.value),
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

      let newRs = []
      let totalUpdate = 0

      if (InvoiceConfig?.InvoiceActive?.Code === 'HDPAVN') {
        await Promise.all(
          newLst.map(bill => {
            return new Promise(async (resolve, reject) => {
              let RefIds = await invoiceRefIDMutation.mutateAsync({
                lst: [
                  {
                    OrderID: bill.ID,
                    Date: moment(bill.CDate).format('YYYY-MM-DD')
                  }
                ],
                invoiceNumberID: true
              })

              let newItems = bill.Items.map((x, i) => {
                let PriceVAT = Math.round(
                  x.Thanh_toanVAT / ((100 + x.VAT) / 100)
                )

                let PriceTotalVAT = x.Thanh_toanVAT - PriceVAT

                let detailVatRate = [5, 8, 10].includes(x.VAT) ? x.VAT : -3

                return {
                  feature: 1,
                  code: x.ProdCode,
                  name: getProdTitle(x.ProdTitle),
                  unit: x.StockUnit || '',
                  quantity: x.Qty,
                  price: PriceVAT / x.Qty,
                  detailTotal: PriceVAT,
                  detailVatRate: detailVatRate,
                  detailVatRateOther: detailVatRate === -3 ? x.VAT : '',
                  detailVatAmount: PriceTotalVAT,
                  detailDiscount: '',
                  detailDiscountAmount: '',
                  detailAmount: x.Thanh_toanVAT
                }
              })

              let dataPost = {
                init_invoice: 'HDGTGTMTT',
                action: 'create',
                id_attr: '',
                reference_id: '',
                id_partner: getRefID({
                  ID: bill.ID,
                  RefIds: RefIds?.data || [],
                  CDate: moment(bill.CDate).format('DD-MM-YYYY')
                }),
                invoice_type: '',
                name: 'Hoá đơn giá trị gia tăng máy tính tiền',
                serial: InvoiceConfig?.InvoiceActive?.InvSeries,
                date_export: moment().format('YYYY-MM-DD'),
                customer: {
                  cus_name: '',
                  cus_buyer:
                    GlobalConfig?.Admin?.hddt?.SenderName ||
                    `${bill.SenderName} - ${bill.SenderPhone}`,
                  cus_tax_code: '',
                  cus_address: bill?.SenderAddress || '',
                  cus_phone: bill.SenderPhone,
                  cus_email: '',
                  cus_email_cc: '',
                  cus_citizen_identity: '',
                  cus_bank_no: '',
                  cus_bank_name: ''
                },
                payment_type: '3', // Tiền mặt / chuyển khoản
                discount: 0,
                detail: newItems.map(x => ({
                  ...x,
                  price: formatString.formatVND(x.price, ','),
                  detailTotal: formatString.formatVND(x.detailTotal, ','),
                  detailVatAmount: formatString.formatVND(
                    x.detailVatAmount,
                    ','
                  ),
                  detailAmount: formatString.formatVND(x.detailAmount, ',')
                })),
                total: formatString.formatVND(
                  formatArray.sumTotalKey(newItems, 'detailTotal'),
                  ','
                ),
                vat_amount: formatString.formatVND(
                  formatArray.sumTotalKey(newItems, 'detailVatAmount'),
                  ','
                ),
                amount: formatString.formatVND(
                  formatArray.sumTotalKey(newItems, 'detailAmount'),
                  ','
                ),
                amount_in_words: window.to_vietnamese(
                  formatArray.sumTotalKey(bill.Items, 'Thanh_toanVAT')
                ),
                returnXml: 1,
                autoSign: InvoiceConfig?.InvoiceActive?.SignType,
                currency: 'VND'
              }

              let rsValue = {
                ID: bill.ID,
                InvoiceID: dataPost?.id_partner,
                NewInvoiceID: '' //x.TransactionID + ';' + x.InvNo + ';' + x.InvCode
              }

              let exportInvoice = await invoiceMutationPA.mutateAsync({
                url:
                  formatString.getValueENV(
                    InvoiceConfig?.InvoiceActive?.TestUrl,
                    InvoiceConfig?.InvoiceActive?.BaseUrl,
                    InvoiceConfig?.InvoiceActive?.isDemo
                  ) + '/api/invoice/create-cash-register',
                headers: {
                  'Content-Type': 'application/json'
                },
                param: {},
                method: 'POST',
                include: 'ENV',
                body: dataPost,
                resultType: 'json'
              })

              if (exportInvoice?.data?.result?.status === 422) {
              } else if (
                exportInvoice?.data?.result?.status === 400 &&
                exportInvoice?.data?.result?.message === 'Trùng hóa đơn'
              ) {
                let syncInvoice = await invoiceMutationPA.mutateAsync({
                  url:
                    formatString.getValueENV(
                      InvoiceConfig?.InvoiceActive?.TestUrl,
                      InvoiceConfig?.InvoiceActive?.BaseUrl,
                      InvoiceConfig?.InvoiceActive?.isDemo
                    ) + '/api/invoice/sync-data-cash-register',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  param: {},
                  method: 'POST',
                  include: 'ENV',
                  body: {
                    id_attr: '',
                    id_partner: dataPost?.id_partner,
                    type: 'HDGTGT'
                  },
                  resultType: 'json'
                })
                if (syncInvoice?.data?.result?.data?.lookup_code) {
                  let lookupInvoice = await invoiceMutationPA.mutateAsync({
                    url:
                      formatString.getValueENV(
                        InvoiceConfig?.InvoiceActive?.TestUrl,
                        InvoiceConfig?.InvoiceActive?.BaseUrl,
                        InvoiceConfig?.InvoiceActive?.isDemo
                      ) + '/api/invoice/lookup',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    param: {},
                    method: 'POST',
                    include: 'ENV',
                    body: {
                      matracuu: syncInvoice?.data?.result?.data?.lookup_code
                    },
                    resultType: 'json'
                  })
                  rsValue.NewInvoiceID =
                    syncInvoice?.data?.result?.data?.lookup_code +
                    ';' +
                    (lookupInvoice?.data?.result?.data?.sohoadon ||
                      syncInvoice?.data?.result?.data?.no) +
                    ';' +
                    syncInvoice?.data?.result?.data?.code_cqt
                }
              } else {
                if (exportInvoice?.data?.result?.lookup_code) {
                  let syncInvoice = await invoiceMutationPA.mutateAsync({
                    url:
                      formatString.getValueENV(
                        InvoiceConfig?.InvoiceActive?.TestUrl,
                        InvoiceConfig?.InvoiceActive?.BaseUrl,
                        InvoiceConfig?.InvoiceActive?.isDemo
                      ) + '/api/invoice/sync-data-cash-register',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    param: {},
                    method: 'POST',
                    include: 'ENV',
                    body: {
                      init_invoice: 'HDGTGTMTT',
                      id_attr: '',
                      id_partner: dataPost?.id_partner,
                      type: 'HDGTGTMTT'
                    },
                    resultType: 'json'
                  })
                  if (syncInvoice?.data?.result?.data?.lookup_code) {
                    let lookupInvoice = await invoiceMutationPA.mutateAsync({
                      url:
                        formatString.getValueENV(
                          InvoiceConfig?.InvoiceActive?.TestUrl,
                          InvoiceConfig?.InvoiceActive?.BaseUrl,
                          InvoiceConfig?.InvoiceActive?.isDemo
                        ) + '/api/invoice/lookup',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      param: {},
                      method: 'POST',
                      include: 'ENV',
                      body: {
                        matracuu: syncInvoice?.data?.result?.data?.lookup_code
                      },
                      resultType: 'json'
                    })
                    rsValue.NewInvoiceID =
                      syncInvoice?.data?.result?.data?.lookup_code +
                      ';' +
                      (lookupInvoice?.data?.result?.data?.sohoadon ||
                        syncInvoice?.data?.result?.data?.no) +
                      ';' +
                      syncInvoice?.data?.result?.data?.code_cqt
                  }
                }
              }
              resolve(rsValue)
            }).then(v => {
              newRs = [...newRs, v]
            })
          })
        )
        let updatePost = {
          arr: newRs.filter(x => x.ID && x.InvoiceID && x.NewInvoiceID)
        }
        totalUpdate = updatePost.arr.length
        if (updatePost.arr && updatePost.arr.length > 0) {
          await InvoiceAPI.updateInvoiceIDs(updatePost)
        }
      } else if (InvoiceConfig?.InvoiceActive?.Code === 'HDMISA') {
        newLst = chunk(newLst, 30)
        await Promise.all(
          newLst.map(async list => {
            return new Promise(async (resolve, reject) => {
              let RefIdsPost = list.map(x => {
                let obj = {
                  OrderID: x.ID,
                  Date: moment(x.CDate).format('YYYY-MM-DD')
                }
                return obj
              })

              let RefIds = await invoiceRefIDMutation.mutateAsync({
                lst: RefIdsPost
              })

              let dataPost = {
                SignType: InvoiceConfig?.InvoiceActive?.SignType || 5,
                PublishInvoiceData: null,
                InvoiceData: []
              }

              for (let item of list) {
                let TotalOrder = formatArray.sumTotalKey(
                  item.Items,
                  'Thanh_toanVAT'
                )
                let newItems = item.Items.map((x, i) => {
                  let PriceVAT = Math.round(
                    x.Thanh_toanVAT / ((100 + x.VAT) / 100)
                  )
                  let PriceTotalVAT = x.Thanh_toanVAT - PriceVAT
                  return {
                    ItemType: 1,
                    LineNumber: i + 1,
                    SortOrder: i + 1,
                    ItemCode: x.ProdCode,
                    ItemName: getProdTitle(x.ProdTitle),
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
                  RefID: getRefID({
                    ID: item.ID,
                    RefIds: RefIds?.data || [],
                    CDate: moment(item.CDate).format('DD-MM-YYYY')
                  }),
                  InvSeries: InvoiceConfig?.InvoiceActive?.InvSeries,
                  InvDate: moment().format('YYYY-MM-DD'),
                  CurrencyCode: 'VND',
                  ExchangeRate: 1.0,
                  IsTaxReduction43: TaxRateInfo.some(
                    x => x.VATRateName === '8%'
                  ),
                  // PaymentMethodName: [
                  //   {
                  //     Title: 'TM',
                  //     Value: item.TM
                  //   },
                  //   {
                  //     Title: 'CK',
                  //     Value: item.CK
                  //   },
                  //   {
                  //     Title: 'QT',
                  //     Value: item.QT
                  //   }
                  // ]
                  //   .filter(x => x.Value)
                  //   .map(x => x.Title)
                  //   .join('/'),
                  PaymentMethodName: 'TM/CK',
                  BuyerLegalName: '',
                  BuyerTaxCode: '',
                  BuyerAddress: item?.SenderAddress || '',
                  BuyerCode: '',
                  BuyerPhoneNumber: item.SenderPhone,
                  BuyerEmail: '',
                  BuyerFullName:
                    GlobalConfig?.Admin?.hddt?.SenderName ||
                    `${item.SenderName} - ${item.SenderPhone}`,
                  BuyerBankAccount: '',
                  BuyerBankName: '',
                  TotalSaleAmountOC: formatArray.sumTotalKey(
                    newItems,
                    'Amount'
                  ),
                  TotalSaleAmount: formatArray.sumTotalKey(newItems, 'Amount'),
                  TotalAmountWithoutVATOC: TotalOrderVAT,
                  TotalAmountWithoutVAT: TotalOrderVAT,
                  TotalVATAmountOC: formatArray.sumTotalKey(
                    newItems,
                    'VATAmount'
                  ),
                  TotalVATAmount: formatArray.sumTotalKey(
                    newItems,
                    'VATAmount'
                  ),
                  TotalDiscountAmountOC: 0,
                  TotalDiscountAmount: 0,
                  TotalAmountOC: TotalOrder, // tổng tiền thanh toán
                  TotalAmount: TotalOrder, // Tổng tiền thanh toán
                  TotalAmountInWords: window.to_vietnamese(TotalOrder),
                  OriginalInvoiceDetail: newItems,
                  TaxRateInfo: TaxRateInfo
                }
                obj.RefID && dataPost.InvoiceData.push(obj)
              }

              invoiceMutation.mutate(
                {
                  url:
                    formatString.getValueENV(
                      InvoiceConfig?.InvoiceActive?.TestUrl,
                      InvoiceConfig?.InvoiceActive?.BaseUrl,
                      InvoiceConfig?.InvoiceActive?.isDemo
                    ) + '/invoice',
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
            .filter(
              x =>
                (x?.ErrorCode && x.ErrorCode === 'DuplicateInvoiceRefID') ||
                !x.ErrorCode
            )
            .map(x => ({
              ID: Number(x.RefID.split('-')[0]),
              InvoiceID: x.RefID,
              NewInvoiceID: x.TransactionID + ';' + x.InvNo + ';' + x.InvCode
            }))
        }
        totalUpdate = updatePost.arr.length
        if (updatePost.arr && updatePost.arr.length > 0) {
          await InvoiceAPI.updateInvoiceIDs(updatePost)
        }
      }

      await refetch()
      return {
        data: newRs,
        TotalUpdate: totalUpdate
      }
    }
  })

  const onPreviewInvoice = InvoiceID => {
    if (!InvoiceConfig?.InvoiceActive) {
      toast.error('Vui lòng cài đặt đơn vị xuất hóa đơn điện tử.')
      return
    }
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
    if (InvoiceConfig?.InvoiceActive?.Code === 'HDPAVN') {
      invoiceMutationPA.mutate(
        {
          url:
            formatString.getValueENV(
              InvoiceConfig?.InvoiceActive?.TestUrl,
              InvoiceConfig?.InvoiceActive?.BaseUrl,
              InvoiceConfig?.InvoiceActive?.isDemo
            ) + '/api/invoice/lookup',
          headers: {
            'Content-Type': 'application/json'
          },
          param: {},
          method: 'POST',
          include: 'ENV',
          body: {
            matracuu: InvoiceID
          },
          resultType: 'json'
        },
        {
          onSuccess: rs => {
            toast.dismiss()
            window.toastId = null
            if (rs?.data?.result?.hash) {
              window
                .open(
                  formatString.getValueENV(
                    rs?.data?.result?.hash.replaceAll(
                      'https://cpanel.hoadon30s.vn/',
                      'https://cphoadonuat.hoadon30s.vn/'
                    ) + '/view',
                    rs?.data?.result?.hash + '/view',
                    InvoiceConfig?.InvoiceActive?.isDemo
                  ),
                  '_blank'
                )
                .focus()
            } else {
              toast.error('Không thể view hóa đơn.')
            }
          }
        }
      )
    } else if (InvoiceConfig?.InvoiceActive?.Code === 'HDMISA') {
      invoiceMutation.mutate(
        {
          url:
            formatString.getValueENV(
              InvoiceConfig?.InvoiceActive?.TestUrl,
              InvoiceConfig?.InvoiceActive?.BaseUrl,
              InvoiceConfig?.InvoiceActive?.isDemo
            ) + '/invoice/publishview',
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
            } else {
              toast.error('Không thể view hóa đơn.')
            }
          }
        }
      )
    }
  }

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    if (isScrolling)
      return (
        <div className="pl-15px d-flex align-items">
          <div className="spinner spinner-primary w-40px"></div> Đang tải ...
        </div>
      )
    const indexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
                {rowData?.InvoiceIDStatus === 'done' && rowData.InvoiceID ? (
                  <div
                    className="w-full font-medium text-center cursor-pointer text-primary"
                    onClick={() =>
                      onPreviewInvoice(rowData.InvoiceID.split(';')[0])
                    }
                  >
                    {rowData.InvoiceID.split(';')[0]}
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
        className: ({ rowData }) =>
          rowData?.InvoiceID &&
          rowData?.InvoiceIDStatus === 'pending' &&
          '!bg-warninglight',
        width: 180,
        sortable: false,
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'InvNo',
        title: 'InvNo',
        dataKey: 'InvNo',
        width: 180,
        sortable: false,
        cellRenderer: ({ rowData }) => {
          if (rowData?.InvoiceIDStatus === 'done' && rowData.InvoiceID) {
            if (rowData.InvoiceID.split(';').length > 1) {
              return rowData.InvoiceID.split(';')[1]
            }
          }
          return <></>
        },
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'InvCode',
        title: 'InvCode',
        dataKey: 'InvCode',
        width: 350,
        sortable: false,
        cellRenderer: ({ rowData }) => {
          if (rowData?.InvoiceIDStatus === 'done' && rowData.InvoiceID) {
            if (rowData.InvoiceID.split(';').length > 2) {
              return rowData.InvoiceID.split(';')[2]
            }
          }
          return <></>
        },
        rowSpan: ({ rowData }) => (rowData.Items ? rowData.Items.length : 1)
      },
      {
        key: 'UserInfo',
        title: 'Nhân viên xuất HĐ',
        dataKey: 'UserInfo',
        cellRenderer: ({ rowData }) => (
          <>
            {rowData?.UserInfo && rowData?.UserInfo.length > 0 ? (
              rowData?.UserInfo.map(x => `${x?.FullName || ''}`).join(', ')
            ) : (
              <></>
            )}
          </>
        ),
        width: 220,
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
    [selected, InvoiceConfig?.InvoiceActive]
  )

  const onElectronicInvoices = async () => {
    updateInvoiceMutation.mutate(
      {},
      {
        onSuccess: rs => {
          setSelected([])
          toast.success(`Xuất thành công ${rs?.TotalUpdate} hoá đơn điện tử.`)
        }
      }
    )
  }

  const onExportExcel = async () => {
    let { data } = await InvoiceAPI.getList({
      ...filters,
      From: '2025-03-21', //'2025-01-17'
      To: '2025-03-31', //'2025-01-17'
      StockID: '',
      Ps: 1110
    })

    ExcelHepers.dataToExcel(
      'Hoa-Dong-Dien-Tu-21_03_2025-den_31_03_2025',
      (sheet, workbook) => {
        workbook.suspendPaint()
        workbook.suspendEvent()
        let Head = [
          'ID',
          'TIỀN MẶT',
          'CHUYỂN KHOẢN',
          'QUẸT THẺ',
          'KHÁCH HÀNG',
          'SỐ ĐIỆN THOẠI',
          'MÃ HOÁ ĐƠN',
          'NHÂN VIÊN XUẤT HOÁ ĐƠN'
        ]

        let Response = [Head]

        for (let item of data.lst) {
          let newArray = [
            item.ID,
            item.TM,
            item.CK,
            item.QT,
            item.SenderName,
            item.SenderPhone,
            item?.InvoiceIDStatus === 'done' && item.InvoiceID
              ? item.InvoiceID
              : '',
            item?.UserInfo &&
              item?.UserInfo.map(x => `${x?.FullName || ''}`).join(', ')
          ]
          Response.push(newArray)
        }

        let TotalRow = Response.length
        let TotalColumn = Head.length

        sheet.setArray(2, 0, Response)

        //title
        workbook
          .getActiveSheet()
          .getCell(0, 0)
          .value('Hoá đơn điện tử (21/03/2025 - 31/03/2025)')
        workbook.getActiveSheet().getCell(0, 0).font('18pt Arial')

        workbook
          .getActiveSheet()
          .getRange(2, 0, 1, TotalColumn)
          .font('12pt Arial')
        workbook
          .getActiveSheet()
          .getRange(2, 0, 1, TotalColumn)
          .backColor('#E7E9EB')
        //border
        var border = new window.GC.Spread.Sheets.LineBorder()
        border.color = '#000'
        border.style = window.GC.Spread.Sheets.LineStyle.thin
        workbook
          .getActiveSheet()
          .getRange(2, 0, TotalRow, TotalColumn)
          .borderLeft(border)
        workbook
          .getActiveSheet()
          .getRange(2, 0, TotalRow, TotalColumn)
          .borderRight(border)
        workbook
          .getActiveSheet()
          .getRange(2, 0, TotalRow, TotalColumn)
          .borderBottom(border)
        workbook
          .getActiveSheet()
          .getRange(2, 0, TotalRow, TotalColumn)
          .borderTop(border)
        //filter
        var cellrange = new window.GC.Spread.Sheets.Range(3, 0, 1, TotalColumn)
        var hideRowFilter = new window.GC.Spread.Sheets.Filter.HideRowFilter(
          cellrange
        )
        workbook.getActiveSheet().rowFilter(hideRowFilter)

        //format number
        workbook
          .getActiveSheet()
          .getCell(2, 0)
          .hAlign(window.GC.Spread.Sheets.HorizontalAlign.center)

        //auto fit width and height
        workbook.getActiveSheet().autoFitRow(TotalRow + 2)
        workbook.getActiveSheet().autoFitRow(0)

        // workbook
        //   .getActiveSheet()
        //   .setColumnWidth(0, 400.0, window.GC.Spread.Sheets.SheetArea.viewport)

        for (let i = 1; i < TotalColumn; i++) {
          workbook.getActiveSheet().autoFitColumn(i)
        }

        for (let i = 0; i <= TotalRow; i++) {
          workbook.getActiveSheet().setFormatter(i + 3, 1, '#,#')
          workbook.getActiveSheet().setFormatter(i + 3, 2, '#,#')
          workbook.getActiveSheet().setFormatter(i + 3, 3, '#,#')
          workbook.getActiveSheet().setFormatter(i + 3, 4, '#,#')
        }

        window.top?.toastr?.remove()

        //Finish
        workbook.resumePaint()
        workbook.resumeEvent()
      }
    )
    console.log(data)
  }

  return (
    <div className="relative h-full bg-white dark:bg-dark-app">
      <div className="flex flex-col h-full px-8 pt-8 pb-5 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div
              className="text-3xl font-bold dark:text-white"
              //onClick={onExportExcel}
            >
              Hoá đơn điện tử
            </div>
            <div className="mt-1.5">Quản lý hoá đơn điện tử</div>
          </div>
          <div className="flex gap-2.5 pb-1">
            <SelectStocks
              StockRoles={thu_chi?.StockRoles}
              value={filters.StockID}
              isMulti
              onChange={val => {
                setFilters(prevState => ({
                  ...prevState,
                  StockID: val || []
                }))
              }}
              className="select-control w-[300px]"
              menuPosition="fixed"
              styles={{
                menuPortal: base => ({
                  ...base,
                  zIndex: 9999
                })
              }}
              menuPortalTarget={document.body}
            />
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
            {InvoiceConfig?.InvoiceActive && (
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
            )}

            {tong_hop?.hasRight && adminTools_byStock?.hasRight && (
              <PickerSettings>
                {({ open }) => (
                  <Button
                    type="button"
                    className="relative flex items-center h-12 px-3 text-[#3F4254] transition rounded shadow-lg bg-[#E4E6EF] hover:bg-[#d7dae7] focus:outline-none focus:shadow-none disabled:opacity-70"
                    onClick={open}
                  >
                    <Cog6ToothIcon className="w-6" />
                  </Button>
                )}
              </PickerSettings>
            )}
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
          pageSizes={Number(filters.Ps)}
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
