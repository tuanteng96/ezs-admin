import http from 'src/_ezs/utils/http'

const ProdsAPI = {
  get: ({
    prods = '',
    pi = 1,
    ps = 50,
    typeid = '',
    is_service = 0,
    is_fee = 0,
    key = '',
    display = '',
    rightApp = '',
    v = 2,
    is_sale = 0,
    ServiceOrFee = 3,
    byStock = '',
    manu = '',
    byPublic = '',
    skip_display = ''
  }) =>
    http.get(
      `/admin/smart.aspx?prods=${prods}&pi=${pi}&ps=${ps}&typeid=${typeid}&is_service=${is_service}&is_fee=${is_fee}&key=${key}&display=${display}&rightApp=${rightApp}&v=${v}&is_sale=${is_sale}&ServiceOrFee=${ServiceOrFee}&byStock=${byStock}&manu=${manu}&byPublic=${byPublic}&skip_display=${skip_display}`
    ),
  getList: ({ cates = '', key = '', pi = 1, ps = 20 }) =>
    http.get(
      `/app/index.aspx?cmd=search_prods&token=&key=${key}&cates=${cates}&pi=${pi}&ps=${ps}`
    ),
  getListTypeName: ({ key = '' }) =>
    http.get(
      `/api/gl/select2?cmd=prod&ignore_rootsv=1&ignore_all=1&_type=query&q=${key}`
    ),
  getListService: ({ StockID, Key, Pi, Ps, MemberID }) =>
    http.get(
      `/api/v3/mbook?cmd=getroot&memberid=${
        MemberID || ''
      }&ps=${Ps}&pi=${Pi}&key=${Key || ''}&stockid=${StockID || ''}`
    ),
  getListProdOs: () =>
    http.get(
      `/api/gl/select2?cmd=prod&service_1=1&ignore_all=1&includeSource=1&_type=query`
    ),
  getProdId: ID =>
    http.get(
      `/api/gl/select2?cmd=prod&cateids=${ID}&includeSource=1&_type=query`
    ),
  getProdName: name =>
    http.get(
      `/api/gl/select2?cmd=prod&includeSource=1&includeAll=0&cate_name=${name}&_type=query`
    ),
  getListProdsProduct: body =>
    http.post(`/api/v4/Prod25@sanpham`, JSON.stringify(body)),
  getListCategory: () => http.get(`/api/v3/prod24@CategoryList`),
  addEditCategory: body =>
    http.post(`/api/v3/prod24@categoryEdits`, JSON.stringify(body)),
  getCategoryID: body =>
    http.post(`/api/v3/prod24@CategoryID`, JSON.stringify(body)),
  deleteEditCategory: body =>
    http.post(`/api/v3/prod24@CategoryDelete`, JSON.stringify(body)),
  deleteProdsID: body =>
    http.post(`/api/v3/prod24@delete`, JSON.stringify(body)),
  addUpdateProduct: body =>
    http.post(`/api/v4/Prod25@sanpham`, JSON.stringify(body)),
  getListProd24: body => http.post(`/api/v3/prod24@get`, JSON.stringify(body)),
  prod24UpdateKPI: body =>
    http.post(`/api/v3/prod24@KpiUpdate`, JSON.stringify(body)),
  originalServices: ({ pi = 1, ps = 20 }) =>
    http.get(
      `/api/v3/mbook?cmd=getroot&memberid=&ps=${ps}&pi=${pi}&key=&stockid=`
    ),
  updateImageProd: data =>
    http.post('/api/v3/file25@updates', JSON.stringify(data)),
  searchNamesProd: data =>
    http.post('/api/v3/file25@Get', JSON.stringify(data)),
  getThreeCate: () => http.get(`/admin/smart.aspx?ThreeCate=1`),
  getLevelProdId: (pid = 0) => http.get(`/api/v3/userlevel?cmd=get&pid=${pid}`),
  getInitialProdId: data => http.post('/admin/smart.aspx?set_product=1', data),
  getEditProdId: ({ key = '', foredit = '' }) =>
    http.post(
      `/admin/smart.aspx?prods=1&key=${encodeURIComponent(
        key
      )}&pi=1&ps=1&foredit=${foredit}`
    ),
  addEdit: data => http.post('/admin/smart.aspx?set_product=1&btn=save', data),
  addEditOptions: data => http.post('/admin/smart.aspx?ProductJoin=1', data),
  getProdsOption: (key = '') =>
    http.get(`/services/prod/get.aspx?cmd=get&key=${key}`),
  getProdsCombos: (key = '') =>
    http.get(
      `/api/gl/select2?cmd=prod&ignore_all=1&only_root_and_cate_name=san_pham%2Cthe_tien%2Cnvl&includeSource=1&_type=query&q=${key}`
    ),
  getProdsIdOption: data => http.post(`/admin/smart.aspx?ProductJoin=1`, data),
  getProdSurchargeCard: (key = '') =>
    http.get(
      `/api/gl/select2?cmd=prod&ignore_all=1&ignore_rootsv=1&includeSource=1&cate_name=phu_phi&_type=query&q=${key}`
    )
}

export default ProdsAPI
