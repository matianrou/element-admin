<template>
    <div class="container">
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="企业名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">打印正本1</el-button>
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
    <!-- <el-table-column
      type="selection"
      width="55">
    </el-table-column> -->
      <el-table-column prop="name" label="申请类型">
      </el-table-column>
      <el-table-column prop="name" label="申请时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="当前办理状态" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="办理时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="备注" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="申请信息">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Acceptcheck :applydialog="applydialog"></Acceptcheck>
    </div>
</template>
<script>
import Acceptcheck from "./acceptcheck.vue"
name: "";
export default {
    components: {
    Acceptcheck,
  },
  data() {
    return {
        applydialog:false,
      tableData: [{
        name:'测试数据'
    }],
    };
  },
  methods:{
      handleEdit(){
          this.applydialog = !this.applydialog;
      },
      print(){
      var newstr = document.getElementsByClassName("container").innerHTML;

      var oldstr = document.body.innerHTML;

      document.body.innerHTML = newstr;

      window.print();

      document.body.innerHTML = oldstr;

      return false;
    }
  }
};
</script>