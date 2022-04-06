<template>
  <el-dialog
    width="600px"
    title="企业信息完善"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
    destroy-on-close
  >
    <el-form
      ref="firmForm"
      :model="firmForm"
      :rules="firmRules"
      label-width="120px"
      v-loading="loading"
    >
      <el-form-item label="监管机构：" prop="officeId">
        <el-cascader
          ref="idsRef"
          v-model="firmForm.officeId"
          :props="officeProps"
          :options="officeOptions"
          :show-all-levels="false"
          @change="handleIdsChange"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">返回</el-button>
      <el-button type="primary" @click="commit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { areaTranslate } from '@/utils'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      officeProps: {
        value: 'id',
        label: 'label',
        children: 'children'
      },
      officeOptions: [],
      firmForm: {
        id: null, // 企业ID
        officeId: null, // 监管机构ID
        officeName: null // 监管机构名称
      },
      firmRules: {
        officeId: [
          { required: true, message: '请选择监管机构', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async init(info) {
      if (info && info.id) {
        this.visible = true
        this.firmForm.id = info.id
        this.firmForm.officeId = info.officeId
        this.firmForm.officeName = info.officeName
        await this.search()
      }
      this.$nextTick(() => {
        // 这里是为了手动触发一下获取机构名称
        console.log(this.$refs.idsRef.presentText)
        this.firmForm.officeName = this.$refs.idsRef.presentText
      })
    },
    // 查询监管机构列表
    search() {
      this.loading = true
      return request
        .get('/api-precursor/office/getProvinceOffice')
        .then(({ data }) => {
          this.loading = false
          if (data.datas && data.datas.length) {
            this.officeOptions = data.datas
            // 反查机构 ids
            this.firmForm.officeId = areaTranslate(
              this.firmForm.officeId,
              data.datas,
              false,
              10
            )
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.$message.error('查询失败，请重试！')
        })
    },
    // 更新监管机构名称
    handleIdsChange() {
      this.firmForm.officeName = this.$refs.idsRef.getCheckedNodes()[0].label
    },
    // 关闭弹框
    close() {
      this.visible = false
      this.$refs['firmForm'].resetFields()
    },
    // 提交
    commit() {
      this.$refs['firmForm'].validate(valid => {
        if (valid) {
          request
            .post('api-precursor/corpbasicinfo', {
              id: this.firmForm.id,
              officeId: this.firmForm.officeId.slice(-1)[0] || null,
              officeName: this.firmForm.officeName || null
            })
            .then(({ data }) => {
              if (data && data.resp_code == 0) {
                this.$message.success(data.resp_msg)
              } else {
                console.log(data.resp_msg)
                this.$message.error(data.resp_msg)
              }
              this.$parent.getRenderlist()
              this.close()
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
</style>