<template>
  <el-dialog
    title
    :close-on-click-modal="false"
    :visible.sync="dialogshow"
    width="50%"
    height="50%"
    @close="dialogfalse"
  >
    <el-table :data="tableData" border show-summary style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="chemicalName" label="品种名称" align="center"></el-table-column>
      <el-table-column prop="chemicalTypeValue" label="品种类别" align="center"></el-table-column>
      <el-table-column prop="licenseTypeValue" label="生产/经营" align="center"></el-table-column>
      <el-table-column prop="officeName" label="监管机构" align="center"></el-table-column>
      <el-table-column prop="corpName" label="企业名称" align="center"></el-table-column>
      <el-table-column prop="output" label="颁证载明量" align="center"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import service from '../../Authentication/api/service'
export default {
  props: {
    rowdata: ''
  },
  data() {
    return {
      dialogshow: true,
      tableData: []
    }
  },
  methods: {
    dialogfalse() {
      this.$parent.contentdialog = false
    },
    licenseTwoDetail() {
      const param = {
        officeId: this.rowdata.newofficeId || '',
        // officeId: '1301050000',
        chemicalId: this.rowdata.chemicalId || '',
        // chemicalId: '22',
        startTime: this.rowdata.startTime || '',
        endTime: this.rowdata.endTime || '',
        licenseType: this.rowdata.licenseType || ''
        // licenseType: '1'
      }
      service.licenseTwoDetail(param).then(res => {
        if (res && res.data?.datas) {
          this.tableData = res.data.datas;
        }
      })
    }
  },
  mounted() {},
  created() {
    this.licenseTwoDetail()
  }
}
</script>
<style lang="scss" scoped>
</style>
