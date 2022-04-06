<template>
  <div class="container">
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="许可备案申请类型">
        <el-select v-model="form.name" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="applytype">许可备案申请表</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="申请单位" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.truename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >办理</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <RecordApply
      :applydialog="applydialog"
      @applydialog_c="applydialog_c"
    ></RecordApply>
  </div>
</template>
<script>
import RecordApply from "./recordApply.vue";
name: "license";
export default {
  components: {
    RecordApply,
  },
  data() {
    return {
      applydialog: false,
      form: {
        name: "",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "测试数据",
          truename: "测试数据",
          phone: "测试数据",
          email: "测试数据",
          area: "北京市",
          commpany: " XXXXXX部门 ",
          role: "超级管理员",
          audit: "未审核",
        },
      ],
    };
  },
  methods: {
    applytype() {
      this.applydialog = !this.applydialog;
    },
    applydialog_c() {},
    handleEdit(){
      
    }
  },
};
</script>
<style lang="less" scoped>
</style>