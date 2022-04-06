<template>
  <div class="contentContainer">
    <el-card>
      <div style="display:flex">
        <div
          class="after_change_lt"
          v-if="this.$store.state.applicationStatus.units || this.$store.state.applicationStatus.principal || this.$store.state.applicationStatus.Permitflow || this.$store.state.applicationStatus.variety"
        >变更前</div>
        <div style="width:100%">
          <div class="select-management">
            <span class="select-management-text">企业生产经营类型</span>
            <el-select v-model="materialsType" @change="mateTypeChangeHandle" :disabled="ischeck">
              <el-option
                v-for="item in materialsTypeFilterList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <el-alert :closable="false" type="error">
            <!-- 生产第一类 -->
            <div slot="title" v-show="materialsType === '01'">
              <div class="iconSize">注:</div>
              <div
                class="iconSize"
              >1、属于危险化学品生产单位的，还应当提交危险化学品生产企业安全生产许可证和危险化学品登记证（复印件），免于提交本条第（四）、（五）、（七）项所要求的文件、资料。</div>
              <div class="iconSize">2、不属于危险化学品的生产单位不需要提交危险化学品生产企业安全生产许可证和危险化学品登记证（复印件）</div>
            </div>
            <!-- 生产第一类 -->
            <div slot="title" v-show="materialsType === '11'">
              <div class="iconSize">注:</div>
              <div class="iconSize">经营第一类：属于危险化学品经营单位的，还应当提交危险化学品经营许可证（复印件），免于提交本条第（五）项所要求的文件、资料。</div>
            </div>
            <!-- 生产第二 三类 -->
            <div slot="title" v-show="materialsType === '02' || materialsType === '03'">
              <div class="iconSize">注:</div>
              <div
                class="iconSize"
              >生产第二、三类备案：属于危险化学品生产单位的，还应当提交危险化学品生产企业安全生产许可证和危险化学品登记证（复印件），免于提交本条第（四）项所要求的文件、资料。</div>
            </div>
            <!-- 经营第二 三类 -->
            <div slot="title" v-show="materialsType === '12' || materialsType === '13'">
              <div class="iconSize">注:</div>
              <div class="iconSize">经营第二、三类备案：属于危险化学品经营单位的，还应当提交危险化学品经营许可证，免于提交本条第（四）项所要求的文件、资料。</div>
            </div>
          </el-alert>
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="name" label="材料名称" align="left" header-align="left">
              <template v-slot:default="{ row }">
                <span
                  :style="row.filePath ? { color: 'blue', cursor: 'pointer' } : {}"
                  @click="checkFile(row)"
                >{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" width="350px" label="上传时间" align="center">
              <template v-slot:default="{ row }">
                <span>{{ row.createTime ? row.createTime : '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" width="350px" label="上传状态" align="center">
              <template v-slot:default="{ row }">
                <span :style="{ color: row.fileName ? '#606266' : '#A30014' }">
                  {{
                  row.fileName ? '已上传' : '未上传'
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250px" align="center" v-if="!ischeck">
              <template v-slot:default="{ row }">
                <el-button v-if="row.fileName" size="mini" @click="auditlist(row)">更新</el-button>
                <el-button v-if="!row.fileName" size="mini" @click="auditlist(row)">上传</el-button>
                <el-button v-if="row.filePath" type="danger" size="mini" @click="deleteFile(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <Addput :rowlist="rowlist" v-if="addputdialog" :type="materialsType" />
  </div>
</template>
<script>
import service from '../Authentication/api/service'
import Addput from './addput'

export default {
  props: {
    ischeck: {
      type: Boolean,
      default: false
    },
    materials: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: '1'
    }
  },
  components: {
    Addput
  },
  data() {
    return {
      addputdialog: false,
      selsctType: true,
      limit: 10,
      page: 1,
      total: 0,
      currentPage: 1,
      tableData: [],
      rowlist: '',
      corpType: '0',
      materialsType: '',
      materialsTypeList: [
        { value: '01', label: '生产第一类' },
        { value: '02', label: '生产第二类' },
        { value: '03', label: '生产第三类' },
        { value: '11', label: '经营第一类' },
        { value: '12', label: '经营第二类' },
        { value: '13', label: '经营第三类' }
      ]
    }
  },
  created() {
    // 非变更下默认查询备案列表
    if (this.status !== '2') {
      this.getCurrentConpNo()
      this.materialsType = this.materialsTypeList[0].value || ''
    } else {
      this.corpType = this.materials.substr(0, 1)
    }
  },
  computed: {
    materialsTypeFilterList() {
      return this.materialsTypeList.filter(item => {
        if (this.corpType === '0') {
          return item.value < 10
        } else if (this.corpType === '1') {
          return item.value > 10
        } else {
          return item
        }
      })
    }
  },
  watch: {
    materialsType: {
      handler: function() {
        this.getputRecordlist()
      }
    },
    materials: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.materialsType = newVal
        }
      }
    }
  },
  methods: {
    addput() {
      this.form = ''
      this.addputdialog = !this.addputdialog
    },
    mateTypeChangeHandle(val) {
      this.materialsType = val
    },
    handleDelete(index, row) {
      const param = {
        id: row.id
      }
      service.deleteRecordlist(param).then(res => {
        if (res && res.status == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getputRecordlist()
        }
      })
    },
    async getCurrentConpNo() {
      const id = JSON.parse(this.$store.state.getUserMsg).datas.corpId
      await service.searchmsg({ id }).then(res => {
        if (res && res.status == 200) {
          this.corpType = res.data.datas.basicInfo.corpType
        }
      })
      if (this.corpType === '0') {
        this.materialsType = '01'
      } else if (this.corpType === '1') {
        this.materialsType = '11'
      }
    },
    getputRecordlist() {
      this.materialsType = this.materialsType == 0 ? '01' : this.materialsType
      const param = {
        limit: this.limit,
        page: this.page,
        materialsType: this.materialsType
      }
      service.getputRecordlist(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.data
          this.$set(this.tableData)
        }
      })
    },
    // 查看附件选项
    checkFile(row) {
      if (row.filePath) {
        const dom = document.createElement('a')
        dom.style.display = 'none'
        dom.href = service.baseUrl + '/api-precursor' + row.filePath
        document.body.appendChild(dom)
        dom.target = '_blank'
        dom.click()
        document.body.removeChild(dom)
      } else {
        return this.$message.warning('暂无上传备案材料，请先上传!')
      }
    },
    // 删除功能
    deleteFile(row) {
      this.$confirm('您确定要删除已上传的文件吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.deleteMaterials(row).then(res => {
            if (res && res.status == '200') {
              this.getputRecordlist()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(function() {})
    },
    auditlist(row) {
      this.rowlist = row
      this.addputdialog = !this.addputdialog
    },
    // 返回组合数据
    assembleData() {
      const list = this.tableData.map(item => {
        delete item.createTime
        return item
      })
      return {
        materialsType: this.materialsType,
        list
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-management {
  margin-bottom: 10px;
  .select-management-text {
    color: #606266;
    line-height: 40px;
    font-size: 14px;
    font-weight: 700;
    padding-right: 12px;
  }
}
</style>
