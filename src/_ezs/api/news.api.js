import http from 'src/_ezs/utils/http'

const NewsAPI = {
  list: id => http.get(`/api/gl/select2?cmd=art&includeSource=1&channels=${id}`)
}

export default NewsAPI
