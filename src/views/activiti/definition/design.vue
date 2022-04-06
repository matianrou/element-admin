<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="流程KEY" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入流程KEY"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="OnlineDrawingProcess"
        >在线绘制流程
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleImport"
        >部署流程
        </el-button>
      </el-col>

    </el-row>


    <el-table v-loading="loading" :data="Modeler">
      <el-table-column label="流程定义ID" key="procId" align="center" prop="procId"/>
      <el-table-column label="流程名称" key="name" align="center" prop="name"/>

      <el-table-column label="状态" key="status" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'未发布':'已发布'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="OnlineModificationProcess(scope.row)"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            :disabled="scope.row.status==1"
            @click="deployDefinition(scope.row)"
          >{{scope.row.status==0?'未发布':'已发布'}}
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  


    <el-dialog title="流程图" :visible.sync="modelVisible" width="1100px">
      <slot name="-" style="border: none;padding: 0px;margin: 0px;">
        <vue-bpmn style="overflow: hidden;height: 700px;" product="activiti" ref="vueBpmn" @processSave="processSave"></vue-bpmn>
      </slot>
    </el-dialog>


    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".bpmn, .bar, .zip" :headers="upload.headers" :action="upload.url"
                 :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
                 :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“bpmn”、“bar”或“zip”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // import ElementTable from "@/components/element/ElementTable";
  import VueBpmn from "@/components/bpmn/VueBpmn.vue";
  import {getToken} from "@/utils/auth";
  import {listProcess, delDefinition, deployDefinition, processSave, getProcessRecord} from "@/api/activiti/definition";

  export default {
    name: "design",
    components: {
      VueBpmn
    },
    data() {
      return {
        modelerUrl: "",
        modelVisible: false,
        // 遮罩层
        loading: true,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        count: 0,
        // VIEW表格数据
        Modeler: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        src: "",
        // 查询参数
        queryParams: {
          page: 1,
          limit: 10,
          id: null,
          rev: null,
          name: null,
          type: null
        },
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/api-precursor/processDefinition/uploadStreamAndDeployment",
        },
        columns: [
          { key: 'procId', label: '流程定义ID'},
          { key: 'name', label: '流程名称' },
          { key: 'status', label: '状态'}
        ]
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        listProcess(this.queryParams).then(response => {
          this.Modeler = response.data.data;
          this.count = response.data.count;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      deployDefinition(row) {
        var suspendOrActive = row.status === '0' ? '发布' : '不发布';
        this.$confirm('确认要' + suspendOrActive + '流程吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deployDefinition(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("转换成功");
        }).catch(function () {
        });
      },
      handleImport() {
        this.upload.title = "上传模型图";
        this.upload.open = true;
      },
      OnlineDrawingProcess() {
        this.modelVisible = true;
        // this.$refs.vueBpmn.restart();
        // localStorage.setItem("VUE_APP_BASE_API", process.env.VUE_APP_BASE_API)
        // this.modelerUrl = "/bpmnjs/index.html?type=addBpmn";
      },
      processSave(data) {
        let that = this;
        processSave(data).then(response => {
          // this.loading = false;
          this.modelVisible = false;
          this.getList();
        });
      },
      OnlineModificationProcess(data) {
        getProcessRecord(data.id).then(response => {
          this.$refs.vueBpmn.initDiagram(response.data.datas.xmlStr);
        });
        this.modelVisible = true;
      },

      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },

      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.resp_msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.getList();
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除编号为"' + row.key + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDefinition(row.deploymentId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      modelCancel() {
        this.getList();
      },
      deploy() {

      }
    }
  }
</script>

<style scoped>
</style>
