<template>
  <div class="contentContainer">
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="统计年度">
          <div class="block">
            <el-date-picker
              v-model="formInline.year"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="prodChemicalFlow(formInline)">查询</el-button>
          <el-button type="primary" @click="addlicense">添加</el-button>
        </el-form-item>
      </el-form>
      <ul class="tabledata" style="margin-top:20px" v-if="false">
        <li class="title">
          <span>许可备案类型</span>
          <span>品种类型</span>
          <span>品种名称</span>
          <span>销售量</span>
          <span>主要流向</span>
          <span>录入时间</span>
          <span>上报时间</span>
          <span>状态</span>
          <span>操作</span>
        </li>
        <li v-for="(item, index) in tableData" :key="index">
          <div
            class="dataname"
            :style="{
              lineHeight:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >{{ item.licenseChemicalTypeValue || '-' }}</div>
          <div
            class="dataname"
            :style="{
              height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px',
              lineHeight:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            {{
            item.chemicalTypeValue || '-'
            }}
          </div>
          <div
            class="dataname"
            :style="{
              height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px',
              lineHeight:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            {{
            item.chemicalName || '-'
            }}
          </div>
          <!-- <div
            class="dataname"
            :style="{
              lineHeight:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            {{ item.areaSales || 0 }}
            <b v-if="item.areaSales">{{'(' + item.unit + ')' }}</b>
          </div>-->
          <div
            class="contentbd"
            :style="{
              height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            <span
              v-for="(clditem, index) in item.prodChemicalFlowList"
              :key="index"
            >{{ clditem.areaSales + '('+item.unit+')' }}</span>
          </div>
          <div
            class="contentbd"
            :style="{
              height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            <span
              v-for="clditem in item.prodChemicalFlowList"
              :key="clditem.id"
              :title="clditem.provinceValue + clditem.cityValue +clditem.countryName"
            >{{clditem.provinceValue + clditem.cityValue +clditem.countryName }}</span>
          </div>
          <div
            class="contentbd"
            :style="{
              height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            <span
              v-for="(clditem, index) in item.prodChemicalFlowList"
              :key="index"
            >{{ clditem.createTime || '-' }}</span>
            <!-- <div v-else style="height:40px">
              <span>--</span>
            </div>-->
          </div>
          <div
            class="contentbd"
            :style="{
              height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >
            <span
              v-for="(clditem, index) in item.prodChemicalFlowList"
              :key="index"
            >{{ clditem.reportingTime || '----' }}</span>
          </div>
          <div
            class="dataname"
            :style="{
              lineHeight:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px'
            }"
          >{{ item.status == '1' ? '未上报' : '已上报' }}</div>
          <div
            class="caozuo"
            :style="{
              lineHeight:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px',height:
                item.prodChemicalFlowList.length != 0
                  ? 40 * Number(item.prodChemicalFlowList.length) + 'px'
                  : 40 + 'px',
            }"
          >
            <el-button size="mini" type="text" @click="auditlist(item, index,false)">查看</el-button>
            <el-button
              size="mini"
              type="text"
              @click="auditlist(item, index,true)"
              :disabled="item.status == 0"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              :disabled="item.status == 0"
              @click="reportlist(index,item)"
            >{{item.status== 0?'已上报':'上报'}}</el-button>
            <el-button
              size="mini"
              type="text"
              :disabled="item.status == 0"
              @click="deletelist(item, index)"
            >删除</el-button>
          </div>
        </li>
        <li v-show="tableData.length <= 0">
          <div class="tabledata-mask">
            <span>暂无数据</span>
          </div>
        </li>
        <div class="block" style="float: right; margin: 20px 0;">
          <el-pagination
            :current-page="currentPage"
            background
            :page-size="10"
            layout="total, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </ul>
      
    </el-card>
    <Addproduction
      v-if="licensedialog"
      ref="child"
      :year="formInline.year"
      :rowlist="rowlist"
      :isShow="isShow"
      :credentialList="credentialList"
    />
  </div>
