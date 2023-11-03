export const formatObject = {
  toQueryString: obj => {
    const keys = Object.keys(obj)
    const keyValuePairs = keys.map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
    return keyValuePairs.join('&')
  }
}
