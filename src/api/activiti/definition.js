import request from '@/utils/request'

// 查询modeler列表
export function listDefinition(query) {
  return request({
    url: '/api-precursor/processDefinition/list',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getDefinitionsByInstanceId(instanceId) {
  return request({
    url: '/api-precursor/processDefinition/getDefinitions/' + instanceId,
    method: 'get',

  })
}

// 查询流程进度
export function getDefinitionsImgByInstanceId(query) {
  return request({
    url: '/api-precursor/activitiHistory/image',
    method: 'get',
    params: query
  })
}

// 挂起激活转换
export function suspendOrActiveApply(data) {
  return request({
    url: '/api-precursor/processDefinition/suspendOrActiveApply',
    method: 'post',
    data:data
  })
}


// 删除Modeler
export function delDefinition(id) {
  return request({
    url: '/api-precursor/processDefinition/remove/' + id,
    method: 'delete'
  })
}

// 查询节点人员列表列表
export function listNode() {
  return request({
    url: '/api-user/users/bpmn/node',
    method: 'get'
  })
}

// 上传部署流程
export function deployProcess(data) {
  return request({
    url: '/api-precursor/processDefinition/deployProcess',
    method: 'post',
    data:data
  })
}

// 保存定义流程
export function processSave(data) {
  return request({
    url: '/api-precursor/processRecord',
    method: 'post',
    data:data
  })
}

// 查询流程记录
export function listProcess(query) {
  return request({
    url: '/api-precursor/processRecord',
    method: 'get',
    params: query
  })
}

// 发布定义流程
export function deployDefinition(id) {
  return request({
    url: '/api-precursor/processRecord/' + id + '/deploy',
    method: 'get'
  })
}

// 获取设计流程
export function getProcessRecord(id) {
  return request({
    url: '/api-precursor/processRecord/' + id,
    method: 'get'
  })
}

// 获取流程定义XML
export function getProcessDefineXML(query) {
  return request({
    url: '/api-precursor/processDefinition/getDefinitionXML',
    method: 'get',
    params: query
  })
}

