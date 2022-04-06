<!-- 扫描二维码 展示证照信息 h5 -->
<template>
  <div class="license">
    <!-- 左侧信息 -->
    <div class="license-border-3" :style="borderStyle.borderStyle3">
      <div class="license-border-1" :style="borderStyle.borderStyle1">
        <div class="license-left">
          <div class="license-title">
            <img src="@/assets/h5/guohui.png" />
            <span>非药品类易制毒化学品</span>
            <span>{{ licenseTypeName + licenseChemicalTypeName }}</span>
          </div>
          <div v-if="baseInfo.licenseChemicalType !== '1'" class="license-field">
            <!-- 备案证明时编号展示位置 -->
            <div class="license-field-left">
              <span>编号</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.licenseNo || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div class="license-field-left">
              <span>单位名称</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.corpName || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div class="license-field-left">
              <span>经济类型</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.economicTypeLabel || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div>
              <span>主要负责人</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.corpChargePerson || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div class="license-field-left">
              <span>单位地址</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.corpAddress || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div class="license-field-left">
              <span>有效期</span>
            </div>
            <div class="license-field-right">
              <span>{{ baseInfo.licenseExpireBegin || '空' }}</span>
              至
              <span>{{ baseInfo.licenseExpireEnd || '空' }}</span>
            </div>
          </div>
        </div>
        <!-- 右侧信息 -->
        <div class="license-right">
          <div v-if="baseInfo.licenseChemicalType === '1'" class="license-field">
            <!-- 许可证时编号展示位置 -->
            <div class="license-field-left">
              <span style="font-size: 14px;">编号</span>
            </div>
            <div class="license-field-right">
              <span style="font-size: 14px;">{{baseInfo.licenseNo || '空'}}</span>
            </div>
          </div>
          <div class="license-field" style="margin-top: 0px;">
            <div>
              <span style="font-size: 14px;">统一社会信用代码</span>
            </div>
            <div class="license-field-right">
              <span style="font-size: 14px;">{{baseInfo.creditCode || '空'}}</span>
            </div>
          </div>
          <div
            v-if="baseInfo.licenseChemicalType !== '1'"
            class="license-field"
            style="margin-top: 15px;"
          >
            <div class="license-field-left">
              <span>品种类别</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.licenseTypeName || '空'}}</span>
            </div>
          </div>
          <div style="min-height: 66px; margin-top: 10px;">
            <div v-if="baseInfo.licenseChemicalType === '1'">
              <span>{{licenseTypeName}}品种、{{baseInfo.licenseType === '0' ? '产' : '销售'}}量(吨、年)：</span>
            </div>
            <div v-else>
              <span>{{licenseTypeName}}品种、{{baseInfo.licenseType === '0' ? '生产' : '销售'}}量(吨/年)：</span>
            </div>
            <div style="text-indent: 2em;">
              <span>{{baseInfo.outputLabel || '空'}}</span>
            </div>
          </div>
          <div class="license-field" style="min-height: 56px; margin-top: 10px;">
            <div class="license-field-left">
              <span>主要流向</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.areaFlowDirectionLabel || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div class="license-field-left">
              <span>发证机关</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.officeName || '空'}}</span>
            </div>
          </div>
          <div class="license-field">
            <div class="license-field-left">
              <span>发证日期</span>
            </div>
            <div class="license-field-right">
              <span>{{baseInfo.issueTime || '空'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from './api/service'
import { dateTransformType } from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      baseInfo: {},
      dictionary: {
        economicTypeList: []
      },
      chemicalType: ['零', '一', '二', '三'],
      list: []
    }
  },
  computed: {
    licenseTypeName() {
      // 返回生产或经营文本
      let licenseTypeName = ''
      if (this.baseInfo && this.baseInfo.licenseType) {
        licenseTypeName = this.baseInfo.licenseType === '0' ? '生产' : '经营'
      }
      return licenseTypeName
    },
    licenseChemicalTypeName() {
      // 返回许可证或备案证明文本
      let licenseChemicalTypeName = ''
      if (this.baseInfo && this.baseInfo.licenseChemicalType) {
        licenseChemicalTypeName =
          this.baseInfo.licenseChemicalType === '1' ? '许可证' : '备案证明'
      }
      return licenseChemicalTypeName
    },
    borderStyle() {
      // 根据证照信息、类型，返回证照边框颜色
      let borderStyle = {}
      let borderColor = ''
      if (
        this.baseInfo.licenseType === '0' &&
        this.baseInfo.licenseChemicalType !== '1'
      ) {
        // 当前只有生产备案证明边框为绿色
        borderColor = '#649C7C'
      } else {
        // 其他证照边框为金色
        borderColor = '#BB9F82'
      }
      borderStyle = {
        borderStyle3: `border: 3px solid ${borderColor};`,
        borderStyle1: `border: 1px solid ${borderColor};`
      }
      return borderStyle
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 初始化
      // 获取经济类型码表
      service.getEconomicype().then(res => {
        if (res && res.status === 200) {
          const data = res.data.datas
          this.dictionary.economicTypeList = data
        }
      })
      if (this.$route.params && this.$route.params.id) {
        // 调用接口获取企业信息数据
        service
          .changeProductionInfo({ id: this.$route.params.id })
          .then(res => {
            if (res && res.status === 200) {
              // 处理类型字段：
              res.data.datas.licenseTypeName = `第${
                this.chemicalType[+res.data.datas.licenseChemicalType]
              }类`
              // 经济类型:
              const economicType = this.dictionary.economicTypeList.find(
                item => item.value === res.data.datas.economicType
              )
              res.data.datas.economicTypeLabel = economicType
                ? economicType.label
                : ''
              // 经营品种、销售量(吨/年)：
              // res.data.datas.outputLabel = res.data.datas.corpProdOperList.reduce(
              //   (pre, next) => {
              //     return [...new Set(list)].join('、').replace(/、$/gi, '')
              //   },
              //   ''
              // )
              let list1 = this.list
              for (const item of res.data.datas.corpProdOperList) {
                list1.push(item.chemicalName + item.output + item.unit + '/年')
              }
              res.data.datas.outputLabel = [...new Set(list1)]
                .join('、')
                .replace(/、$/gi, '')
              // 主要流向：
              const list = []
              res.data.datas.areaFlowDirectionLabel = res.data.datas.corpProdOperList.reduce(
                (pre, next) => {
                  for (const item of next.chemicalMainFlowList) {
                    list.push(item.area + ',')
                  }
                  return [...new Set(list)].join('\r\n').replace(/,$/gi, '')
                },
                ''
              )
              // 处理有效期及发证日期为XXXX年XX月XX日格式
              res.data.datas.licenseExpireBegin = dateTransformType(
                res.data.datas.licenseExpireBegin
              )
              res.data.datas.licenseExpireEnd = dateTransformType(
                res.data.datas.licenseExpireEnd
              )
              res.data.datas.issueTime = dateTransformType(
                res.data.datas.issueTime
              )
              this.baseInfo = res.data.datas
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.license {
  width: calc(100vw - 20px);
  margin: 10px;
  overflow: auto;
  font-family: 'KaiTi';
  .license-border-3 {
    min-width: 610px;
    max-height: 100vh;
    padding: 10px;
  }
  .license-border-1 {
    display: flex;
    min-width: calc(610px - 24px);
    max-height: calc(100vh - 24px);
  }
  .license-left {
    flex: 1;
    padding-left: 7px;
    .license-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.5rem;
      font-size: 1.125rem;
      color: #bb9f82;
      img {
        height: 50px;
      }
    }
  }
  .license-right {
    flex: 1;
    margin-left: 10px;
    padding: 7px;
    padding-left: 0px;
    .license-border-right {
      height: 100%;
      width: 100%;
      padding: 7px;
      padding-left: 0px;
    }
  }
  .license-field {
    font-size: 1rem;
    display: flex;
    align-items: center;
    line-height: 1.2rem;
    margin-top: 10px;
    .license-field-left {
      width: 4.25rem;
      position: relative;
      text-align-last: justify;
      text-align: justify;
    }
    .license-field-right {
      margin-left: 20px;
      flex: 1;
    }
  }
}
</style>
