<template>
  <div class="treeXCombined" style="">
    <el-card style="">
      <el-tree
        v-loading="loading"
        :data="options"
        node-key="id"
        :default-expanded-keys="defaultshownodes"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
      >
      </el-tree>
    </el-card>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
export default {
  watch:{

  },
  data() {
    return {
      options: [],
      defaultshownodes:['1000000000'],
      formInline: {
        name: ''
      },
      loading: true
    }
  },
  methods: {
    handleDragStart() {},
    handleDragEnter() {},
    handleDragLeave() {},
    handleDragOver() {},
    handleDragEnd() {},
    handleDrop() {},
    allowDrop() {},
    allowDrag() {}
  },
  created() {
    service.gettreeselect().then((res) => {
      if (res.status == 200) {
        const data = res.data.datas
        this.options = data
        this.loading = false
        this.defaultshownodes.push('1000000000')
      }
    })
  }
}
</script>
<style lang="scss">
.treeXCombined {
  max-height: 90%;
  display: flex;
  .el-card {
    width: 450px;
    height: calc(100vh - 190px);
    overflow: scroll;
    margin-right: 20px;
  }
}
</style>