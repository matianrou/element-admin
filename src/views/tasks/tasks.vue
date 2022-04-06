<template>
  <div class="container">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="企业名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="申请企业" width="240">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="申请类型">
      </el-table-column>
      <el-table-column prop="name" label="办理结果" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="办理时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="办理进度">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
name: "tasks";
export default {
  data() {
    return {
      tableData: [],
    };
  },
};
</script>
