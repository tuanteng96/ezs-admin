import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Checkbox, InputNumber } from 'src/_ezs/partials/forms'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import moment from 'moment'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { formatArray } from 'src/_ezs/utils/formatArray'
import Tooltip from 'rc-tooltip'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

function PickerSettingTime({
  children,
  Value,
  onChange,
  setValue,
  initConfiguration
}) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      Configuration: [...formatArray.getInitialTime()]
    }
  })

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'Configuration' // unique name for your Field Array
  })

  useEffect(() => {
    if (!initConfiguration?.active && Value) {
      let data = formatArray.updateInitialTime({ Value: Value })
      reset({
        Configuration: data
      })
    } else {
      let data = [...formatArray.getInitialTime()].map(x => ({
        ...x,
        TimeFrom: initConfiguration?.TimeFrom,
        TimeTo: initConfiguration?.TimeTo,
        TimeBefore: initConfiguration?.TimeBefore || 0
      }))
      reset({
        Configuration: data
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  let { Configuration } = watch()

  const onSubmit = ({ Configuration }) => {
    let newConfiguration = Configuration.filter(x => x.active)
    newConfiguration = newConfiguration
      .map(x => `{${x.Sub};${x.TimeFrom};${x.TimeTo};${x.TimeBefore}}`)
      .join('')
    setValue('Configuration', {
      TimeFrom: '08:00',
      TimeTo: '18:00',
      TimeBefore: 30,
      active: false
    })
    onChange(newConfiguration)
    onHide()
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmitWithoutPropagation}
            className="fixed inset-0 flex items-center justify-center z-[1003]"
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[580px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col max-h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">Cài đặt giờ mở cửa</div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div>
                    <div className="hidden grid-cols-4 gap-3 mb-2 md:grid last:mb-0 font-number text-muted2">
                      <div></div>
                      <div>Giờ mở cửa</div>
                      <div>Giờ đóng cửa</div>
                      <div>Thêm giờ ( phút )</div>
                    </div>
                    {fields.map((item, index) => (
                      <div className="mb-5 last:mb-0" key={item.id}>
                        <div className="grid grid-cols-6 gap-3 md:grid-cols-4">
                          <div className="flex items-center col-span-6 md:col-span-1">
                            <Controller
                              name={`Configuration[${index}].active`}
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <div>
                                  <Checkbox
                                    className="!inline-flex"
                                    labelClassName="pl-2 capitalize font-medium"
                                    labelText={item.Title}
                                    htmlFor={`active-${item.Sub}`}
                                    {...field}
                                    checked={field.value}
                                  />
                                </div>
                              )}
                            />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <Controller
                              name={`Configuration[${index}].TimeFrom`}
                              control={control}
                              rules={{
                                required: Configuration[index].active
                              }}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputDatePicker
                                  disabled={!Configuration[index].active}
                                  selected={
                                    field.value
                                      ? moment()
                                          .set({
                                            hour: moment(
                                              field.value,
                                              'HH:mm'
                                            ).get('hour'),
                                            minute: moment(
                                              field.value,
                                              'HH:mm'
                                            ).get('minute'),
                                            second: moment(
                                              field.value,
                                              'HH:mm'
                                            ).get('second')
                                          })
                                          .toDate()
                                      : null
                                  }
                                  onChange={e => {
                                    field.onChange(
                                      e ? moment(e).format('HH:mm') : null
                                    )
                                  }}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  placeholderText="Giờ mở cửa"
                                  errorMessageForce={fieldState?.invalid}
                                  errorMessage={fieldState?.error?.message}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <Controller
                              name={`Configuration[${index}].TimeTo`}
                              control={control}
                              rules={{
                                required: Configuration[index].active
                              }}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputDatePicker
                                  disabled={!Configuration[index].active}
                                  selected={
                                    field.value
                                      ? moment()
                                          .set({
                                            hour: moment(
                                              field.value,
                                              'HH:mm'
                                            ).get('hour'),
                                            minute: moment(
                                              field.value,
                                              'HH:mm'
                                            ).get('minute'),
                                            second: moment(
                                              field.value,
                                              'HH:mm'
                                            ).get('second')
                                          })
                                          .toDate()
                                      : null
                                  }
                                  onChange={e => {
                                    field.onChange(
                                      e ? moment(e).format('HH:mm') : null
                                    )
                                  }}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  placeholderText="Giờ đóng cửa"
                                  errorMessageForce={fieldState?.invalid}
                                  errorMessage={fieldState?.error?.message}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <div className="flex gap-3">
                              <Controller
                                name={`Configuration[${index}].TimeBefore`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <>
                                    <InputNumber
                                      disabled={!Configuration[index].active}
                                      thousandSeparator={false}
                                      value={field.value}
                                      placeholder="Nhập số phút"
                                      onValueChange={val =>
                                        field.onChange(val.floatValue || 0)
                                      }
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                    />
                                  </>
                                )}
                              />
                              <Tooltip
                                //visible={true}
                                overlayClassName="text-white dark:text-dark-light"
                                placement="top"
                                trigger={['hover']}
                                overlay={
                                  <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800">
                                    <img
                                      className="max-w-[300px]"
                                      src={toAbsoluteUrl(
                                        '/assets/images/note/tip-business.png'
                                      )}
                                      alt=""
                                    />
                                  </div>
                                }
                                align={{
                                  offset: [9, 0]
                                }}
                              >
                                <div className="flex items-center justify-center w-12 h-12 transition rounded-md cursor-pointer">
                                  <QuestionMarkCircleIcon className="w-6 text-warning" />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </m.div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerSettingTime
