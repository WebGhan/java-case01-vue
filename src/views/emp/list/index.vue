<template>
  <div class="g-app-container-flex">
    <!-- 菜单栏 -->
    <MenuBar
      :filter-loading="listLoading"
      @filter="handleFilter"
      @create="openEditor(false)"
      @delete="handleBatchDelete"
    />

    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      size="medium"
      height="auto"
      style="width: 100%;"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="名称" prop="name" width="200" />
      <el-table-column label="性别" prop="gender" width="100">
        <template slot-scope="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="照片" prop="image" width="100">
        <template slot-scope="scope">
          <el-avatar shape="square" size="medium" :src="scope.row.image" />
        </template>
      </el-table-column>
      <el-table-column label="入职日期" prop="entrydate" width="120" />
      <el-table-column label="部门" prop="deptId" width="120" />
      <el-table-column label="创建时间" prop="createTime" width="180" />
      <el-table-column label="更新时间" prop="updateTime" width="180" />

      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="openEditor(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            :loading="deleteLoading === scope.row.id"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列表分页 -->
    <Pagination
      :total="listTotal"
      :page-size.sync="listQuery.pageSize"
      :current-page.sync="listQuery.page"
      @change="pageChange"
    />

    <!-- 编辑 -->
    <Editor
      ref="Editor"
      @change="getList"
    />
  </div>
</template>

<script>
import { fetchList, deleteItem } from '@/api/emp/list'
import { Editor, MenuBar } from './components'
import { Pagination } from '@/components'

export default {
  name: 'EmpList',
  components: {
    Editor,
    MenuBar,
    Pagination
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      deleteLoading: 0,
      selected: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 打开编辑
    openEditor(item) {
      this.$refs['Editor'].open(item)
    },
    // 获取列表
    async getList() {
      this.listLoading = true
      try {
        const res = await fetchList(this.listQuery)
        this.list = res.data.rows
        this.listTotal = res.data.total
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
      this.listQuery.page = 1
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
    },
    // 处理批量删除
    handleBatchDelete() {
      const ids = this.selected.join(',')
      this.handleDelete(ids)
    },
    // 处理列表选择
    handleSelectionChange(e) {
      this.selected = e.map(i => i.id)
    }
  }
}
</script>
