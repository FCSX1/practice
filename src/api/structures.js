import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}

// 删除组织架构的部门
export function deleteDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

// 获取某个部门的详情
export function gainDepartment(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 保存编辑的数据
export function updateDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

