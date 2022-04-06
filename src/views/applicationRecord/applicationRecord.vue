<template>
  <div class="contentContainer">
    <el-card>
      <el-form ref="form" :model="form" :inline="true">
        <el-row>
          <el-col>
            <el-form-item label="许可备案类型" prop="licenseType">
              <el-select
                v-model="form.licenseType"
                placeholder="请选择许可备案类型"
                @change="changeLicTypeTopHandle"
              >
                <el-option
                  v-for="item in licenseTypeFilterList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="form.licenseChemicalType" @change="changeLicTypeHandle">
                <el-radio
                  v-for="(item, index) of liCmTypeList"
                  :key="index"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="许可/备案受理部门" prop="officeName">
              <el-input
                class="unit-input"
                v-model="form.officeName"
                placeholder="请选择许可备案类型获取受理单位"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import service from '../Authentication/api/service'

export default {
  props: {
    status: {
      type: String,
      default: '1'
    },
    corpType: {
      type: String,
      default: ''
    },
    chemicalType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      licenseTypeList: [
        { label: '生产', value: '0' },
        { label: '经营', value: '1' }
      ],
      // liCmTypeList: [],
      form: {
        licenseType: '', // 企业经营类型
        licenseChemicalType: '', // 许可备案类型
        officeName: '',
        officeId: ''
      }
    }
  },
  computed: {
    licenseTypeFilterList: {
      get() {
        let options = []
        options = this.licenseTypeList.filter(
          item => item.value === this.corpType
        )
        if (!options.length) options = this.licenseTypeList
        return options
      }
    },
    liCmTypeList: {
      get() {
        const list = [
          { label: '第一类许可证', value: '1' },
          { label: '第二类备案证', value: '2' },
          { label: '第三类备案证', value: '3' }
        ]
        // 变更情况下过滤类型列表
        if (this.status === '2') {
          return list.filter(item => item.value === this.chemicalType)
        }
        return list
      }
    }
  },
  watch: {
    corpType: {
      handler: function() {
        this.form.licenseType = this.corpType
        if (this.corpType === '2') this.form.licenseType = '0'
        this.$emit(
          'change-license-type',
          this.form.licenseType + this.form.licenseChemicalType
        )
      }
    },
    chemicalType: {
      handler: function() {
        this.form.licenseChemicalType = this.chemicalType
        this.getLiceTypeList()
        this.$emit(
          'change-license-type',
          this.form.licenseType + this.form.licenseChemicalType
        )
      }
    },
    deep: true
  },
  methods: {
    changeLicTypeHandle(val) {
      this.form.licenseChemicalType = val
      this.$emit('change-license-type', this.form.licenseType + val)
      this.getLiceTypeList()
    },
    changeLicTypeTopHandle(val) {
      this.form.licenseChemicalType = ''
      this.form.officeName = ''
      this.form.licenseType = val
      // this.getLiceTypeList()
    },
    getLiceTypeList() {
      const data = {
        licenseType: this.form.licenseType,
        licenseChemicalType: this.form.licenseChemicalType
      }
      service.getlicensTypeArea(data).then(response => {
        if (response.data.resp_code === 0) {
          this.form.officeName = ''
          this.form.officeId = ''
          this.$nextTick(() => {
            this.form.officeId = response.data.datas.id
            this.form.officeName = response.data.datas.name
          })
        } else {
          this.form.officeId = ''
          this.form.officeName = ''
          console.error('受理单位类型查询失败!')
        }
      })
    },
    assembleData() {
      return {
        // status: '', // 企业状态
        officeId: this.form.officeId,
        officeName: this.form.officeName,
        licenseType: this.form.licenseType, // 许可备案证类型
        licenseChemicalType: this.form.licenseChemicalType
      }
    }
  }
}
</script>
<style scoped lang="scss">
.unit-input {
  width: 645px;
}
</style>
