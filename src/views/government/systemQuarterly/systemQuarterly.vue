<template>
  <div class="contentContainer" style="display: flex">
    <TreeXCombined />
    <el-card style="width: 100%">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        :inline="true"
        ref="ruleForm"
        class="demo-ruleForm"
      >
          <el-form-item prop="date1" label="解除年度">
            <el-date-picker
              type="year"
              placeholder="选择日期"
              v-model="ruleForm.date1"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="date2" label="第">
            <el-select v-model="ruleForm.region" placeholder="请选择季度">
              <el-option label="一" value="1"></el-option>
              <el-option label="二" value="2"></el-option>
              <el-option label="三" value="3"></el-option>
              <el-option label="四" value="4"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="特殊资源" prop="resource" style="display:block">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="解除省级"></el-radio>
            <el-radio label="解除市级"></el-radio>
            <el-radio label="解除直辖市区县级"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定提交</el-button>
        <!-- <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        <!-- </el-form-item> -->
      </el-form>
    </el-card>
  </div>
</template>
<script>
import TreeXCombined from '../current/treeXCombined'
export default {
  components: {
    TreeXCombined
  },
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        // name: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        
      }
    }
  }
}
</script>
<style scoped lang="scss">
h1 {
  text-align: center;
  margin-bottom: 10px;
}
.ScoreShows {
  margin: auto;
  //   padding: 20px 150px 0 150px;
  .el-input {
    margin: 0 7px 10px 7px;
  }
}
</style>