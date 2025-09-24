import React from 'react'
import ConfigAPI from 'src/_ezs/api/config'
import { AsyncPaginate } from 'react-select-async-paginate'

const customStyles = {
  multiValue: (provided, state) => {
    let newObj = {
      ...provided,
      borderRadius: '6px'
    }
    if(state.data?.label === "DO" || state.data?.label === "AL") {
      newObj['--color-option'] = "#f74e60"
    }
    else {
      newObj['--bg-option'] = state?.data?.Color || '#f4f6fa'
    }
    return newObj
  },
  multiValueLabel: (provided, state) => ({
    ...provided,
    //color: '#fff', // màu chữ, có thể lấy theo state.data.color nếu muốn
    fontWeight: 500
  }),
  multiValueRemove: (provided, state) => ({
    ...provided
    // color: '#fff',
    // ':hover': {
    //   backgroundColor: '#00000033',
    //   color: '#fff'
    // }
  })
}

function SelectUserShifts2({
  errorMessage,
  errorMessageForce,
  wrapClass = '',
  isEditing = false,
  ...props
}) {
  async function loadOptions(search, loadedOptions, { page }) {
    const { data } = await ConfigAPI.getName('calamviecconfig')
    let result = []
    let rs = []
    if (data.data && data.data.length > 0) {
      if (data.data[0].Value) {
        let p = JSON.parse(data.data[0].Value)
        result = p.map(x => ({ ...x, value: x.ID, label: x.Name }))

        let index = result.findIndex(x =>
          x.Name.toLowerCase().includes('roster')
        )
        if (index > -1) {
          rs =
            result[index].Options && result[index].Options.length > 0
              ? result[index].Options.map(x => ({
                  ...x,
                  label: x.Title,
                  value: x.Title
                }))
              : []
        }
      }
    }
    return {
      options: rs || [],
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <div className={wrapClass}>
      <AsyncPaginate
        loadOptions={loadOptions}
        additional={{ page: 1 }}
        classNamePrefix="select"
        placeholder="Chọn loại ca"
        noOptionsMessage={() => 'Không có dữ liệu'}
        loadingMessage={() => 'Đang tải...'}
        styles={customStyles}
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectUserShifts2 }
