<template>
  <div class="contentContainer">
    <el-card>
      <!-- <div style="display:flex"> -->
      <!-- <div class="production-header-container">
        <div class="production-header-btn">
          <el-button type="primary" @click="addInfo">完善生产情况</el-button>
        </div>
      </div>-->
      <div style="display:flex">
        <div class="after_change_lt" v-if="this.$route.params.changevalue">变更前</div>
        <ul class="tabledata">
          <!-- 表头 -->
          <li class="title">
            <span>品种名称</span>
            <!-- <span>购入量</span> -->
            <span>载明产量</span>
            <!-- <span>库存量</span> -->
            <span>主要流向</span>
            <!-- <span>销售量</span> -->
            <!-- <span>操作</span> -->
          </li>
          <!-- 列表项 -->
          <li v-for="(item, index) in newtableData" :key="index">
            <div
              class="dataname"
              :style="{
                lineHeight:
                  item.chemicalMainFlowList.length != 0
                    ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                    : 40 + 'px'
              }"
            >{{ item.chemicalName || '' }}</div>
            <div
              class="dataname"
              :style="{
                lineHeight:
                  item.chemicalMainFlowList.length != 0
                    ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                    : 40 + 'px'
              }"
            >
              {{ item.output || '' }}
              <b v-if="item.output">{{ '(' + item.unit + ')' }}</b>
            </div>
            <div class="contentbd">
              <div v-if="item.chemicalMainFlowList.length != 0">
                <span
                  v-for="(clditem, index) in item.chemicalMainFlowList"
                  :key="index"
                >{{ clditem.area }}</span>
              </div>
              <div v-else style="height:40px">
                <span></span>
              </div>
            </div>
            <!-- <div>
            <el-button size="small" @click="editCurrentInfo(item, index)">编辑</el-button>
            <el-button size="small" type="danger" @click="deletelist(item, index)">删除</el-button>
            </div>-->
          </li>
          <!-- 暂无数据 -->
          <li v-show="newtableData ? newtableData.length <= 0 : false">
            <div class="tabledata-mask">
              <span>暂无数据</span>
            </div>
          </li>
          <div class="block" style="float: right; margin: 20px 0;">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              background
              :page-size="limit"
              layout="total, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import service from '@/views/Authentication/api/service'
import mixins from '@/utils/mixins'

