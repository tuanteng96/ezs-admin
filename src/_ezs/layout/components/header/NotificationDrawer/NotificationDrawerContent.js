import React from 'react'
import { MemberBooksItem } from './MemberBooksItem'
import { MemberBooksCancelItem } from './MemberBooksCancelItem'
import { MemberNoteItem } from './MemberNoteItem'
import { MemberContactItem } from './MemberContactItem'
import { MemberOrderItem } from './MemberOrderItem'
import { MemberSmsPayed } from './MemberSmsPayed'

const NotificationDrawerContent = ({ name, data }) => {
  const renderSwitch = () => {
    switch (name) {
      case 'memberBooks':
        return <MemberBooksItem data={data} />
      case 'memberBooksCancel':
        return <MemberBooksCancelItem data={data} />
      case 'noti':
        return <MemberNoteItem data={data} />
      case 'contact':
        return <MemberContactItem data={data} />
      case 'orderWebApp':
        return <MemberOrderItem data={data} />
      case 'smsPayed':
        return <MemberSmsPayed data={data} />
      default:
        return 'foo'
    }
  }
  return renderSwitch()
}

export { NotificationDrawerContent }
