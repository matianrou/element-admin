<template>
  <div class="">
    <el-dialog
      title="企业填报状态"
      :visible.sync="DialogTip"
      width="70%"
      height="100%"
      :close-on-click-modal="false"
    >
      <div>
        <h2>测试省安监局已报企业年报汇总表（2021年度）</h2>
        <el-descriptions class="margin-top" :column="3" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              填报地区
            </template>
            测试数据
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              填报单位
            </template>
            测试数据
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              负责填表部门
            </template>
            测试数据
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              联系电话
            </template>
            测试数据
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              传真
            </template>
            测试数据
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              电子邮箱
            </template>
            测试数据
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="生产易制毒化学品年度生产销售情况" name="first">
          <el-descriptions
            class="margin-top"
            :column="3"
            border
            style="margin-bottom: 10px"
          >
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                企业数量（户）
              </template>
              测试数据
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                全部销售收入（万元）
              </template>
              测试数据
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                易制毒化学品销售收入（万元）
              </template>
              测试数据
            </el-descriptions-item>
          </el-descriptions>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="所属类别"> </el-table-column>
            <el-table-column prop="name" label="品种名称"> </el-table-column>
            <el-table-column prop="name" label="产量（吨）"> </el-table-column>
            <el-table-column prop="name" label="销售量（吨）">
            </el-table-column>
            <el-table-column prop="name" label="自用量（吨）">
            </el-table-column>
            <el-table-column prop="name" label="库存量（吨）">
            </el-table-column>
            <el-table-column label="销售流向及数量（吨）">
              <el-table-column prop="name" label="本市（地）">
              </el-table-column>
              <el-table-column prop="name" label="本省（市）">
              </el-table-column>
              <el-table-column prop="name" label="外省（市）">
              </el-table-column>
              <el-table-column prop="name" label="出口"> </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="经营企业易制毒化学品年度销售情况" name="second">
          <el-descriptions
            class="margin-top"
            :column="3"
            border
            style="margin-bottom: 10px"
          >
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                企业数量（户）
              </template>
              测试数据
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                全部销售收入（万元）
              </template>
              测试数据
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                易制毒化学品销售收入（万元）
              </template>
              测试数据
            </el-descriptions-item>
          </el-descriptions>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="所属类别"> </el-table-column>
            <el-table-column prop="name" label="品种名称"> </el-table-column>
            <el-table-column prop="name" label="产量（吨）"> </el-table-column>
            <el-table-column prop="name" label="销售量（吨）">
            </el-table-column>
            <el-table-column prop="name" label="自用量（吨）">
            </el-table-column>
            <el-table-column prop="name" label="库存量（吨）">
            </el-table-column>
            <el-table-column label="销售流向及数量（吨）">
              <el-table-column prop="name" label="本市（地）">
              </el-table-column>
              <el-table-column prop="name" label="本省（市）">
              </el-table-column>
              <el-table-column prop="name" label="外省（市）">
              </el-table-column>
              <el-table-column prop="name" label="出口"> </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script >
// import { defineComponent } from '@vue/composition-api'
export default {
  props: {
    fillNewialog: Boolean,
  },
  data() {
    return {
      DialogTip: false,
      activeName: 'first',
      tableData: [
        {
          name: '测试数据',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
    }
  },
  watch: {
    fillNewialog(val) {
      this.DialogTip = true
    },
    deep: true,
  },
  methods: {
    onSubmit() {},
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>
<style lang="less" scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
