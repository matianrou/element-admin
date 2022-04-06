<template>
    <div class="container">
        <el-table :data="newData" style="width: 100%">
          <el-table-column prop="chemicalType" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="chemicalName" label="品名" align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="销售量（吨、年）"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="mainFlow" label="主要流向" align="center">
          </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            newData:[]
        }
    }
}
</script>