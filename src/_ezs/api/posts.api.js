import http from 'src/_ezs/utils/http'

const PostsAPI = {
  list: body => http.post(`/api/v3/Article25@get`, JSON.stringify(body)),
  edit: body => http.post(`/api/v3/Article25@edit`, JSON.stringify(body)),
  delete: body => http.post(`/api/v3/Article25@delete`, JSON.stringify(body)),
  categories: body => http.post(`/api/v3/cate25@get`, JSON.stringify(body)),
  categoriesAddEdit: body =>
    http.post(`/api/v3/cate25@edit`, JSON.stringify(body)),
  categoriesDelete: body =>
    http.post(`/api/v3/cate25@delete`, JSON.stringify(body))
}

export default PostsAPI
