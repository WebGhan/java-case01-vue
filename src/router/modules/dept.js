import Layout from '@/layout'

const DeptRouter = {
  name: 'Dept',
  path: '/dept',
  redirect: '/dept/list',
  component: Layout,
  meta: {
    title: '部门管理',
    icon: 'el-icon-user'
  },
  children: [
    {
      path: 'list',
      name: 'DeptList',
      component: () => import('@/views/dept/list'),
      meta: { title: '部门列表', keepAlive: true }
    }
  ]
}

export default DeptRouter
