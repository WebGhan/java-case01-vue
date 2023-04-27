import request from '@/utils/request'

// 获取 部门列表
export function fetchList(params) {
  return request({
    url: '/depts',
    method: 'GET',
    params
  })
}
