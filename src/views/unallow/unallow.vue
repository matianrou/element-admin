<template>
    <div class="container" id="container">
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="企业名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">打印正本</el-button>
        <el-button type="primary">已发证</el-button>
        <el-button type="primary">打印格式设置</el-button>
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
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column label="申请企业" width="240">
        <template slot-scope="scope">{{ scope.row.name }}</template>
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
            >修改</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >注销</el-button
          >
          <el-button type="danger" size="mini" @click="handleEdit(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>
<script>
name: "";
export default {
  data() {
    return {
      form:{
        name:''
      },
      tableData: [{
        name:'测试数据'
    }],
    };
  },
  methods:{
    handleSelectionChange(){},
    handleEdit(){},
    print(){
      // 这个换成相对应的 ref
      var newstr = document.getElementById("container").innerHTML;

      var oldstr = document.body.innerHTML;

      document.body.innerHTML = newstr;

      window.print();

      document.body.innerHTML = oldstr;

      return false;
    }
  }
};
</script>