import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MembersAPI from 'src/_ezs/api/members.api'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'

const ClientViewContext = createContext()

const useClientView = () => {
  return useContext(ClientViewContext)
}

const ClientViewLayout = ({ children }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const resultMembers = useQuery({
    queryKey: ['MemberViewClient', { Ps: 1, Pi: 1, Key: '#' + id }],
    queryFn: async () => {
      const { data } = await MembersAPI.memberSearch({
        Ps: 1,
        Pi: 1,
        Key: '#' + id
      })
      return data?.data && data?.data.length > 0 ? data?.data[0] : null
    },
    onSuccess: data => {
      if (!data) {
        navigate('/')
      }
    },
    onError: error => {
      navigate('/')
      console.log(error)
    }
  })

  return (
    <ClientViewContext.Provider
      value={{ MemberView: resultMembers?.data || null }}
    >
      {children}
      <LoadingComponentFull loading={resultMembers.isLoading} />
    </ClientViewContext.Provider>
  )
}

export { ClientViewLayout, useClientView }