export default {
  mixins: [mixins],
  props: {
    materials: {
      type: String,
      default: ''
    },
    newtableData: {
      type: Array,
      default: () => []
    },
    corpId: {
      type: String,
      required: true
    }
  },
  data() {
    const validateFixedNum = (rule, value, callback) => {
      if (!value) {
        callback('请输入正确数量')
      } else {
        const reg = /^-?\d{1,8}(?:\.\d{1,2})?$/
        if (reg.test(value)) {
          callback()
        } else {
          callback('请输入正确的数字，小数点保留2位')
        }
      }
    }
    return {
      form: {
        chemicalType: '', // 类型
        chemicalName: '', // 品种名称
        output: '', // 载明产量
        unitId: '', // 计量单位
        chemicalMainFlowList: [], // 流向地区
        corpId: '',
        tableInnerData: [
          {
            area: '',
            areaId: '',
            areaSales: '',
            corpId: this.corpId
          }
        ]
      },
      rules: {
        area: [
          {
            required: true,
            message: '请您选择流向地区',
            trigger: 'change'
          }
        ],
        areaSales: [
          {
            required: true,
            validator: validateFixedNum,
            trigger: 'blur'
          }
        ],
        output: [
          {
            required: true,
            validator: validateFixedNum,
            trigger: 'blur'
          }
        ],
        chemicalName: [
          { required: true, message: '请您选择品种名称', trigger: 'blur' }
        ]
      },
      chemicalType: [],
      corpType: [],
      total: 0,
      page: 1,
      limit: 2,
      visit: false,
      editInfo: {
        flag: false,
        index: 0
      },
      caseKey: 0,
      afterlist: [],
      listlength: 0
    }
  },
  mounted() {
  },
  created() {
    this.getArea()
    // 获取类型字典
    this.getChemicalType().then(val => {
      if (val.status === 200) this.chemicalType = val.data.datas
    })
  },
  computed: {
    pageTableData: {
      get() {
        // 区划转换处理
        // return this.newtableData.slice(
        //   (this.page - 1) * this.limit,
        //   this.page * this.limit
        // )
      }
    }
  },
  watch: {
    // 生产类型
    materials: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.form.chemicalType = newVal.slice(-1)
          this.findByChemicalType().then(val => {
            if (val.status === 200) this.corpType = val.data.datas
          })
        }
        this.total = this.newtableData?.length
      }
    },
    areaExportList() {
      ++this.caseKey
    },
    deep: true
  },
  methods: {
    inputChange() {
      // 动态计算企业销售量并保持小数点后两位
      const reduceRes = this.form.tableInnerData.reduce(
        (acc, cur) => acc + Number(cur.areaSales),
        0
      )
      this.$set(this.form, 'output', reduceRes || '非正确性数字')
    },
    // 选择地区时同时赋值给流向列表
    selsctarea(row, rowindex) {
      this.form.tableInnerData[rowindex].areaId = row.id
      this.form.tableInnerData[rowindex].area = row.label
      // this.$nextTick(() => {
      //   const address = this.$refs.cascaderAddr.presentText
      //     .replace(/[//]/g, '')
      //     .replace(/\s*/g, '')
      //   this.form.tableInnerData[rowindex].area = address
      // })
      // this.areaExportList.forEach((item, index) => {
      //   if (item.label == val.row.area[0]) {
      //     for (const k of item.children) {
      //       if (k.children) {
      //         for (const k of k.children) {
      //           if (this.form.tableInnerData[rowindex].area.includes(k.label)) {
      //             this.form.tableInnerData[rowindex].areaId = k.id
      //             return
      //           }
      //         }
      //       } else {
      //         if (this.form.tableInnerData[rowindex].area.includes(k.label)) {
      //           this.form.tableInnerData[rowindex].areaId = k.id
      //           return
      //         }
      //       }
      //     }
      //   }
      // })
      // this.form.tableInnerData[rowindex]
    },
    // 获取当前地区tree列表
    getArea() {
      const param = {
        id: '100000'
      }
      service.getArea(param).then(res => {
        if (res && res.status == 200) {
          this.areaExportList = res.data.datas
          this.areaExportList.unshift(
            { label: '出口', id: '999999' },
            { label: '自用', id: '999998' }
          )
        }
      })
    },
    addInfo() {
      this.visit = true
      this.editInfo.flag = false
      this.restform()
    },
    visitExit() {
      this.visit = false
      this.restform()
    },
    // 删除流向地区条数
    handleDelete(index, row) {
      this.form.tableInnerData.splice(index, 1)
      this.inputChange()
    },
    // 完善产品信息增加
    commit(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.tableInnerData.length) {
            return this.$message.warning('请添加流向地区!')
          }
          // 对比流向地区销售量与录入载明产量是否一致
          const flowTotal = this.form.tableInnerData.reduce((pre, next) => {
            let num = +Number(next.areaSales).toPrecision()
            if (!num) num = 0
            num = +num.toFixed(2)
            const sum = +Number(+(pre += num).toPrecision()).toFixed(2)
            return sum
          }, 0)
          if (+this.form.output !== +flowTotal) {
            return this.$message.warning(
              '流向地区累计的销售数量要与载明产量保持一致!'
            )
          }
          data.chemicalMainFlowList = [
            ...JSON.parse(JSON.stringify(this.form.tableInnerData))
          ]
          data.corpId = this.corpId
          data = { ...data, ...data.chemicalName }
          if (this.editInfo.flag) {
            this.$emit('operate-list-handle', {
              type: 'splice',
              index: this.editInfo.index,
              data
            })
          } else {
            this.$emit('operate-list-handle', {
              type: 'push',
              data
            })
          }
          this.visitExit()
          this.total = this.newtableData.length
        }
      })
    },
    // 流向地区
    areaflow() {
      // this.form.corpId = JSON.parse(this.$store.state.getUserMsg).datas.corpId
      const data = {
        area: '',
        areaId: '',
        areaSales: '',
        corpId: this.corpId
      }
      // this.form.tableInnerData.push(data)
    },
    restTableList() {
      this.$emit('operate-list-handle', { type: 'rest' })
    },
    restform() {
      // this.$refs['form'].resetFields()
      this.$nextTick(() => {
        this.form.unit = ''
        this.form.output = ''
        this.form.chemicalName = ''
        this.form.tableInnerData = []
      })
    },
    editCurrentInfo(row, index) {
      // 解决前台分页导致下标乱序
      const cupIndex = (this.page - 1) * this.limit + index
      this.editInfo.flag = true
      this.editInfo.index = cupIndex
      this.form.chemicalType = row['chemicalType']
      this.form.chemicalName = row['chemicalName']
      this.form.output = row['output']
      // this.form.corpId = row['corpId']
      this.form.unit = row['unit']
      // this.form.tableInnerData = [...row.chemicalMainFlowList]
      this.visit = true
    },
    deletelist(_, index) {
      const cupIndex = (this.page - 1) * this.limit + index
      this.editInfo.index = cupIndex
      this.$confirm('是否确定删除此条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('operate-list-handle', {
            type: 'splice',
            index: this.editInfo.index
          })
          this.total = this.newtableData.length
          this.handleCurrentChange('1')
        })
        .catch(() => {
          return false
        })
    },
    handleCurrentChange(val) {
      this.page = val
    },
    // 生产品名
    corpTypeselsct(item) {
      this.form.unit = item.unit
      this.form.unitId = item.unitId
      this.form.chemicalId = item.id
    },
    async getChemicalType() {
      return await service.getchemical_type()
    },
    async findByChemicalType() {
      return await service.findByChemicalType(this.form.chemicalType)
    },
    // 组装数据
    assembleData() {
      const list = this.newtableData.slice()
      if (!list.length) {
        this.$parent.loading = false
        this.$message.warning('请完善生产经营情况!')
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  .el-input {
    width: 200px !important;
  }
}
.production-header-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
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
  }
  li {
    width: 100%;
    text-align: center;
    line-height: 40px;
    display: flex;
    border-bottom: 1px solid #ebeef5;
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
        border-right: 1px solid #ebeef5;
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
    border: 1px solid #ebeef5;
    background: #fafafa;
  }
}
</style>
