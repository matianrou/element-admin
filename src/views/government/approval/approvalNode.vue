<template>
  <div>
    <el-steps direction="vertical" :space="200" :active="1" style="color:#000">
      <el-step
        v-for="(item, index) in activities"
        :key="index"
        :title="item.taskNodeName"
        style="color:#000"
      >
        <template slot="description" style="color:#000">
          <div class="font-child-style" style="color:#000">
            <p class="flow-data-text">{{item.taskNodeName.substring(0,2)}}时间：{{ item.createdDate }}</p>
            <p class="flow-data-text">{{item.taskNodeName.substring(0,2)}}人：{{ item.createName }}</p>
            <p class="flow-data-text">
              {{item.taskNodeName.substring(0,2)}}结果：{{
              item.audit === '0'
              ? '同意'
              : item.audit === '1'
              ? '不同意'
              : '退回'
              }}
            </p>
            <p class="flow-data-text">{{item.taskNodeName.substring(0,2)}}意见：{{ item.annotation }}</p>
          </div>
        </template>
      </el-step>
    </el-steps>
    <div v-show="!activities.length" class="flow-data-none-mask">
      <span>暂无审批记录</span>
    </div>
  </div>
</template>
<script>
import service from '@/views/Authentication/api/service.js'

export default {
  props: {
    businessKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activities: [],
      ifType: JSON.parse(this.$store.state.getUserMsg).datas.type //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
    }
  },
  methods: {
    getFlowNode() {
      const params = {
        id: this.businessKey
      }
      service.getGmLicenseRecordAuditNode(params).then(response => {
        if (response.status === 200) {
          this.$nextTick(() => {
            if (this.ifType == 1) {
              this.activities = [
                response.data.datas[response.data.datas.length - 1]
              ]
            } else {
              this.activities = response.data.datas
            }
            // this.activities = [response.data.datas[response.data.datas.length-1]]
          })
        } else {
          this.$message.error('流程节点获取失败!')
        }
      })
    }
  },
  created() {
    this.getFlowNode()
  }
}
</script>
<style lang="scss" scoped>
.el-steps {
  div {
    color: #000;
  }
  .el-step__title.is-finish {
    color: #000 !important;
  }
}
/deep/.el-step__title {
  font-size: 22px;
  font-weight: 700;
}
.font-child-style {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 400;
}
.flow-data-none-mask {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  height: 100px;
  span {
    color: #909399;
  }
}
.flow-data-text {
  line-height: 28px;
}
</style>
<style lang="scss">
.el-steps {
  color: #000 !important;
}
.is-finish {
  color: #000 !important;
  border-color: #000 !important;
}
.is-wait {
  color: #000 !important;
}
</style>
