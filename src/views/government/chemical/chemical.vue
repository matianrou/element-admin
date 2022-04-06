<template>
  <div class="contentContainer">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="品种类别" prop="chemicalType">
        <el-select v-model="form.chemicalType" placeholder="请选择">
          <el-option
            v-for="(item, index) in chemical_type"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品种名称" prop="chemicalName">
        <el-input v-model="form.chemicalName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="chemicalSearch(form)">查询</el-button>
        <el-button type="primary" @click="addAhemical">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="chemicalType" label="品种类别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.chemicalType == 1">第一类</span>
          <span v-if="scope.row.chemicalType == 2">第二类</span>
          <span v-if="scope.row.chemicalType == 3">第三类</span>
        </template>
      </el-table-column>
      <el-table-column prop="chemicalName" label="品种名称" align="center"></el-table-column>
      <el-table-column prop="unit" label="计量单位" align="center"></el-table-column>
      <el-table-column prop="dangerTypeValue" label="是否是危险化学品" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.dangerType == 0">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="audit(scope.row)">编辑</el-button>
          <!-- <el-button size="small" type="danger" @click="deletelist(scope.row)"
            >删除</el-button
          >-->
        </template>
      </el-table-column>
    </el-table>
    <addAhemical v-if="addAhemicaldialog" :rowform="rowform" :chemical_type="chemical_type" />
    <Pagination :total="total" />
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import addAhemical from './addAhemical.vue'
import Pagination from '../current/pagination'
export default {
  components: {
    addAhemical,
    Pagination
  },
  data() {
    return {
      addAhemicaldialog: false,
      form: {
        chemicalName: '',
        chemicalType: ''
      },
      rowform: '',
      tableData: [],
      chemical_type: [],
      limit: 10,
      page: 1,
      total: 0
    }
  },
  methods: {
    // 添加
    addAhemical() {
      this.rowform = ''
      this.addAhemicaldialog = !this.addAhemicaldialog
    },
    // 获取当前类型
    getchemical_type() {
      service.getchemical_type().then(res => {
        if (res.status == 200) {
          this.chemical_type = res.data.datas
        }
      })
    },
    // 获取化学品列表
    getRenderlist(val) {
      const param = {
        limit: this.limit,
        page: val || 1,
        chemicalName: this.form.chemicalName,
        chemicalType: this.form.chemicalType
      }
      service.getchemicalInfo(param).then(res => {
        if (res.status == 200) {
          const data = res.data.data
          this.total = res.data.count
          this.tableData = data
        }
      })
    },
    audit(row) {
      this.rowform = row
      this.addAhemicaldialog = !this.addAhemicaldialog
    },
    chemicalSearch() {
      this.getRenderlist()
    }
  },
  mounted() {
    this.getRenderlist()
  },
  created() {
    this.getchemical_type()
  }
}
</script>