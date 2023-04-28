import Layout from '@/layout'

const EmpRouter = {
  name: 'Emp',
  path: '/emp',
  redirect: '/emp/list',
  component: Layout,
  meta: {
    title: '员工管理',
    icon: 'el-icon-user'
  },
  children: [
    {
      path: 'list',
      name: 'EmpList',
      component: () => import('@/views/emp/list'),
      meta: { title: '员工列表', keepAlive: true }
    }
  ]
}

export default EmpRouter
