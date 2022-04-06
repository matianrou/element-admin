<template>
  <div>
    <el-dialog
      title="非药品类易制毒化学品第二类生产备案初次申请"
      :visible.sync="DialogTip"
      width="70%"
      height="100%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :inline="true"
        label-width="190px"
        class="demo-ruleForm"
      >
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="工商注册号" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="监管机构代码" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人或主要负责人" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="从业人员人数" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="技术/销售、管理人员人数" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="上年固定资产净值（万元）" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="企业登记类型" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-col :span="12">
<el-form-item label="企业成立时间" prop="region">
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        </el-col>
        <el-table :data="newtableData" style="width: 100%">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
              <el-table-column
              prop="name"
                label="产品名称"
                align="center"
              >
                <template slot-scope="scope" >
                  <el-input v-model="scope.row.value"></el-input>
                  <!-- <span v-else>{{scope.row.date}}</span> -->
                </template>
              </el-table-column>
              <el-table-column
                label="产量"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                  <!-- <span v-else>{{scope.row.name}}</span> -->
                </template>
              </el-table-column>
            <el-table-column label="备注" align="center">
              <el-table-column
                label="现有生产能力（吨/年）"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"></el-input>
                  <!-- <span v-else>{{scope.row.date}}</span> -->
                </template>
              </el-table-column>
              <el-table-column
                label="上年度产量（吨/年）"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"></el-input>
                  <!-- <span v-else>{{scope.row.name}}</span> -->
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="submitForm('ruleForm')"
            style="position:relative;left:45%">添加</el-button>
            <el-button type="danger" style="position:relative;left:47%" @click="submitForm('ruleForm')"
            >删除</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "recordApply",
  props: {
    applydialog: Boolean,
  },
  watch: {
    applydialog(val) {
      this.DialogTip = true;
    },
    deep: true,
  },
  data() {
    return {
      DialogTip: false,
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      newtableData: [
        {
          date: "2016-05-02",
          name: "",
          value: "测试数据",
          address: "上海市普陀区金沙江路 1518 弄",
          show: false,
        },
        {
          date: "2016-05-02",
          name: "",
          value: "测试数据",
          address: "上海市普陀区金沙江路 1518 弄",
          show: false,
        },
      ],
    };
  },
  methods: {
    applydialog_c() {
    },
    submitForm(){
      this.newtableData.push({
          date: "",
          name: "",
          value: "",
          address: "",
          show: false,
      })
    }
  },
};
</script>
