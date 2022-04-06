<!-- 扫描二维码 展示企业信息 h5 -->
<template>
  <div class="">
    <div class="company-information-header">
      <span>非药品类易制毒化学品综合管理信息系统</span>
    </div>
    <div class="company-information">
      <div class="company-baseinfo">
        <!-- 企业基本信息 -->
        <div class="basefield" style="padding: 0 20px;">
          <span class="field">许可证编号：</span><span>{{baseInfo.creditCode || '无'}}</span>
        </div>
        <div class="basefield basetitle">
          <span style="font-size: 22px; color: rgb(229, 131, 8);">{{ baseInfo.corpName || '无' }}</span>
        </div>
        <div style="padding: 0 20px;">
          <div class="basefield" style="margin-top: 10px;">
            <span class="field">类型：</span><span>{{baseInfo.licenseTypeName || '无'}}</span>
          </div>
          <div class="basefield">
            <span class="field">发证机构：</span><span>{{baseInfo.officeName || '无'}}</span>
          </div>
          <div class="basefield">
            <span class="field">发证日期：</span><span>{{baseInfo.issueTime || '无'}}</span>
          </div>
          <div class="basefield">
            <span class="field">有效期：</span><span>{{baseInfo.licenseExpire || '无'}}</span>
          </div>
          <div class="basefield">
            <span class="field">网上公布日期：</span><span>{{baseInfo.onlineAnnounceTime || '无'}}</span>
          </div>
        </div>
      </div>
      <div class="production-management-info">
        <!-- 生产经营情况 -->
        <div class="info-title">
          <div class="title-icon"></div><span>生产经营许可备案信息</span>
        </div>
        <div>
          <el-table
            :data="baseInfo.corpProdOperList"
            border
            stripe>
            <el-table-column
              prop="chemicalName"
              label="品种名称"
              min-width="80"
              header-align="center"
              align="center">
            </el-table-column>
            <el-table-column
              label="载明产量"
              width="80"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                <span>{{ `${scope.row.output}${scope.row.unit}` }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="主要流向"
              min-width="100"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                <div>
                  <div
                  class="rowzidingyi"
                    v-for="(item, index) in scope.row.chemicalMainFlowList"
                    :key="index">
                    <span>{{ item.area }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from  './api/service'
export default {
  components: {
  },
  data() {
    return {
      baseInfo: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init () {
      // 初始化
      if (this.$route.params && this.$route.params.id) {
        // 调用接口获取企业信息数据
        service.changeProductionInfo({id: this.$route.params.id}).then(res => {
          if (rres && es.status === 200) {
            console.log('datas', res)
            // 处理类型字段：
            res.data.datas.licenseTypeName = res.data.datas.licenseType === '1' ? '第一类' : '第二类'
            // 处理有效期字段：
            res.data.datas.licenseExpire = `${res.data.datas.licenseExpireBegin || '无'}-${res.data.datas.licenseExpireEnd || '无'}`
            this.baseInfo = res.data.datas
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.company-information-header {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 3px;
}
.company-information {
  height: calc(100vh - 30px);
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: url('~@/assets/h5/3.jpeg') no-repeat;
  background-size: 100% 100%;
  opacity: 1;
  font-family: 'KaiTi';
  .company-baseinfo {
    width: 100%;
    .basefield {
      width: 100%;
      margin-top: 20px;
      span {
        font-size: 20px;
        color: #fff;
      }
      .field {
        font-size: 18px;
        color: rgb(255, 245, 247);
      }
    }
    .basetitle {
      text-align: center;
      margin-top: 10px;
      font-weight: bold;
      background: #fff;
      opacity: 0.9;
      font-family: 'fangsong';
      padding: 10px
    }
  }
  .production-management-info {
    margin-top: 20px;
    .info-title {
      height: 25px;
      background: #fff;
      opacity: 0.9;
      padding: 0 20px;
      color: rgb(229, 131, 8);
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      .title-icon {
        height: 16px;
        width: 3px;
        background: #409EFF;
        margin-right: 5px;
      }
    }
  }
}
</style>
<style>
.rowzidingyi {
  width: 100%;
  height: 70px !important;
  border-bottom: 1px solid #ebeef5;
  padding: 18px 0 0 0;
}
</style>
