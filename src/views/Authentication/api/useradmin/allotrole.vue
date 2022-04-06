<template>
  <div>
    <el-dialog
      :visible.sync="DialogTip"
      ref="multipleTable"
      width="50%"
      height="30%"
      title="角色菜单分配"
      :close-on-click-modal="false"
    >
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px; height: 500px; overflow: auto"
        @selection-change="selectionLineChangeHandle"
        row-key="id"
        border
        :default-expand-all="false"
        :tree-props="{ children: 'subMenus' }"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name" label="菜单名称" sortable width="230">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
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
  name: 'allotrole',
  props: {
    powerTipShow: Boolean,
    datalist: ''
  },
  data() {
    return {
      DialogTip: false,
      tableData: [],
      dataonLineListSelections: []
    }
  },
  watch: {
    powerTipShow(val) {
      this.DialogTip = true
    },
    deep: true
  },
  methods: {
    rest() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
        this.form.id = ''
      }
    },
    getFindAlls() {
      service.getFindAlls().then((res) => {
        if (res.status == '200') {
          const data = res.data.data
          this.tableData = data
        }
      })
    },
    selectionLineChangeHandle(val) {
      this.dataonLineListSelections = val
    },
    onSubmit() {
      console.log(this.dataonLineListSelections)
      for (var i = 0; i < this.dataonLineListSelections.length; i++) {
        console.log('id:' + this.dataonLineListSelections[i].id)
      }
      this.dataonLineListSelections
      const param = {
        createTime: '',
        css: '',
        hidden: 0,
        id: this.datalist.id,
        menuIds: [],
        name: '',
        parentId: 0,
        path: '',
        pathMethod: '',
        roleId: this.datalist.id,
        sort: 0,
        subMenus: this.dataonLineListSelections,
        type: 1,
        updateTime: '',
        url: ''
      }
      service.addrole(param).then((res) => {
        if (res.status == 200) {
          this.$message({
            type: 'success',
            message: '权限分配成功'
          })
        }
      })
    }
  },
  created() {},
  mounted() {
    this.getFindAlls()
  }
}
</script>
<style scoped lang="less">
.button {
  position: relative;
  left: 45%;
}
</style>