import Layout from '@/layout'

const FileRouter = {
  name: 'File',
  path: '/file',
  redirect: '/file/upload',
  component: Layout,
  meta: {
    title: '文件管理',
    icon: 'el-icon-folder-opened'
  },
  children: [
    {
      path: 'upload',
      name: 'FileUpload',
      component: () => import('@/views/file/upload'),
      meta: { title: '上传', keepAlive: true }
    }
  ]
}

export default FileRouter
