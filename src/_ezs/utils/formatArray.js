import moment from 'moment'
import { formatString } from './formatString'

export const formatArray = {
  useInfiniteQuery: (page, key = 'data') => {
    let newPages = []
    if (!page || !page[0]) return newPages
    for (let items of page) {
      for (let x of items[key]) {
        newPages.push(x)
      }
    }
    return newPages
  },
  findNodeByName: (data, name) => {
    let response = null
    let findNameItem = tree => {
      let result = null
      if (tree.name === name) {
        return tree
      }

      if (Array.isArray(tree.children) && tree.children.length > 0) {
        tree.children.some(node => {
          result = findNameItem(node)
          return result
        })
      }
      return result
    }
    if (!data) return null
    for (let item of data) {
      if (findNameItem(item)) {
        response = findNameItem(item)
        break
      }
    }
    return response
  },
  arrayMove: (array, oldIndex, newIndex) => {
    if (newIndex >= array.length) {
      var k = newIndex - array.length + 1
      while (k--) {
        array.push(undefined)
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])
    return array
  },
  sumTotalKey: (arr, key) => {
    if (!arr || arr.length === 0) return 0
    return arr.reduce((a, b) => a + (b[key] || 0), 0)
  },
  getInitialTime: () => {
    let data = []
    for (let index = 0; index < 7; index++) {
      let obj = {}
      obj.Title = moment().clone().weekday(index).format('dddd').toLowerCase()
      obj.Sub = moment().clone().weekday(index).format('dd')
      obj.index = index
      obj.TimeFrom = '08:00'
      obj.TimeTo = '18:00'
      obj.TimeBefore = 30
      obj.Value = 1
      obj.active = true
      data.push(obj)
    }
    return data
  },
  updateInitialTime: ({ Value }) => {
    let data = [...formatArray.getInitialTime()].map(x => ({
      ...x,
      active: false
    }))
    let Privates = formatString.getValueCurly(Value)
    if (Privates && Array.isArray(Privates)) {
      for (let item of Privates) {
        let index = data.findIndex(x => x.Sub && x.Sub === item.split(';')[0])
        if (index > -1) {
          data[index].active = true
          data[index].TimeFrom = item.split(';')[1]
          data[index].TimeTo = item.split(';')[2]
          data[index].TimeBefore = item.split(';')[3]
        }
      }
    }
    return data
  }
}
