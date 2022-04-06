<template>
  <div class="contentContainer" style="height: calc(100vh - 182px);overflow:auto">
    <div
      v-loading="loading"
      element-loading-text="数据正在提交中，请稍后"
      element-loading-spinner="el-icon-loading"
    >
      <UnitHeader
        ref="unitRef"
        :status="status"
        :corpType="corpType"
        :chemicalType="chemicalType"
        class="clear-box-style"
        @change-license-type="licenseChangeHandle"
      />
      <EnterInformation
        v-show="$store.state.applicationStatus.principal || $store.state.applicationStatus.units || $store.state.applicationStatus.importance"
        ref="conpanyRef"
        :principal="$store.state.applicationStatus.principal"
        :units="$store.state.applicationStatus.units"
        class="clear-box-style"
      />
      <el-card
        v-show="$store.state.applicationStatus.principal || $store.state.applicationStatus.units"
      >
        <div class="after_change">
          <div class="after_change_lt">变更后</div>
          <div class="after_change_form">
            <el-form
              ref="afterChangeForm"
              :model="afterChangeForm"
              :rules="rules"
              label-width="150px"
            >
              <el-form-item
                label="单位法人或负责人"
                v-if="$store.state.applicationStatus.principal"
                prop="originCorpChargePerson"
              >
                <el-input v-model.trim="afterChangeForm.originCorpChargePerson"></el-input>
              </el-form-item>
              <!-- <el-form-item
                label="主要负责人"
                v-if="this.$store.state.applicationStatus.principal"
                prop="originCorpChargePerson"
              >
                <el-input v-model.trim="afterChangeForm.originCorpChargePerson"></el-input>
              </el-form-item>-->
              <el-form-item
                label="单位名称"
                v-if="$store.state.applicationStatus.units"
                prop="originCorpName"
              >
                <el-input v-model.trim="afterChangeForm.originCorpName"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
      <!--许可品种主要流向改变、需要增加许可品种、数量  变更前的 -->
      <indexNewCopy
        :corpId="corpId"
        :materials="materials"
        :newtableData.sync="newtableData"
        class="clear-box-style"
        v-if="$store.state.applicationStatus.Permitflow || $store.state.applicationStatus.variety"
      />
      <!-- 许可品种主要流向改变、需要增加许可品种、数量  变更后的-->
      <production-index
        ref="prodRef"
        :corpId="corpId"
        :materials="materials"
        :tableData.sync="afterChangetableData"
        class="clear-box-style"
        @operate-list-handle="operateTypeHandle"
        v-if="$store.state.applicationStatus.Permitflow || $store.state.applicationStatus.variety || $store.state.applicationStatus.importance"
      />
      <!-- 备案材料 变更前-->
      <PutRecord
        ref="fileRef"
        :status="status"
        :ischeck="ischeck"
        :materials="materials"
        class="clear-box-style"
      />
      <!-- 备案材料 变更后-->
      <afterputrecord
        ref="afterchangefileRef"
        :status="status"
        :ischeck="ischeck"
        :materials="materials"
        class="clear-box-style"
        v-if="$store.state.applicationStatus.units || $store.state.applicationStatus.principal || $store.state.applicationStatus.Permitflow || $store.state.applicationStatus.variety"
      />
      <!-- footer btn -->
      <div class="record-footer-btn">
        <el-button align="center" type="primary" @click="combineData">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import EnterInformation from '@/views/EnterInformation/EnterInformation'
import PutRecord from '@/views/putRecord/putRecord'
import UnitHeader from './applicationRecord.vue'
import ProductionIndex from '@/views/productionCustom/index.vue'
import indexNewCopy from '@/views/productionCustom/indexNew-copy.vue'
import afterputrecord from '@/views/putRecord/afterputrecord.vue'
import service from '@/views/Authentication/api/service'

