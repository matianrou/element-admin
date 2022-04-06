<template>
  <div class="container">
    <el-card>
      <h1>下属市（地区、自治州）上报颁证季报进度情况评分规则</h1>

      <el-alert
        title="评分规则:"
        type="error"
        size="30"
        description="评分=上报率*70+填报时间得分+本级安监机构上报得分"
      >
      </el-alert>
      <el-form ref="form" :model="sizeForm" :inline="true" class="ScoreShows">
        其中在下一季度第一个月得第<el-input
        ></el-input>
        天之前完成的，属按时完成，填报时间得分计满15分，滞后1至<el-input
        ></el-input> 天的,每滞后1天，扣<el-input
        ></el-input> 分，滞后超过<el-input
        ></el-input> 天的，一次性倒扣5分；<br />
        本级安监机构已经上报的，本级安监机构上报得分计满分15分，否则0分。<br>
        <el-button type="primary" style="margin:auto">提交</el-button>
      </el-form>
      
    </el-card>
  </div>
</template>
<script>
export default {
    components:{
    },
    data(){
        return{}
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