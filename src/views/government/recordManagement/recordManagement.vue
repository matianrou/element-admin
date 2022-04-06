<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="企业名称">
        <div class="block">
          <el-input v-model="formInline.corpName" placeholder="请输入"></el-input>
        </div>
      </el-form-item>
      <!-- <el-form-item label="企业状态">
        <el-select v-model="formInline.quarter" placeholder="请选择">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="即将到期" value="即将到期"></el-option>
          <el-option label="已过期" value="已过期"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="许可备案类型">
        <el-select v-model="formInline.licenseType" placeholder="请选择">
          <el-option label="生产" value="0"></el-option>
          <el-option label="经营" value="1"></el-option>
        </el-select>
        <el-select v-model="formInline.licenseChemicalType" placeholder="请选择">
          <el-option
            v-for="(item,index) in opitons"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发证机构" prop="officeId">
        <el-cascader
          v-model="formInline.officeId"
          placeholder="请选择"
          :key="options.value"
          :props="{ value: 'id', checkStrictly: true }"
          :options="options"
          :show-all-levels="false"
          clearable
          ref="myCascader"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="formInline.isOwnOffice" @change="isOwnOffice">
          <el-checkbox label="本机构" name="0"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search('')">查询</el-button>
        <el-button @click="search('')">全部</el-button>
        <el-button @click="search('1')">即将到期</el-button>
        <el-button @click="search('2')">已过期</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="loading" style="width: 100%" border>
      <el-table-column prop="corpName" label="企业名称" align="center">
        <template slot-scope="scope">
          <span
            @click="chechdetails(scope.row)"
            style="color: blue; cursor: pointer"
          >{{ scope.row.corpName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center"></el-table-column>
      <el-table-column prop="licenseNo" label="许可备案证号" align="center">
        <template slot-scope="scope">
          <span
            style="color:blue;cursor:pointer"
            @click="checkdialog(scope.row)"
          >{{ scope.row.licenseNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="officeName" label="发证机构" align="center"></el-table-column>
      <el-table-column prop="regulatorName" label="监管机构" align="center"></el-table-column>
      <el-table-column prop="issueTime" label="发证日期" align="center"></el-table-column>
      <el-table-column prop="licenseExpireBegin" label="有效期起始日期" align="center"></el-table-column>
      <el-table-column prop="licenseExpireEnd" label="有效期截止日期" align="center"></el-table-column>
      <el-table-column prop="onlineAnnounceTime" label="网上公布日期" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">注销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" />
    <Publicdialog :rowdata="rowdata" :isShow="1" v-if="Publicdialogdialog" />
    <!-- <el-dialog
      width="50%"
      height="100%"
      title="许可备案信息"
      :visible.sync="visit"
      @close="recordModalHandle"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <Addrecord v-if="visit" :rowform="rowform" />
    </el-dialog>-->
    <el-dialog
      width="65%"
      height="100%"
      title="许可备案信息"
      :visible.sync="visit"
      @close="recordModalHandle"
    >
    <div style="text-align:center;">
        <div class="sizeposition">
          <span>
            经营品种、销售量字体大小调整：
            <b class="sizebtn" @click="FontAize.size++">+</b>
            <b class="sizebtn" @click="FontAize.size--">-</b>
          </span>
          <span>
            主要流向字体大小调整：
            <b class="sizebtn" @click="FontAize.flowsize++">+</b>
            <b class="sizebtn" @click="FontAize.flowsize--">-</b>
          </span>
          <span>
            单位地址字体大小调整：
            <b class="sizebtn" @click="FontAize.dansize++">+</b>
            <b class="sizebtn" @click="FontAize.dansize--">-</b>
          </span>
        </div>
      </div>
      <!-- 许可证 副本 -->
      <printe-ectypal-permit :FontAize="FontAize" :printInfo="printInfo" :disabledDrag="disabledDrag" />
    </el-dialog>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import Publicdialog from '../current/publicdialog.vue'
import Pagination from '../current/pagination'
import Addrecord from '../../licenserecord/addrecord.vue'
import printeEctypalPermit from '@/views/printed/printeEctypalPermit.vue'
import { dateTransformType } from '@/utils/index'
import Vue from 'vue'
export default {
  components: {
    Publicdialog,
    Pagination,
    Addrecord,
    printeEctypalPermit
  },
  data() {
    return {
      disabledDrag: true,
      tableData: [],
      opitons: [],
      limit: 10,
      page: 1,
      total: 0,
      checklicensedialog: false,
      Publicdialogdialog: false,
      loading: true,
      visit: false,
      options: [],
      printInfo: {},
      rowform: '',
      FontAize: {
        size: 22,
        flowsize: 22,
        dansize: 24
      },
      formInline: {
        corpName: '',
        licenseType: '',
        isOwnOffice: '',
        officeId: '',
        licenseChemicalType: ''
      },
      licenseStatus: '',
      Officetype: '1'
    }
  },
  methods: {
    isOwnOffice(val) {
      if (val) {
        this.Officetype = '0'
      } else {
        this.Officetype = '1'
      }
      this.getRenderlist()
    },
    // 监听输入框值
    onCommentInputChange() {
      this.commentContent = document.getElementById('commentContent').value
    },
    // 注销接口
    handleDelete(index, row) {
      if(document.getElementById('commentContent')?.value){
        document.getElementById('commentContent').value = ''
      }
      const h = this.$createElement
      this.$msgbox({
        title: '注销说明',
        message: h(
          'div',
          {
            attrs: {
              class: 'el-textarea'
            }
          },
          [
            h('textarea', {
              attrs: {
                placeholder: '请输入回复内容',
                class: 'el-textarea__inner',
                autocomplete: 'off',
                rows: 5,
                id: 'commentContent'
              },
              value: this.commentContent,
              on: { input: this.onCommentInputChange }
            })
          ]
        ),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (document.getElementById('commentContent').value == '') {
              this.$message({
                type: 'error',
                message: '请您填写注销说明后在进行注销流程'
              })
              done()
            } else {
              this.zhuxiao(row)
              done()
            }
          } else {
            done()
          }
        }
      })
    },
    // 注销
    zhuxiao(row) {
      const param = {
        id: row.id,
        logoffReason: document.getElementById('commentContent').value
      }
      service.recordLogout(param).then(res => {
        if (res && res.data.resp_code == 0) {
          this.$message({
            type: 'success',
            message: res.data.resp_msg
          })
          this.getRenderlist()
        } else {
          this.$message({
            type: 'error',
            message: res.data.resp_msg
          })
          this.getRenderlist()
        }
      })
    },
    checkdialog(row) {
      // console.log('点击了标题文字',row)
      // 选择打印许可证或备案证明后调取数据
      this.visit = !this.visit
      let id = row.id
      service.getGmLicensPrintInfo({ id }).then(response => {
        // 处理有效期及发证日期为XXXX年XX月XX日格式
        response.data.datas.licenseExpireBegin = dateTransformType(
          response.data.datas.licenseExpireBegin
        )
        response.data.datas.licenseExpireEnd = dateTransformType(
          response.data.datas.licenseExpireEnd
        )
        response.data.datas.issueTime = dateTransformType(
          response.data.datas.issueTime
        )
        this.printInfo = response.data.datas
      })
    },
    checklicense(row) {
      this.rowform = row
      this.checklicensedialog = !this.checklicensedialog
    },
    // 查看当前企业提交信息
    chechdetails(row) {
      this.rowdata = row
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    // 获取许可备案管理列表
    async getRenderlist(val) {
      this.loading = true
      const param = {
        limit: this.limit,
        page: val || 1,
        licenseStatus: this.licenseStatus || '',
        licenseType: this.formInline.licenseType || '',
        corpName: this.formInline.corpName || '',
        reqType: 4,
        isOwnOffice: this.Officetype || '',
        corpOverdue: this.licenseStatus || '',
        licenseChemicalType: this.formInline.licenseChemicalType || '',
        officeId:
          this.formInline.officeId[this.formInline.officeId.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      await service.getRecordManagementList(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.data
          this.total = res.data.count
          this.loading = false
        }
      })
    },
    getDictType() {
      const param = {
        type: 'chemical_type'
      }
      service.getDictType(param).then(res => {
        if (res) {
          this.opitons = res.data.datas
        }
      })
    },
    search(val) {
      this.licenseStatus = val
      this.getRenderlist()
    },
    recordModalHandle() {
      this.visit = false
    },
    gettreeselect() {
      service.getyeartree().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.options = data
        }
      })
    }
  },
  created() {
    this.formInline.officeId =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    // 获取类型字典
    this.getDictType()
    this.getRenderlist()
    this.gettreeselect()
    // service.addbeian(param).then((res)=>{
    //   if(res.status =200){
    //     this.tableData = res.data.data
    //   }
    // })
  }
}
</script>
<style scoped>
.add {
  cursor: pointer;
}
</style>