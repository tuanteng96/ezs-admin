import http from 'src/_ezs/utils/http'

const NewsAPI = {
  list: id =>
    http.get(`/api/gl/select2?cmd=art&includeSource=1&channels=${id}`),
  categories: id => http.get(`/api/v3/cate25@getPrCh?app=Article&pid=${id}`),
  advs: () => http.get(`/api/v3/adv?cmd=getall`)
}

export default NewsAPI
