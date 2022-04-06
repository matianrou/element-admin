<template>
  <div class="contentContainer" style="display: flex">
    <TreeXCombined />
    <el-card style="width: 100%">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[1, 2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
        >
        </el-tree>
        <el-button type="primary" @click="submitForm('ruleForm')"
            >保存</el-button
          >
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
        pass: '',
        checkPass: '',
        age: ''
      },
      data: [
        {
          id: 1,
          label: '生产',
          children: [
            {
              id: 4,
              label: '第一类'
            },
            {
              id: 4,
              label: '第二类'
            },
            {
              id: 4,
              label: '第三类'
            }
          ]
        },
        {
          id: 2,
          label: '经营',
          children: [
            {
              id: 4,
              label: '第一类'
            },
            {
              id: 4,
              label: '第二类'
            },
            {
              id: 4,
              label: '第三类'
            }
          ]
        }
      ]
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