<template>
  <div class="g-filter-container">
    <el-form
      inline
      label-suffix=":"
      size="mini"
      @submit.native.prevent
    >
      <el-form-item label="姓名">
        <el-input
          v-model="filterForm.name"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="filterForm.gender"
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
      <el-form-item label="入职日期">
        <el-date-picker
          v-model="entryDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="handleEntryDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          :loading="filterLoading"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="handleCreate"
        >
          添加员工
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'

export default {
  name: 'MenuBar',
  props: {
    filterLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterForm: {
        name: '',
        gender: null,
        begin: null,
        end: null
      },
      entryDate: null,
      genderOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    }
  },
  methods: {
    // 搜索
    handleFilter: debounce(500, true, function() {
      this.$emit('filter', this.filterForm)
    }),
    // 创建
    handleCreate() {
      this.$emit('create')
    },
    // 处理入职日期数据
    handleEntryDate() {
      this.filterForm.begin = this.entryDate ? this.entryDate[0] : null
      this.filterForm.end = this.entryDate ? this.entryDate[1] : null
    },
    // 处理批量删除
    handleDelete() {
      this.$emit('delete')
    }
  }
}
</script>
