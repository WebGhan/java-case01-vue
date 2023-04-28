import request from '@/utils/request'

// 获取 列表
export function fetchList(params) {
  return request({
    url: '/emps',
    method: 'GET',
    params
  })
}

// 获取 项
export function fetchItem(id) {
  return request({
    url: `/emps/${id}`,
    method: 'GET'
  })
}

// 创建 项
export function createItem(data) {
  return request({
    url: '/emps',
    method: 'POST',
    data
  })
}

// 更新 项
export function updateItem(data) {
  return request({
    url: `/emps`,
    method: 'PUT',
    data
  })
}

// 删除 项
export function deleteItem(id) {
  return request({
    url: `/emps/${id}`,
    method: 'DELETE'
  })
}
