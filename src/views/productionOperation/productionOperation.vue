<template>
  <div class="container">
    <el-card>
      <ul class="tabledata">
        <li class="title">
          <span>品名</span>
          <span>购入量</span>
          <span>总销售量</span>
          <span>库存量</span>
          <span>主要流向</span>
          <span>销售量</span>
          <span>状态</span>
          <span>操作</span>
        </li>
        <li v-for="(item, index) in tableData" :key="index">
          <div class="dataname" :style="{lineHeight:40*item.children.length + 'px'}">{{ item.typename }}</div>
          <div class="dataname" :style="{lineHeight:40*item.children.length + 'px'}">{{ item.purchase }}</div>
          <div class="dataname" :style="{lineHeight:40*item.children.length + 'px'}">{{ item.purchase }}</div>
          <div class="dataname" :style="{lineHeight:40*item.children.length + 'px'}">{{ item.purchase }}</div>
          <div class="contentbd">
            <span v-for="(clditem, index) in item.children" :key="index">
              {{ clditem.flow }}
            </span>
          </div>
          <div :key="index"  class="contentbd">
              <span v-for="(clditem, index) in item.children" :key="index">
              {{ clditem.purchase }}
            </span>
          </div>
          <div class="dataname" :style="{lineHeight:40*item.children.length + 'px'}">{{ item.report }}</div>
          <div class="dataname" :style="{lineHeight:40*item.children.length + 'px'}">
              <el-button>编辑</el-button>
              <el-button>删除</el-button>
          </div>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          type: '第一类', // 类型
          typename: '甲苯', // 品名
          report: '已上报', // 品名
          purchase: '110', // 品名
          children: [
            {
              flow: '河南1', // 流向
              purchase: '30吨', //购入量
            },{
              flow: '河南2', // 流向
              purchase: '40吨', //购入量
            },{
              flow: '河南3', // 流向
              purchase: '50吨', //购入量
            }
          ]
        }
      ],
      list: [{}, {}]
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.tabledata {
  width: 100%;
  height: 500px;
  border: 1px solid #EBEEF5;
  .dataname {
    border-right: 1px solid #EBEEF5;
    height: 100%;
  }
  .contentbd{
    span{
      border-bottom: 1px solid #EBEEF5;
    }
  }
  li {
    width: 100%;
    text-align: center;
    line-height: 40px;
    display: flex;
    border-bottom: 1px solid #EBEEF5;
    align-items: center;
    div {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
      float: left;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-right: 1px solid #EBEEF5;
        border-top: none;
      }
    }
  }
}
.title {
  display: flex;
  span {
    display: inline-block;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #EBEEF5;
  }
}
</style>