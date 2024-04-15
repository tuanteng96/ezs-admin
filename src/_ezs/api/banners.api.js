import http from 'src/_ezs/utils/http'

const BannersAPI = {
  list: body => http.post(`/api/v3/adv25@get`, JSON.stringify(body)),
  edit: body => http.post(`/api/v3/adv25@edit`, JSON.stringify(body)),
  delete: body => http.post(`/api/v3/adv25@delete`, JSON.stringify(body)),
  categories: body => http.post(`/api/v3/AdvPos25@get`, JSON.stringify(body)),
  categoriesAddEdit: body =>
    http.post(`/api/v3/AdvPos25@edit`, JSON.stringify(body)),
  categoriesDelete: body =>
    http.post(`/api/v3/AdvPos25@delete`, JSON.stringify(body))
}

export default BannersAPI
