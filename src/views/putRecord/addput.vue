<template>
  <div>
    <el-dialog
      title="备案材料更新录入"
      :visible.sync="DialogTip"
      width="30%"
      height="100%"
      :append-to-body="false"
      auto-complete="on"
      :close-on-click-modal="false"
      @close="dialogfalse"
    >
      <el-alert
        title="上传文件不得大于10MB（上传文件格式jpg,gif,png,bmp,word,doc,docx,xls,xlsx,pdf,excel）"
        type="error"
        style="margin-bottom:10px"
        :closable="false"
      ></el-alert>
      <el-form
        ref="form"
        label-width="80px"
        class="demo-form-inline"
        :inline="true"
        enctype="multipart/form-data"
        style="margin: auto"
        v-loading="loading"
        element-loading-text="文件正在上传中，请稍后"
        element-loading-spinner="el-icon-loading"
      >
        <div>
          <el-upload
            ref="upload"
            :limit="1"
            :auto-upload="false"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :accept="accepts.join(',')"
            action
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处</div>
          </el-upload>
        </div>
        <div
          v-if="fileboo"
          style="margin-top：10px;color:#000"
        >已上传文件：{{ rowlist.fileName || '暂无上传文件' }}</div>
        <el-form-item class="dialog-footer" style="margin-top: 20px" align="center">
          <el-button @click="DialogTip = false">取 消</el-button>
          <el-button :disabled="disabledBtn" type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    checkdialog: Boolean,
    rowlist: ''
  },
  watch: {
    checkdialog(val) {
      this.DialogTip = true
    },
    deep: true
  },
  data() {
    return {
      DialogTip: true,
      disabledBtn: false,
      materialName: '',
      fileboo: true,
      file: '',
      accepts: [
        '.xlsm',
        '.xls',
        '.xlsx',
        '.jpg',
        '.png',
        '.jpeg',
        '.raw',
        '.pic',
        '.gif',
        '.pdf',
        '.doc',
        '.docx'
      ],
      loading: false
    }
  },
  methods: {
    handleChange(file, fileList) {
      console.log(file)
      if (fileList.length) this.fileboo = false;
      const FILE_MB = 10;
      const limitMb = file.size / 1024 / 1024 < FILE_MB;
      if (!limitMb) {
        this.fileboo = true;
        this.$refs['upload'].uploadFiles = [];
        this.$message.warning(`温馨提示：您上传的附件超过了${FILE_MB}MB，请重新上传。`);
        return false;
      };
    },
    handleRemove(_, { length }) {
      if (!length) this.fileboo = true;
    },
    dialogfalse() {
      this.$parent.addputdialog = false
    },
    submit() {
      this.loading = true
      if (!this.$refs['upload'].uploadFiles.length) {
        this.loading = false
        return this.$message.warning('请先上传的文件')
      }
      const formdata = new FormData()
      formdata.append('file', this.$refs.upload.uploadFiles[0].raw)
      formdata.append('uploadPath', 'serverfile')
      formdata.append(
        'corpId',
        JSON.parse(this.$store.state.getUserMsg).datas.corpId
      )
      formdata.append('name', this.rowlist.name)
      formdata.append('licenseId', this.rowlist.licenseId || '')
      formdata.append('id', this.rowlist.id ? this.rowlist.id : '')
      formdata.append('materialsType', this.type)
      this.disabledBtn = true
      service
        .addputRecordlist(formdata)
        .then(({ data }) => {
          if (data.resp_code == 0) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.$parent.getputRecordlist()
            this.$parent.addputdialog = false
          } else {
            this.$message({
              message: data.resp_msg,
              type: 'error'
            })
          }
          this.loading = false
          this.disabledBtn = false
        })
        .catch(err => {
          this.loading = false
          this.disabledBtn = false
          console.log(err)
        })
    }
  }
}
</script>
