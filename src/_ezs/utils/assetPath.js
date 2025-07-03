export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname
export const toAbsolutePath = pathname =>
  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_URL
    : '') +
  '/upload/image/' +
  pathname
export const toAbsoluteAvatar = (pathname, path = '/upload/image/') =>
  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_URL
    : '') +
  path +
  pathname
