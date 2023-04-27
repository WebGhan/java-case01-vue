import request from '@/utils/request'

// 获取 部门列表
export function fetchList(params) {
  return request({
    url: '/depts',
    method: 'GET',
    params
  })
}

// 获取 单个部门
export function fetchItem(id) {
  return request({
    url: `/depts/${id}`,
    method: 'GET'
  })
}

// 删除 部门
export function deleteItem(id) {
  return request({
    url: `/depts/${id}`,
    method: 'DELETE'
  })
}

// 新增 部门
export function createItem(data) {
  return request({
    url: '/depts',
    method: 'POST',
    data
  })
}

// 修改 部门
export function updateItem(data) {
  return request({
    url: '/depts',
    method: 'PUT',
    data
  })
}