export default {
  components: {
    ProductionIndex,
    EnterInformation,
    PutRecord,
    UnitHeader,
    indexNewCopy,
    afterputrecord
  },
  data() {
    return {
      afterchangeStatus: false,
      materials: '',
      areaId: sessionStorage.getItem('areaId'),
      corpId: '',
      corpType: '', // 企业类型
      chemicalType: '', // 许可备案类型
      ischeck: true,
      valueprop: false,
      status: '1', // 当前状态 1 初次申请 2 变更 3 换证
      id: '', // 变更状态下查询生产情况 原备案证证书 ID
      // tableData: [],
      newtableData: [],
      afterChangetableData: [],
      tableInnerData: [],
      beforetabledata: [],
      loading: false,
      afterChangeForm: {
        originCorpChargePerson: '', // 变更后的主要负责人
        originCorpName: '' // 变更后的单位名称
      },
      principal: this.$store.state.applicationStatus?.principal || true, // 单位法定人或者主要负责人改变
      units: this.$store.state.applicationStatus?.units || true, // 单位名称改变
      Permitflow: this.$store.state.applicationStatus?.Permitflow || true, // 许可品种主要流向改变
      variety: this.$store.state.applicationStatus?.variety || true, //需要增加许可品种、数量
      rules: {
        originCorpChargePerson: [
          { required: true, message: '请输入主要负责人', trigger: 'blur' }
        ],
        originCorpName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    optionsList() {
      return [
        this.$store.state.applicationStatus.units,
        this.$store.state.applicationStatus.principal,
        this.$store.state.applicationStatus.Permitflow,
        this.$store.state.applicationStatus.variety
      ]
    }
  },
  created() {
    if (this.$route.params.status) {
      this.status = this.$route.params.status
      this.id = this.$route.params.id || ''
      // console.log('原备案ID', this.id)
    }
    // 变更状态时查询数据列表
    if (this.status === '2') {
      service.changeProductionInfo({ id: this.id }).then(response => {
        if (response.data.resp_code == 0) {
          const result = response.data.datas
          this.corpType = result.licenseType
          this.chemicalType = result.licenseChemicalType
          this.newtableData = result.corpProdOperList || []
          sessionStorage.setItem(
            'list',
            JSON.stringify(result.corpProdOperList)
          )
          this.afterChangetableData = result.corpProdOperList || []
        } else {
          this.$message.warning('请稍后尝试!')
          this.$router.replace({ name: 'licenserecord' })
        }
      })
    } else {
      // 初次申请和换证状态下默认查询生产经营类型
      this.searchInitCorpType()
    }
  },
  methods: {
    // 分发改变生产类型
    licenseChangeHandle(val) {
      this.materials = val
      if (this.status === '1') {
        this.operateTypeHandle({ type: 'rest' })
      }
    },
    // 判断生产经营情况组件外层列表增删改类型
    operateTypeHandle(event) {
      const { type, index, data = '' } = event
      switch (type) {
        case 'push':
          this.newtableData = JSON.parse(sessionStorage.getItem('list'))
          // this.tableData.push(data)
          this.afterChangetableData.push(data)
          break
        case 'splice':
          if (!data) {
            // this.tableData.splice(index, 1)
            this.newtableData = JSON.parse(sessionStorage.getItem('list'))
            this.afterChangetableData.splice(index, 1)
          } else {
            // this.tableData.splice(index, 1, data)
            this.newtableData = JSON.parse(sessionStorage.getItem('list'))
            this.afterChangetableData.splice(index, 1, data)
          }
          break
        case 'rest':
          // this.tableData = []
          this.newtableData = JSON.parse(sessionStorage.getItem('list'))
          this.afterChangetableData = []
          break
      }
    },
    // 新增申请证书默认查询
    searchInitCorpType() {
      try {
        const id = JSON.parse(this.$store.state.getUserMsg).datas.corpId
        this.corpId = `${id}`
        service.searchmsg({ id }).then(res => {
          if (res && res.status == 200) {
            this.corpType = res.data.datas.basicInfo.corpType
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    afterchangesubmit() {
      this.$refs['afterChangeForm'].validate(valid => {
        if (valid) {
          this.afterchangeStatus = false
        } else {
          this.afterchangeStatus = true
          return false
        }
      })
    },
    // 提交组合数据
    combineData() {
      // 判断是否是 负责人或者单位名称变更
      if (
        this.$store.state.applicationStatus?.principal ||
        this.$store.state.applicationStatus?.units
      ) {
        // 验证是否已经填写
        this.afterchangesubmit()
      }
      if (this.afterchangeStatus) {
        this.$message.warning('请您完善/填写当前变更后的数据')
        return false
      } else {
        let data;
        // 判断当前列表数据里是否有危险化学品，dangerType为0时代表有，为1时没有
        let isDanger = this.afterChangetableData.some(item => {
          return item.dangerType == 0
        })
        this.loading = true
        try {
          // 当前判断是为了区分是否为变更过来的数据
          // true 的话是为变更后的
          if (this.optionsList.includes(true)) {
            let updateType = [
              this.$store.state.applicationStatus.units ? 2 : '',
              this.$store.state.applicationStatus.principal ? 1 : '',
              this.$store.state.applicationStatus.Permitflow ? 3 : '',
              this.$store.state.applicationStatus.variety ? 4 : ''
            ]
            for (let i = 0; i < updateType.length; i++) {
              if (
                updateType[i] == '' ||
                updateType[i] == null ||
                typeof updateType[i] == undefined
              ) {
                updateType.splice(i, 1)
                i = i - 1
              }
            }
            data = {
              status: this.status,
              ...this.$refs['conpanyRef'].assembleData(),
              corpProdOperList: this.$refs['prodRef'] ? this.$refs['prodRef'].assembleData() : this.newtableData,
              materialList: this.$refs['afterchangefileRef'].assembleData()
                .list,
              materialsType: this.$refs['afterchangefileRef'].assembleData()
                .materialsType,
              ...this.$refs['unitRef'].assembleData(),
              ...this.afterChangeForm, // 变更后的法人以及公司名称
              id: this.$route.params.id,
              updateType: updateType,
              licenseNo: JSON.parse(sessionStorage.getItem('rowChangedata')).licenseNo,
              areaId: this.areaId,
            }
          } else {
            data = {
              status: this.status,
              ...this.$refs['conpanyRef'].assembleData(),
              corpProdOperList: this.$refs['prodRef'].assembleData(),
              materialList: this.$refs['fileRef'].assembleData().list,
              materialsType: this.$refs['fileRef'].assembleData().materialsType,
              ...this.$refs['unitRef'].assembleData(),
              id: this.$route.params.id,
              areaId: this.areaId,
            }
          }
          // 校验申请企业备案类型与企业生产经营类型是否一致
          const typeNum = data.licenseType + data.licenseChemicalType
          if (typeNum !== data.materialsType) {
            this.loading = false
            this.$message.warning(
              '企业生产经营类型请与许可备案类型一致!'
            )
            return false;
          }
        } catch (error) {
          console.log(error)
        }
        let pass = ''
        let list = []
        //   { value: '01', label: '生产第一类' }
        //   { value: '02', label: '生产第二类' }
        //   { value: '03', label: '生产第三类' }
        //   { value: '11', label: '经营第一类' }
        //   { value: '12', label: '经营第二类' }
        //   { value: '13', label: '经营第三类' }
        // 暂时判断当前条件是否满足，后续进行优化
        // true 的话是为变更后的
        if (this.optionsList.includes(true)) {
          list = this.$refs['afterchangefileRef'].assembleData().list
          pass = list.every(item => !!item.fileName)
        } else {
          if (data.materialsType == '01' && isDanger === true) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[5],
              data.materialList[7],
              data.materialList[8],
              data.materialList[9]
            )
            console.log(
              '生产第一类----当前属于危险化学品 需要提交第九条第十条，不需要提交第四条，第五条，第七条'
            )
            console.log(list)
            pass = list.every(item => !!item.fileName)
          } else if (data.materialsType == '01' && !isDanger) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[3],
              data.materialList[4],
              data.materialList[5],
              data.materialList[6],
              data.materialList[7]
            )
            console.log(
              '生产第一类----当前不属于危险化学品 需要提交1-8条，不需要提交9,10条'
            )
            pass = list.every(item => !!item.fileName)
          }

          if (data.materialsType == '11' && isDanger === true) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[3],
              data.materialList[5],
              data.materialList[6]
            )
            console.log(
              '经营第一类----当前属于危险化学品 需要提交第七条，不需要提交第五条'
            )
            pass = list.every(item => !!item.fileName)
          } else if (data.materialsType == '11' && !isDanger) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[3],
              data.materialList[4],
              data.materialList[5]
            )
            console.log('经营第一类----当前不属于危险化学品，不需要提交第7条')
            pass = list.every(item => !!item.fileName)
            console.log(list)
          }

          if (
            (data.materialsType == '02' || data.materialsType == '03') &&
            isDanger === true
          ) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[4],
              data.materialList[5]
            )
            console.log(
              '生产第二，三类----属于危险化学品 需要提交第五条第六条，不需要提交第四条'
            )
            pass = list.every(item => !!item.fileName)
            console.log(list)
          } else if (
            (data.materialsType == '02' || data.materialsType == '03') &&
            !isDanger
          ) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[3]
            )
            console.log(
              '生产第二，三类----不属于危险化学品 需要提交第四条，不需要提交第5第6条'
            )
            pass = list.every(item => !!item.fileName)
            console.log(list)
          }
          if (
            (data.materialsType == '12' || data.materialsType == '13') &&
            isDanger === true
          ) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[4]
            )
            console.log(
              '经营第二，三类----属于危险化学品 需要提交第五条，不需要提交第四条'
            )
            pass = list.every(item => !!item.fileName)
            console.log(list)
          } else if (
            (data.materialsType == '12' || data.materialsType == '13') &&
            !isDanger
          ) {
            list.push(
              data.materialList[0],
              data.materialList[1],
              data.materialList[2],
              data.materialList[3]
            )
            console.log('经营第二，三类----不属于危险化学品，需要提交第一二三四条')
            pass = list.every(item => !!item.fileName)
            console.log(list)
          }
        }
        // 判断当前备案材料是否上传如果未上齐全则去上传
        if (!pass) {
          this.loading = false
          this.$router.replace({ name: 'putRecord' })
          this.$store.commit('getMeunActive', '5')
          this.$message.warning('当前备案材料未上传齐全，请先上传!')
          return false;
        }
        // 校验生产经营情况列表是否为空
        if (
          data.corpProdOperList &&
          data.corpProdOperList.length
        ) {
          this.submitForm(data)
        };
      }
    },
    submitForm(params) {
      return service
        .addProductionInfo(params)
        .then(({ data }) => {
          this.loading = false
          if (data.resp_code == 0) {
            this.$message.success('提交成功!')
            // this.$refs['prodRef'].restTableList()
            this.$router.push({ name: 'leavevue' })
            this.$store.commit('getMeunActive', '9')
          } else {
            this.$message.error(data.resp_msg)
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.record-footer-btn {
  width: 100px;
  margin: 0 auto;
}
.clear-box-style {
  padding: 0 0 20px !important;
}
.after_change {
  display: flex;
  .after_change_lt {
    width: 4%;
    text-align: center;
    writing-mode: vertical-lr;
    background: #536ff7;
    padding-left: 12px;
    font-size: 30px;
    letter-spacing: 16px;
    text-indent: 15px;
    color: #fff;
    float: left;
  }
  .after_change_form {
    width: 80%;
  }
}
</style>
<style>
</style>
