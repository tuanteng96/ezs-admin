export const formatString = {
  getLastFirst: text => {
    if (!text) return
    const arrText = text.split(' ')
    if (arrText.length > 1) {
      return arrText[0].charAt(0) + arrText[arrText.length - 1].charAt(0)
    }
    return arrText[0].charAt(0)
  },
  formatVND: price => {
    if (!price || price === 0) {
      return '0'
    } else {
      return price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  formatVNDPositive: price => {
    if (!price || price === 0) {
      return '0'
    } else {
      return Math.abs(price)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  formatValueVoucher: price => {
    if (!price || price === 0) {
      return '0'
    } else if (Math.abs(price) <= 100) {
      return `${price}%`
    } else {
      return Math.abs(price)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  formatTypesProds: type => {
    const obj = {
      type: type,
      title: '',
      path: '',
      ID: ''
    }
    if (type === 'sp') {
      obj.title = 'sản phẩm'
      obj.ID = 794
    }
    if (type === 'nh') {
      obj.title = 'nhãn hàng'
      obj.ID = 4
    }
    return obj
  },
  formatTypesOf: type => {
    if (!type) return ''
    if (type === 'NH') {
      return 'nhãn hàng'
    }
    if (type === 'NVL') {
      return 'nguyên vật liệu'
    }
    if (type === 'SP') {
      return 'sản phẩm'
    }
    if (type === 'PP') {
      return 'phụ phí'
    }
    if (type === 'TT') {
      return 'thẻ tiền'
    }
    return type
  },
  fixedContentDomain: content => {
    if (!content) return ''
    return content.replace(
      /src="\//g,
      'src="' +
        (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
          ? process.env.REACT_APP_API_URL
          : '') +
        '/'
    )
  },
  getValueSquare: str => {
    //Ngoặc vuông []
    if (!str) return []
    return Array.from(str.matchAll(/\[([^\][]*)]/g), x => x[1])
  },
  getValueCurly: str => {
    //Ngoặc nhọn {}
    if (!str) return []
    return Array.from(str.matchAll(/{+([^}]+)}+/g), x => x[1])
  }
}
