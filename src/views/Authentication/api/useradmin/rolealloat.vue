<template>
  <div>
    <el-dialog
      :visible.sync="DialogTip"
      ref="multipleTable"
      width="50%"
      height="30%"
      title="角色权限分配"
      :close-on-click-modal="false"
    >
      <el-table
        :data="tableData"
        @selection-change="selectionLineChangeHandle"
        :default-expand-all="false"
        :tree-props="{ children: 'subMenus' }"
        row-key="id"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.createTime.substring(0, 10)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.updateTime.substring(0, 10)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色编码" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        class="button"
        style="margin: auto"
        @click="onSubmit()"
        >保存</el-button
      >
    </el-dialog>
  </div>
</template>
<script>
import service from '../service'
export default {
  name: 'rolealloat',
  props: {
    RolealloatShow: Boolean,
    rowdata: ''
  },
  data() {
    return {
      DialogTip: false,
      tableData: [],
      dataonLineListSelections: [],
      roleid: []
    }
  },
  watch: {
    RolealloatShow(val) {
      this.DialogTip = true
    },
    deep: true
  },
  methods: {
    getRoleInfo() {
      const param = {
        limit: 10000,
        page: 1
      }
      service.getRoleInfo(param).then(res => {
        if (res && res.status == '200') {
          const data = res.data.datas
          this.tableData = data
        }
      })
    },
    onSubmit() {
      this.roleid = []
      console.log(this.dataonLineListSelections)
      for (var i = 0; i < this.dataonLineListSelections.length; i++) {
        this.roleid.push(this.dataonLineListSelections[i].id)
      }
      const param = this.roleid
      service.rolealloat(param, this.rowdata.id).then(res => {
        if (res && res.status == 200) {
          this.$message({
            type: 'success',
            message: '权限分配成功'
          })
        }
      })
    },
    selectionLineChangeHandle(val) {
      this.dataonLineListSelections = val
    }
  },
  created() {},
  mounted() {
    this.getRoleInfo()
  }
}
</script>
<style scoped lang="less">
.button {
  position: relative;
  left: 45%;
}
</style>