</template>
<script>
import mixins from '@/utils/mixins'
import service from '../Authentication/api/service'
import Addproduction from './addproduction'

export default {
  components: {
    Addproduction
  },
  mixins: [mixins],
  props: {
    ischeck: false
  },
  data() {
    return {
      rowlist: '',
      limit: 10,
      page: 1,
      total: 0,
      currentPage: 1,
      formInline: {
        year: ''
      },
      tableData: [],
      credentialList: [],
      licensedialog: false,
      isShow: true
    }
  },
  created() {
    this.formInline.year = new Date().getFullYear().toString()
    if (!this.ischeck) {
      this.prodChemicalFlow()
    }
    const userInfo = JSON.parse(this.$store.state.getUserMsg).datas
    const params = {
      corpId: userInfo.corpId || '',
      officeId: userInfo.officeId || '',
      licenseType: ''
    }
    service.searchFirmCredential(params).then(response => {
      if (response.data.resp_code === 0) {
        this.credentialList = response.data.datas
      }
    })
  },
  methods: {
    addlicense() {
      // if (!this.credentialList.length) {
      //   this.$message.warning('当前企业暂未申请许可备案，请先申请!')
      //   this.$router.push({ name: 'applicationRecord' })
      //   return
      // }
      this.isShow = true
      this.rowlist = ''
      this.licensedialog = !this.licensedialog
    },
    deletelist(row) {
      const param = {
        chemicalId: row.chemicalId,
        propUuid: row.propUuid,
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId
      }
      this.$confirm('是否确定删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.delProductionFolw(param).then(res => {
            if (res && res.status == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.prodChemicalFlow()
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    auditlist(row, index, boo) {
      this.isShow = boo
      this.rowlist = JSON.parse(JSON.stringify(row))
      this.licensedialog = !this.licensedialog
    },
    // 销售上报
    reportlist(index, row) {
      const param = {
        chemicalId: row.chemicalId,
        propUuid: row.propUuid
      }
      this.$confirm('是否确定上报当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.salereprotlist(param).then(res => {
            if (res && res.data.resp_code == 0) {
              this.$message.success(res.data.resp_msg)
            } else {
              this.prodChemicalFlow()
              this.$message.error(res.data.resp_msg)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 列表接口
    prodChemicalFlow() {
      const param = {
        limit: this.limit,
        page: this.page,
        year: this.formInline.year || '',
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId || ''
      }
      service.prodChemicalFlow(param).then(res => {
        if (res && res.status == 200) {
          const data = res.data.data
          // this.tableData = data
          this.total = res.data.count
          try {
            this.tableData = data.map(item => {
              if (item.prodChemicalFlowList.length) {
                item.prodChemicalFlowList = item.prodChemicalFlowList.map($ => {
                  $.areaId = this.interpretArea($.areaId, this.areaExportList)
                  return $
                })
              }
              return item
            })
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.page = val
      this.prodChemicalFlow()
    },
    handleCurrentChange(val) {
      this.page = val
      this.prodChemicalFlow()
    }
  }
}
</script>
<style scoped lang="scss">
.tabledata {
  width: 100%;
  border: 1px solid #ebeef5;
  .dataname {
    border-right: 1px solid #ebeef5;
    height: 100%;
    width: 100%;
  }
  .contentbd {
    width: 100%;
    span {
      border-bottom: 1px solid #ebeef5;
    }
    b {
      font-weight: inherit;
    }
  }
  li {
    width: 100%;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    box-sizing: border-box;
    height: 100%;
    box-sizing: border-box;
    padding-top: 100px;
    div {
      display: inline-block;
      width: 100%;
      text-align: center;
      float: left;
      border-right: 1px solid #ebeef5;
      height: 100px;
      margin-top: -100px;
      padding-top: 30px;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-right: 1px solid #ebeef5;
        border-top: none;
      }
    }
  }
}
.title {
  display: flex;
  padding-top: 0px!important;
  span {
    display: inline-block;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #ebeef5;
    background: #fafafa;
  }
}
</style>
