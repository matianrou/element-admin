import request from '@/utils/request'
export default {
  baseUrl: request.defaults.baseURL,
  // 许可备案申请页面变更操作接口
  changeProductionInfo(params) {
    return request
      .get(`api-precursor/corplicenseinfo/${params.id}`)
      .then(response => response)
      .catch(error => error)
  },
  getEconomicype() {
    return request
      .get(`api-precursor/dict/type/economic_type`)
      .then(response => response)
      .catch(error => error)
  },
}

