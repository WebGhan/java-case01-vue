<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="type === 'create' ? '创建' : '编辑'"
    width="700px"
    @close="resetForm"
  >
    <!-- 表单 -->
    <el-form
      ref="form"
      v-loading="itemLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      size="medium"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="员工姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="formData.gender"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="员工照片" prop="iamge">
        <AvatarUpload v-model="formData.image" />
      </el-form-item>
      <el-form-item label="入职日期" prop="entrydate">
        <el-date-picker
          v-model="formData.entrydate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-select
          v-model="formData.deptId"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in dept"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- footer -->
    <div slot="footer">
      <el-button
        size="medium"
        @click="visible = false"
      >
        取 消
      </el-button>
      <template v-if="type === 'create'">
        <el-button
          size="medium"
          type="primary"
          :loading="submitLoading"
          @click="submitForm"
        >
          创 建
        </el-button>
      </template>
      <template v-if="type === 'update'">
        <el-button
          size="medium"
          type="primary"
          :loading="submitLoading"
          @click="submitForm"
        >
          保 存
        </el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { fetchItem, createItem, updateItem } from '@/api/emp/list'
import { fetchList as fetchDeptList } from '@/api/dept/list'
import { AvatarUpload } from '@/components'

export default {
  name: 'Editor',
  components: {
    AvatarUpload
  },
  data() {
    return {
      visible: false,
      type: 'create', // create 创建， update 编辑
      formData: this.defaultForm(),
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        entrydate: [
          { required: true, message: '请选择入职时间', trigger: 'change' }
        ]
      },
      submitLoading: false,
      itemData: null,
      itemLoading: false,
      genderOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      dept: []
    }
  },
  mounted() {
    this.getDeptList()
  },
  methods: {
    // 默认表单
    defaultForm() {
      return {
        id: null,
        username: '',
        name: '',
        gender: null,
        image: '',
        entrydate: '',
        deptId: null
      }
    },
    // 重置表单
    resetForm() {
      this.formData = this.defaultForm()
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 显示弹窗
    async open(item) {
      this.visible = true
      if (item) {
        this.type = 'update'
        await this.getItem(item.id)
        const formData = {}
        for (const key in this.formData) {
          if (this.itemData[key] !== undefined) {
            formData[key] = this.itemData[key]
          }
        }
        this.formData = { ...this.formData, ...formData }
      } else {
        this.type = 'create'
      }
    },
    // 获取单个详情
    async getItem(id) {
      this.itemLoading = true
      try {
        const res = await fetchItem(id)
        this.itemData = res.data
      } catch (error) {
        console.log(error)
      } finally {
        this.itemLoading = false
      }
    },
    // 获取部门列表
    async getDeptList() {
      try {
        const res = await fetchDeptList()
        this.dept = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 提交表单
    submitForm() {
      if (this.submitLoading) { return }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.handleCreate()
          } else {
            this.handleUpdate()
          }
        }
      })
    },
    // 创建
    async handleCreate() {
      this.submitLoading = true
      try {
        await createItem(this.formData)
        this.visible = false
        this.$emit('change')
        this.$message.success('创建成功')
      } catch (error) {
        console.log(error)
      } finally {
        this.submitLoading = false
      }
    },
    // 更新
    async handleUpdate() {
      this.submitLoading = true
      try {
        await updateItem(this.formData)
        this.visible = false
        this.$emit('change')
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>
