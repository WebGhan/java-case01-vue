<template>
  <div class="g-app-container-flex">
    <!-- 菜单栏 -->
    <MenuBar class="menu-bar" :filter-loading="listLoading" @filter="handleFilter" @create="showEditor(false)" />

    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      size="medium"
      height="auto"
      style="width: 100%;"
      border
    >
      <el-table-column label="ID" prop="id" width="100" />
      <el-table-column label="名称" prop="name" width="200" />
      <el-table-column label="创建时间" prop="createTime" width="180" />
      <el-table-column label="更新时间" prop="updateTime" width="180" />

      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEditor(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" :loading="deleteLoading === scope.row.id" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 -->
    <Editor ref="editor" @change="getList" />
  </div>
</template>

<script>
import { fetchList, deleteItem } from '@/api/dept/list'
import { Editor, MenuBar } from './components'

export default {
  name: 'DeptList',
  components: {
    Editor,
    MenuBar
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        title: ''
      },
      deleteLoading: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 显示编辑
    showEditor(item) {
      this.$refs['editor'].open(item)
    },
    // 获取列表
    async getList() {
      this.listLoading = true
      try {
        const res = await fetchList()
        this.list = res.data
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
      }
    },
    // 修改分页
    pageChange() {
      this.getList()
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    // 处理筛选
    handleFilter(filterForm) {
      this.listQuery = { ...this.listQuery, ...filterForm }
      this.getList()
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    // 处理删除
    async handleDelete(id) {
      if (this.deleteLoading) { return }
      this.deleteLoading = id
      try {
        const confirm = await this.$confirm(
          '确定要删除吗?',
          '提示',
          { type: 'warning' }
        )
        if (confirm !== 'confirm') { return }
        await deleteItem(id)
        this.getList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      } finally {
        this.deleteLoading = 0
      }
    }
  }
}
</script>
