<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    total: ''
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$parent.getRenderlist(val)
    },
    handleCurrentChange(val) {
      this.$parent.getRenderlist(val)

      
    }
  }
}
</script>
<style lang="scss">
.el-pagination {
  float: right;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>