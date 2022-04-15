import Layout from '@/layout'

export default {
  path: '/structure', // 路由地址
  name: 'departments', // 路由名字
  component: Layout,
  children: [{
    path: '', // 默认子路由
    name: 'departments',
    component: () => import ('@/views/structure'),
    meta: {
      title: '组织架构', // 左侧导航读取了title属性
      icon: 'tree'
    }

  }]
}
