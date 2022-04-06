<template>
    <el-card>
        <div slot="header">
            <h2>备案材料上传</h2>
        </div>
        <div class="firm_record_container">
            <div v-if="hasChanged" class="firm_record_side">
                <div v-if="isBeforeChange">变更前</div>
                <div v-else>变更后</div>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="name" label="材料名称" align="left" header-align="left">
                    <template slot-scope="scope">
                        <span
                            v-if="isBeforeChange"
                            :style="scope.row.filePath ? { color: 'blue', cursor: 'pointer' } : {}"
                            @click="checkFile(scope.row, scope.$index)"
                        >{{ scope.row.name }}</span>
                        <span
                            v-else
                            :class="scope.row.checkStatus ? 'checkstatus' : ''"
                            :style="scope.row.filePath ? { color: 'blue', cursor: 'pointer' } : {}"
                            @click="checkFile(scope.row, scope.$index)"
                        >{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" width="350px" label="上传时间" align="center"></el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<script>
import service from '../../../Authentication/api/service'

export default {
    props: {
        tableData: {
            type: Array,
            required: true
        },
        isBeforeChange: {
            type: Number,
            required: true
        },
        hasChanged: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 查看附件选项
        checkFile(row, index) {
            console.log(row)
            // 查看附件功能
            if (row.filePath) {
                const types = ['pdf', 'jpeg', 'jpg', 'png'];
                const body = document.querySelector('body');
                const link = document.createElement('a');
                link.style.display = 'none';
                !types.includes(row.fileType) && (link.download = row.fileName);
                // 查看文件内容 pdf在线预览
                link.href = service.baseUrl + '/api-precursor' + row.filePath;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
                row.checkStatus = false
            } else {
                return this.$message.warning('请稍后重试!')
            }
            if (!this.isBeforeChange) this.$emit('change-record', index)
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../scss/firmreset.scss";
</style>