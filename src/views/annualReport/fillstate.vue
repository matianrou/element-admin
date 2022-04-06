<template>
  <div class="">
    <el-dialog
      title="企业填报状态"
      :visible.sync="DialogTip"
      width="50%"
      height="100%"
      :close-on-click-modal="false">
       <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="企业名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="年度"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="省级">
      </el-table-column>
      <el-table-column
        prop="name"
        label="市级">
      </el-table-column>
      <el-table-column
        prop="name"
        label="直辖市区县级">
      </el-table-column>
    </el-table>
    </el-dialog>
  </div>
</template>
<script >
// import { defineComponent } from '@vue/composition-api'
export default {
  props: {
    Fillstatedialog: Boolean,
  },
  data() {
    return{
      DialogTip:false,
      tableData: [{
            name: '测试数据',
            address: '上海市普陀区金沙江路 1518 弄'
          }]
    }
  },
  watch: {
    Fillstatedialog(val) {
      this.DialogTip = true;
    },
    deep: true,
  },
  methods: {
    onSubmit() {},
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
};
</script>
<style lang="less" scoped>
</style>
