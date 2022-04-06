import request from '@/utils/request'
export default {
  baseUrl: request.defaults.baseURL,
  // api-precursor/dict
  // 超级管理员字典管理列表查询接口
  getDict(param) {
    // api-precursor/dict
    return request
      .get(
        `api-precursor/dict/${param.type}/${param.value}?limit=` +
        param.limit +
        `&page=` +
        param.page
      )
      .then(response => response)
      .catch(error => error)
  },
  // 超级管理员字典管理列表保存接口
  saveDict(param) {
    return request
      .post(
        `api-precursor/dict`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 超级管理员字典管理删除接口
  deleteDict(id) {
    // api-precursor/dict
    return request
      .delete(
        `api-precursor/dict/${id}`
      )
      .then(response => response)
      .catch(error => error)
  },
  // 查询字典接口
  getDictType(param) {
    return request
      .get(`api-precursor/dict/type/` + param.type)
      .then(response => response)
      .catch(error => error)
  },
  // 获取地区接口
  getArea(param) {
    return request
      .get(`api-precursor/area/findAlls/${param.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 获取当前地区接口
  getThisArea(param) {
    return request
      .post(`api-precursor/area/treeselByLoginAraeId`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 获取组织机构
  gettreeselect() {
    return request
      .get(`api-user/office/treeselect`)
      .then(response => response)
      .catch(error => error)
  },
  // api-user/roles/getRoleByType
  getRoleByType() {
    return request
      .get(`api-user/roles/getRoleByType`)
      .then(response => response)
      .catch(error => error)
  },
  // 当前企业用户审核
  resetAdministrator(param) {
    return request
      .post(`api-user/users/resetAdministrator`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 注册账号校验
  getuser(param) {
    return request
      .get(`api-user/users/anon/login?username=` + param.username)
      .then(response => response)
      .catch(error => error)
  },
  // 验证单位名称
  UnitVerify(param) {
    return request
      .post(`api-precursor/corpbasicinfo/findCorpNameByName`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 注册验证
  enterverify(param) {
    return request
      .post(`api-user/users/verify/register`, param)
      .then(response => response)
      .catch(error => error)
  },
  getRegister(param) {
    return request
      .post(`api-user/users/register`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 角色分配
  rolealloat(param, id) {
    return request
      .post(`api-user/users/` + id + '/roles', param)
      .then(response => response)
      .catch(error => error)
  },
  /*
   * limit 每页条数
   * page 当前页
   * access_token 当前登录 token
   */
  // 用户管理----> 获取当前用户列表
  getUserInfo(param) {
    return request
      .get(
        `api-user/users?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&nickname=` +
        param.nickname +
        `&officeId=` +
        param.officeId +
        `&isOwnOffice=` +
        param.isOwnOffice
      )
      .then(response => response)
      .catch(error => error)
  },
  /*
   * id：当前用户 id
   */
  // 用户管理----> 删除当前用户
  deleteUserInfo(param) {
    return request
      .delete(`api-user/users/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 用户管理----> 编辑
  // https://yzd.mem.gov.cn/api-user/users/auditChargerStatus
  auditUser(param) {
    return request
      .post(`api-user/users/auditChargerStatus`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 用户管理----> 保存
  saveUser(param) {
    return request
      .post(`api-user/users/saveOrUpdate/`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 用户管理----> 查询
  searchUser(param) {
    return request
      .get(
        `api-user/users/search?limit=` +
        param.limit +
        `&page=` +
        param.page +
        '&queryStr=' +
        param.queryStr
      )
      .then(response => response)
      .catch(error => error)
  },
  // 用户管理----> 审核
  updateEnabled(param) {
    return request
      .get(
        `api-user/users/updateEnabled?enabled=` +
        param.enabled +
        `&id=` +
        param.id
      )
      .then(response => response)
      .catch(error => error)
  },
  // 用户管理-----> 重置密码
  resetUserPs(param) {
    return request
      .put(`api-user/users/resetPassword/${param.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 企业注销
  userswriteOff(param) {
    return request
      .get(`api-precursor/corpbasicinfo/logout/${param.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 用户管理-----> 用户注销
  writeOff(param) {
    return request
      .put(`api-user/users/${param.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 角色管理----> 查询
  getRoleInfo(param) {
    return request
      .get(`api-user/roles?name=` + param.name)
      .then(response => response)
      .catch(error => error)
  },
  // 角色管理----> 添加
  saveRole(param) {
    return request
      .post(`api-user/roles/saveOrUpdate`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 角色管理----> 删除
  deleteRole(param) {
    return request
      .delete(`api-user/roles/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 角色管理----> 查询所有菜单
  getFindAlls() {
    return request
      .get(`api-user/menus/findAlls`)
      .then(response => response)
      .catch(error => error)
  },
  // 菜单管理----> 列表查询
  getMenusInfo() {
    return request
      .get(`api-user/menus/current`)
      .then(response => response)
      .catch(error => error)
  },
  // 菜单管理----> 添加
  addMenus(param) {
    return request
      .post(`api-user/menus/saveOrUpdate`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 菜单管理----> 删除
  deleteMenus(param) {
    return request
      .delete(`api-user/menus/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  addrole(param) {
    return request
      .post(`api-user/menus/granted`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 列表,提交
  getenterInfo(param) {
    return request
      .get(
        `api-precursor/corpbasicinfo?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&auditStatus=` +
        param.auditStatus +
        `&corpName=` +
        param.corpName +
        `&officeId=` +
        param.officeId +
        `&isOwnOffice=` +
        param.isOwnOffice +
        `&startTime=` +
        param.startTime +
        `&endTime=` +
        param.endTime
      )
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 企业信息录入
  addenterdata(param) {
    return request
      .post(`api-precursor/corpbasicinfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 企业信息删除
  deleteEnterdata(param) {
    return request
      .delete(`api-precursor/corpbasicinfo/` + param.id)
      .then(response => response)
      .catch(error => error)
  },

  // 企业信息管理----> 基本信息编辑  查询
  searchmsg(param) {
    return request
      .get(`api-precursor/corpbasicinfo/info/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 许可备案信息编辑  查询
  searchentery(param) {
    return request
      .get(`api-precursor/corplicenseinfo/` + param.id + `&`)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 易制毒编辑  查询
  searcadmin(param) {
    return request
      .get(`api-precursor/pprodoper/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 详情查看
  entercheck(param) {
    return request
      .get(`api-precursor/corpbasicinfo/info/` + param.id)
      .then(response => response)
      .catch(error => error)
  },

  // 企业年报----> 列表 填报二
  annualreporttwo(param) {
    return request
      .get(
        `api-precursor/annualreporttwo?limit=` +
        param.limit +
        `&page=` +
        param.page
      )
      .then(response => response)
      .catch(error => error)
  },

  // 企业年报----> 填写 填报一
  addannualreporttwo(param) {
    return request
      .post(`api-precursor/annualreporttwo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业年报----> 删除 填报二
  deleteannualreporttwo(param) {
    return request
      .delete(`api-precursor/annualreporttwo/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 企业年报----> 查询
  entersearch(param) {
    return request
      .get(
        `api-precursor/pprodoper?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&licenseId=` +
        param.licenseId +
        `&corpId=` +
        param.corpId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 颁证季报一 ----> 保存
  addlicensOne(param) {
    return request
      .post(`api-precursor/licensingquarterlyone`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 颁证季报二列表 ----> 保存
  addlicensTwo(param) {
    return request
      .post(`api-precursor/licensingquarterlytwo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 颁证季报二列表 ----> 查询列表
  getlicensingquarterlytwo(param) {
    return request
      .get(
        `api-precursor/licensingquarterlytwo/findLicensingTwo?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&year=` +
        param.year +
        `&quarter=` +
        param.quarter +
        `&officeId=` +
        param.officeId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 颁证季报二列表 ----> 删除
  deletelicensingquarterlytwo(param) {
    return request
      .delete(`api-precursor/licensingquarterlytwo/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  getyearenter(param) {
    return request
      .get(`api-precursor/corpbasicinfo/annual/` + param.id + '/' + param.year)
      .then(response => response)
      .catch(error => error)
  },
  // 根据季度查询季报表
  getreport(param) {
    return request
      .get(
        `api-precursor/licensingquarterlyone/` +
        param.year +
        '/' +
        param.quarter
      )
      .then(response => response)
      .catch(error => error)
  },
  // 企业销售管理查询列表接口
  enterpriseSales(param) {
    return request
      .get(
        `api-precursor/psalesinfo/?limit=` +
        param.limit +
        `&page=` +
        param.page +
        '&year=' +
        param.year +
        '&status=' +
        param.status
      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 企业审核接口
  enteraudit(param) {
    return request
      .post(`api-precursor/corpbasicinfo/applayCorpInfoState`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业销售管理 新增 列表接口
  addenterpriseSales(param) {
    return request
      .post(`api-precursor/psalesinfo/save`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业销售管理 查看  接口
  checkenterpriseSales() {
    return request
      .get(
        `api-precursor/psalesinfo/findCorpSalesById/` +
        param.year +
        '/' +
        param.quarter
      )
      .then(response => response)
      .catch(error => error)
  },
  // 企业销售管理 删除  接口
  deleteenterpriseSales(param) {
    return request
      .delete(`api-precursor/psalesinfo/delete/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 生产经营管理
  addpprodoper(param) {
    return request
      .delete(`api-precursor/psalesinfo/delete/` + param.id)
      .then(response => response)
      .catch(error => error)
  },

  // 生产经营管理
  getProduce(param) {
    return request
      .get(
        `api-precursor/pprodoper/?limit=` +
        param.limit +
        `&page=` +
        param.page +
        '&year=' +
        param.year +
        '&corpId=' +
        param.corpId +
        '&licenseType=' +
        param.licenseType +
        '&productionType=' +
        param.productionType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 购入管理
  getpurchase(param) {
    return request
      .get(
        `api-precursor/pprodoper/purchase/?limit=` +
        param.limit +
        `&page=` +
        param.page +
        '&year=' +
        param.year +
        '&corpId=' +
        param.corpId +
        '&licenseType=' +
        param.licenseType +
        '&productionType=2'
      )
      .then(response => response)
      .catch(error => error)
  },
  // 购入保存
  purchaseSave(param) {
    return request
      .post(`api-precursor/pprodoper/purchaseSave`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 公共组件流向数据
  getfindPrdOperInfo(param) {
    return request
      .post(`api-precursor/pprodoper/findPrdOperInfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 生产经营管理保存
  addenteryizhidu(param) {
    return request
      .post(`api-precursor/pprodoper`, param)
      .then(response => response)
      .catch(error => error)
  },
  // api-precursor/pprodoper/findPrdOperFlowFrom
  findPrdOperFlowFrom(param) {
    return request
      .post(`api-precursor/pprodoper/findPrdOperFlowFrom`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 生产购入管理上报接口
  reprotUpdate(param) {
    return request
      .post(`api-precursor/pprodoper/reprotUpdate`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 销售流向上报
  salereprotlist(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/reportProductionFolw`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 销售流向删除接口
  // api-precursor/prodChemicalFlow/delProductionFolw
  delProductionFolw(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/delProductionFolw`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 销售流向添加接口
  // api-precursor/prodsChemicalFlow/productionFolwSave
  productionFolwSave(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/productionFolwSave`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 生产经营管理删除
  deleteenteryizhidu(param) {
    return request
      .delete(`api-precursor/pprodoper/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 销售流向管理
  // api-precursor/prodChemicalFlow/?limit=5&page=1&year=2021&corpId=82041
  prodChemicalFlow(param) {
    return request
      .get(
        `api-precursor/pprodoper/xSList/?limit=` +
        // `api-precursor/prodChemicalFlow/?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&year=` +
        param.year +
        `&corpId=` +
        param.corpId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 查询当前企业申请的证书类型
  searchFirmCredential(param) {
    return request
      .get(
        `api-precursor/corplicenseinfo/findLicenseByCorpId?corpId=` +
        param.corpId +
        `&officeId=` +
        param.officeId +
        `&licenseType=` +
        param.licenseType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 备案材料 列表查询
  getputRecordlist(param) {
    return request
      .get(
        `api-precursor/pfilingmaterials?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&materialsType=` +
        param.materialsType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 备案材料 列表 添加
  addputRecordlist(param) {
    return request
      .post(`api-precursor/pfilingmaterials`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 备案材料 文件 上传
  putRecord(param) {
    return request
      .post(`api-precursor/fileUpload/uploadPicture`, param)
      .then(response => response)
      .catch(error => error)
  },
  deleteRecordlist(param) {
    return request
      .delete(`api-precursor/pfilingmaterials/` + param.id)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息管理----> 许可信息备案保存
  addbeian(param) {
    return request
      .get(
        `api-precursor/corplicenseinfo/?limit=` +
        param.limit +
        `&page=` +
        param.page
      )
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案信息二维码
  getBase64Code() {
    return request
      .get('api-precursor/corplicenseinfo/findQrCodeUrl/23')
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案申请接口
  addProductionInfo(params) {
    return request
      .post('api-precursor/corplicenseinfo', params)
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案申请许可备案类型区划接口
  getlicensTypeArea(params) {
    return request
      .get(
        `/api-precursor/corplicenseinfo/${params.licenseType}/${params.licenseChemicalType
        }`
      )
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案申请页面变更操作接口
  changeProductionInfo(params) {
    return request
      .get(`api-precursor/corplicenseinfo/${params.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案打印查询列表接口
  getGmLicensPrintList(params) {
    return request
      .get(
        `/api-precursor/corplicenseinfo?officeId=${params.officeId
        }&licenseStatus=${params.licenseStatus}&page=${params.page}&limit=${params.limit
        }&corpName=${params.corpName}&corpName=${params.corpName}&reqType=${params.reqType}`
      )
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案打印查询信息接口
  getGmLicensPrintInfo(params) {
    return request
      .get(`/api-precursor/corplicenseinfo/${params.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案打印完毕接口
  completeGmLicensPrint(params) {
    return request
      .post('api-precursor/corplicenseinfo/printDone', params)
      .then(response => response)
      .catch(error => error)
  },

  // 许可备案审批查询列表接口
  getGmLicenseRecordList(params) {
    return request
      .get(`/api-precursor/task/list?page=${params.page}&limit=${params.limit}`)
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案审批获取审批节点接口
  getGmLicenseRecordAuditNode(params) {
    return request
      .get(`/api-precursor/historyFromData/ByInstanceId/${params.id}`)
      .then(response => response)
      .catch(error => error)
  },
  // 许可备案审批页面审批接口
  auditGmLicenseRecordInfo(params) {
    return request
      .post(`/api-precursor/task/formDataSave/${params.id}`, params.list)
      .then(response => response)
      .catch(error => error)
  },

  // 字典表接口请求
  getEconomic_type() {
    return request
      .get(`api-user/dict/type/economic_type`)
      .then(response => response)
      .catch(error => error)
  },
  // 获取各种类型字典接口
  getcorp_type(type) {
    return request
      .get(`api-precursor/dict/type/${type}`)
      .then(response => response)
      .catch(error => error)
  },
  // 获取品种类型接口
  getchemical_type() {
    return request
      .get(`api-user/dict/type/chemical_type`)
      .then(response => response)
      .catch(error => error)
  },
  getCorpTypeByLicenseCorpId(params) {
    return request
      .get(`/api-precursor/corplicenseinfo/getCorpTypeByLicenseCorpId?corpId=${params.corpId}`)
      .then(response => response)
      .catch(error => error)
  },
  getCorpTypeByLicenseCorpId(params) {
    return request
      .get(`/api-precursor/corplicenseinfo/getCorpTypeByLicenseCorpId?corpId=${params.corpId}`)
      .then(response => response)
      .catch(error => error)
  },
  // api-precursor/corplicenseinfo/findLicenseByCorpId?corpId=82041&licenseChemicalType=2
  findByChemicalType(param) {
    return request
      .get(`api-precursor/chemicalInfo/findByChemicalType/` + param)
      .then(response => response)
      .catch(error => error)
  },
  // 查用户岗位字典
  getAllPoles_type() {
    return request
      .get(`api-user/post/allPoles`)
      .then(response => response)
      .catch(error => error)
  },
  /*
   *
   *政府用户接口
   *
   */
  // 化学品列表接口
  getchemicalInfo(param) {
    return request
      .get(
        `api-precursor/chemicalInfo/?limit=` +
        param.limit +
        `&page=` +
        param.page +
        '&chemicalName=' +
        param.chemicalName +
        '&chemicalType=' +
        param.chemicalType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 生产经营管理--保存新添
  productionSave(param) {
    return request
      .post(`api-precursor/pprodoper/productionSave`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 化学品列表添加
  addchemicalInfo(param) {
    return request
      .post(`api-precursor/chemicalInfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 化学品列表添加/编辑-- 计量单位
  measurement(param) {
    return request
      .get(`api-precursor/dict/type/chemical_unit`)
      .then(response => response)
      .catch(error => error)
  },
  // 企业信息查询
  getEnterMsg(param) {
    return request
      .post(`api-precursor/corpbasicinfo/applayCorpInfoByCorpId`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业年报----> 列表请求 填报一
  annualreportone(url, param) {
    return request
      .get(
        url +
        `?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&year=` +
        param.year
      )
      .then(response => response)
      .catch(error => error)
  },
  getyeartree(url, param) {
    return request
      .get(`api-precursor/office/treeselByLoginOffiD`)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端年报上报
  yeartopreport(param) {
    return request
      .post(`api-precursor/pprodoper/findReptYearDeptXiaoShaoInfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 企业年报----> 填写 填报一
  saveEnterprisesFillOne(param) {
    return request
      .post(`api-precursor/annualreportone?save`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 年报查看 ？？？？？？？？？？？？？？？
  getYearreport(param) {
    return request
      .post(`api-precursor/pprodoper/findPrdOperInfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端年报上报查询接口
  getyearzhengfu(param) {
    return request
      .post(
        `api-precursor/annualReportController/selectReptYearZongInfo`,
        param
      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 许可备案颁发编辑接口
  savelanguage(param) {
    return request
      .post(`api-precursor/corplicenseinfo/issue`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 许可备案颁发--许可证编号前8位
  licenceNumber(param) {
    return request
      .post(`api-precursor/corplicenseinfo/getLicenseNoPrefix `, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 年报编辑查询
  // api-precursor/annualReportController/findThiReportAnnualInfo
  // api-precursor/annualReportController/selectRepThisYears
  // 生产经营情况
  // api-precursor/annualReportController/selectDeptShenChanInfo
  lineOperation(param) {
    return request
      .get(`api-precursor/annualReportController/selectDeptShenChanInfo?limit=${param.limit}&limit=${param.limit}&page=${param.page}&isOwnOffice=${param.isOwnOffice}&startTime=${param.startTime}&officeId=${param.officeId}&endTime=${param.endTime}`)
      .then(response => response)
      .catch(error => error)
  },
  getyearReportlist(url, param) {
    return request
      .get(
        url +
        `?reportingYear=` +
        param.reportingYear +
        `&officeId=` +
        param.officeId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 查询 项目一数据
  getyearOne(param) {
    return request
      .get(
        `api-precursor/annualReportController/findThiReportAnnualInfo`,
        param
      )
      .then(response => response)
      .catch(error => error)
  },
  // 查询 项目二数据
  getyearTwo(param) {
    return request
      .get(
        `api-precursor/annualreportone?limit=` +
        param.limit +
        `&page=` +
        param.page
      )
      .then(response => response)
      .catch(error => error)
  },
  // 年报上报
  uploadyearreport(url, param) {
    return request
      .post(url, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端年报撤销
  repealyearreport(param) {
    return request
      .post(
        `api-precursor/annualReportController/rebackThiReportAnnualInfo`,
        param
      )
      .then(response => response)
      .catch(error => error)
  },
  // 全部许可申请
  getrecord(param) {
    return request
      .get(
        `api-precursor/corplicenseinfo?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&startTime=` +
        param.startTime +
        `&licenseStatus=` +
        param.licenseStatus +
        `&endTime=` +
        param.endTime +
        `&corpName=` +
        param.corpName +
        `&reqType=` +
        param.reqType +
        `&isOwnOffice=` +
        param.isOwnOffice +
        `&officeId=` +
        param.officeId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 填报二 颁证季报查询
  getfindLicensingTwo(param) {
    return request
      .get(
        `api-precursor/licensingquarterlytwo/findLicensingTwo?officeId=` +
        param.officeId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 填报一 颁证季报查询
  getnewfindLicensingOne(param) {
    return request
      .get(
        `api-precursor/licensingquarterlyone/findLicensingHoldInfo?officeId=` +
        param.officeId +
        `&year=` +
        param.year +
        `&quarter=` +
        param.quarter
        // year:this.rowdata.year,
        // quarter
      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 填报二 颁证季报保存
  savefindLicensingTwo(param) {
    return request
      .post(`api-precursor/licensingquarterlytwo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 政府端 年报一统计接口
  getfindLicensingOne(param) {
    return request
      .get(
        `api-precursor/licensingquarterlyone/findLicensingOne?licenseType=` +
        param.licenseType +
        `&officeId=` +
        param.officeId +
        `&year=` +
        param.year +
        `&quarter=` +
        param.quarter
      )
      .then(response => response)
      .catch(error => error)
  },
  // 查询当前年度季报列表
  getallList(param) {
    return request
      .get(
        `api-precursor/licensingquarterlyone/findLicense/allList?officeId=` +
        param.officeId +
        `&quarter=` +
        param.quarter +
        `&year=` +
        param.year +
        `&isOwnOffice=` +
        param.isOwnOffice

      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端许可备案管理
  getRecordManagementList(param) {
    let obj = {
      limit: 10,
      page: 1,
      licenseStatus: '',
      licenseType: '',
      corpName: '',
      reqType: '',
      corpOverdue: '',
      isOwnOffice: '',
      licenseChemicalType: ''
    }
    obj = Object.assign(obj, param)
    return request
      .get(
        `api-precursor/corplicenseinfo/licenseList?limit=` +
        obj.limit +
        `&page=` +
        obj.page +
        `&licenseStatus=` +
        obj.licenseStatus +
        `&licenseType=` +
        obj.licenseType +
        `&corpName=` +
        obj.corpName +
        `&reqType=` +
        obj.reqType +
        `&corpOverdue=` +
        obj.corpOverdue +
        `&isOwnOffice=` +
        obj.isOwnOffice +
        `&officeId=` +
        obj.officeId +
        `&licenseChemicalType=` +
        obj.licenseChemicalType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 政府端许可备案注销
  recordLogout(param) {
    return request
      .post(`api-precursor/corplicenseinfo/logOffById`, param)
      .then(response => response)
      .catch(error => error)
  },
  getAnnualreportone(param) {
    return request
      .get(
        `api-precursor/corplicenseinfo?limit=` +
        param.limit +
        `&page=` +
        param.page +
        `&licenseStatus=` +
        param.licenseStatus +
        `&reqType=` +
        param.reqType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 颁证季报汇总表
  getsheetreport1(param) {
    return request
      .get(
        `api-precursor/licensingquarterlytwo/licenseTwoCollect?
        officeId=` +
        param.officeId +
        `&quarter=` +
        param.quarter
      )
      .then(response => response)
      .catch(error => error)
  },
  // 颁证季报汇总表
  getsheetreport(param) {
    return request
      .get(
        `api-precursor/licensingquarterlytwo/licenseTwoCollect?officeId=` +
        param.officeId +
        `&startTime=` +
        param.startTime +
        `&endTime=` +
        param.endTime +
        `&chemicalType=` +
        param.chemicalType
      )
      .then(response => response)
      .catch(error => error)
  },
  // 获取年报汇总表 前两个列表数据
  getYearreportlist(param) {
    return request
      .get(
        `api-precursor/annualReportController/getCheckAreaReportInfo?year=` +
        param.year +
        `&officeId=` +
        param.officeId
      )
      .then(response => response)
      .catch(error => error)
  },
  // 获取年报汇总表第三个列表数据
  getCheckAreaReportCity(param) {
    return request
      .get(
        `api-precursor/annualReportController/getCheckAreaReportCity?year=` +
        param.year +
        `&areaId=` +
        param.areaId
      )
      .then(response => response)
      .catch(error => error)
  },
  loginSso(ticket) {
    return request.get(`/api-sso/geErSsoContr/geErSsoLogin?ticket=` + ticket
    )
      .then(response => response)
      .catch(error => error)
  },
  // new生产经营情况模块列表查看
  newgetYearDeptShenChanInfo(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/getYearDeptShenChanInfoReport`, param)
      .then(response => response)
      .catch(error => error)
  },
  // new生产经营情况模块列表查看 销售
  newgetYearDeptXiaoShaoInfo(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/getYearDeptXiaoShaoInfoReport`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业年报生产经营情况模块列表查看
  getYearDeptShenChanInfo(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/getYearDeptShenChanInfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 企业年报生产经营情况模块列表查看 销售
  getYearDeptXiaoShaoInfo(param) {
    return request
      .post(`api-precursor/prodChemicalFlow/getYearDeptXiaoShaoInfo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 销售流向上报之前的表单接口
  getReportdata(param) {
    return request
      .post(`api-precursor/reportStatisticsYear/statisticsYearSave`, param)
      .then(response => response)
      .catch(error => error)
  },
  // 年度上报历史纪录查看
  getRenderlistOne(param) {
    return request
      .post(`api-precursor/pprodoper/findReptYearDeptXiaoShaoHistory`, param)
      .then(response => response)
      .catch(error => error)
  },
  // api-precursor/annualReportController/selectCorpAnnalsReport
  // http://192.168.110.111:9900/api-precursor/annualReportController/selectCorpAnnalsReport?limit=10&page=1&year=2021&isOwnOffice=1&officeId=1301050000
  selectCorpAnnalsReport(param) {
    return request
      .get(`api-precursor/annualReportController/selectCorpAnnalsReport?page=${param.page}&limit=${param.limit}&officeId=${param.officeId}&year=${param.reportingYear}&isOwnOffice=${param.isOwnOffice}`)
      .then(response => response)
      .catch(error => error)
  },
  // 年度上报
  getRenderlistTwo(param) {
    return request
      .get(`api-precursor/reportStatisticsYear?page=${param.page}&limit=${param.limit}`)
      .then(response => response)
      .catch(error => error)
  },
  // 生产经营统计情况表
  getAllDeptYearReptinfo(param) {
    return request
      .get(`api-precursor/pprodoper/getAllDeptYearReptInfo?reportingOfficeId=${param.reportingOfficeId}&reportingYear=${param.reportingYear}&startTime=${param.startTime}&endTime=${param.endTime}`)
      .then(response => response)
      .catch(error => error)
  },
  // 颁证情况统计导出
  quarterlExport(param) {
    return request
      .get(`api-precursor/licensingquarterlyone/findLicense/allListExport?officeId=${param.officeName}&year=${param.year}&quarter=${param.quarter}`)
      .then(response => response)
      .catch(error => error)
  },
  // 颁证化学品统计导出
  tongjierExport(param) {
    return request
      .get(`api-precursor/licensingquarterlytwo/licenseTwoCollectExport?officeId=${param.officeName}&year=${param.year}`)
      .then(response => response)
      .catch(error => error)
  },
  reportyeartongjiExport(param) {
    return request
      .get(`api-precursor/pprodoper/deptYearReptExport?reportingOfficeId=${param.officeName}&reportingYear=${param.year}`)
      .then(response => response)
      .catch(error => error)
  },
  // 颁证化学品统计点击查看详情
  licenseTwoDetail(param) {
    return request
      .get(`api-precursor/licensingquarterlytwo/licenseTwoDetail?officeId=${param.officeId}&chemicalId=${param.chemicalId}&startTime=${param.startTime}&licenseType=${param.licenseType}&endTime=${param.endTime}`)
      .then(response => response)
      .catch(error => error)
  },
  // 备案材料删除接口
  deleteMaterials(param) {
    return request
      .delete(`api-precursor/pfilingmaterials/deleteMaterials?id=${param.id}&filePath=${param.filePath}`)
      .then(response => response)
      .catch(error => error)
  },
  // 备案申请变更后 材料接口
  // api-precursor/pfilingmaterials/findUpdateMaterials
  // 备案材料 列表查询
  afterchangeRecordlist(param) {
    return request
      .get(
        `api-precursor/pfilingmaterials/findUpdateMaterials?limit=${param.limit}&page=${param.page}&materialsType=${param.materialsType}&licenseType=${param.licenseType}&corpId=${param.corpId}&licenseId=${param.licenseId}&updateType=${param.updateType}`
      )
      .then(response => response)
      .catch(error => error)
  },
  getLicenseNo(param) {
    return request
      .post(`api-precursor/corplicenseinfo/getLicenseNo`, param)
      .then(response => response)
      .catch(error => error)
  },
  // api-precursor/pfilingmaterials/initMaterialsByLicenseId
  // 审批模块提交时须 点击备案材料查看后才能进行提交接口
  // http://192.168.110.112:9900/api-precursor/pfilingmaterials/updateMaterialsByLicenseId/{licenseId}/{id}
  checkLicensedata(param) {
    return request
      .get(`api-precursor/pfilingmaterials/updateMaterialsByLicenseId/${param.licenseId}/${param.id}`)
      .then(response => response)
      .catch(error => error)
  },
}
