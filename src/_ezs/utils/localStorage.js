export const storeLocalStorage = (data, key) => {
  if (!window.localStorage || !window.JSON || !key) {
    return null
  }
  localStorage.setItem(key, JSON.stringify(data))
}

export const getLocalStorage = key => {
  if (!window.localStorage || !window.JSON || !key) {
    return null
  }
  var item = localStorage.getItem(key)
  if (!item || item === 'undefined') {
    return null
  }

  return JSON.parse(item)
}

export const removeLocalStorage = key => {
  if (!window.localStorage || !window.JSON || !key) {
    return null
  }
  localStorage.removeItem(key)
}
