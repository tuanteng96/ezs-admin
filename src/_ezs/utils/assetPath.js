export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname
export const toAbsolutePath = pathname =>
  process.env.REACT_APP_API_URL + '/upload/image/' + pathname
