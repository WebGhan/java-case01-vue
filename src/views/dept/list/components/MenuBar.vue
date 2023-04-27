<template>
  <div class="g-filter-container">
    <el-form inline label-suffix=":" size="mini" @submit.native.prevent>
      <el-form-item label="名称">
        <el-input v-model="filterForm.name" clearable @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" :loading="filterLoading" @click="handleFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="primary" @click="handleCreate">添加部门</el-button>
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
        name: ''
      }
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
    }
  }
}
</script>
