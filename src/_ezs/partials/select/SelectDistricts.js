import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import MoresAPI from 'src/_ezs/api/mores.api'
import { useQuery } from '@tanstack/react-query'

const SelectDistricts = ({ ProvinceID, value, ...props }) => {
  const ListDistricts = useQuery({
    queryKey: ['ListDistricts', ProvinceID],
    queryFn: async () => {
      const data = await MoresAPI.getDistricts(ProvinceID)
      return data?.data?.map(x => ({ ...x, value: x.ID, label: x.Title })) || []
    },
    onSuccess: () => {},
    enabled: !!ProvinceID
  })

  return (
    <div>
      <Select
        value={
          ListDistricts?.data?.filter(x => x.value === Number(value)) || null
        }
        isLoading={ProvinceID && ListDistricts.isLoading}
        classNamePrefix="select"
        options={ListDistricts?.data || []}
        placeholder="Chọn Quận huyện"
        {...props}
      />
    </div>
  )
}

SelectDistricts.propTypes = {
  ProvinceID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export { SelectDistricts }
