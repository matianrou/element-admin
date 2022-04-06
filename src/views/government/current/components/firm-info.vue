<template>
    <el-card>
        <div slot="header">
            <h2>企业基本信息</h2>
        </div>
        <div class="firm_info_container">
            <div v-if="hasChanged" class="firm_info_side">
                <div v-if="isBeforeChange">变更前</div>
                <div v-else>变更后</div>
            </div>
            <div class="firm_info_content">
                <el-descriptions direction="vertical" border>
                    <el-descriptions-item label="企业名称">
                        {{ (isBeforeChange ? (firmInfo.originCorpName || firmInfo.corpName) : firmInfo.corpName) || '暂无数据' }}
                        <el-tag
                            type="success"
                            style="margin-left: 10px"
                            v-if="firmInfo.auditStatus == '1'"
                        >审核通过</el-tag>
                        <el-tag type="warning" style="margin-left: 10px" v-else>未审核</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="社会统一信用代码">{{ firmInfo.creditCode || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item
                        label="经济类型"
                    >{{ dicTranslate(economicTypeList, firmInfo.economicType, 1) }}</el-descriptions-item>
                    <el-descriptions-item
                        label="主要负责人"
                    >{{ (isBeforeChange ? (firmInfo.originLegalPerson || firmInfo.legalPerson) : firmInfo.legalPerson) || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item label="地址">{{ firmInfo.address || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item label="成立日期">{{ firmInfo.establishTime || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item
                        label="生产/经营类型"
                    >{{ firmInfo.corpType == 0 ? '生产类型' : firmInfo.corpType == 1 ? '经营类型' : '生产经营类型' }}</el-descriptions-item>
                    <el-descriptions-item label="从业人数">{{ firmInfo.workerNum || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item label="技术、销售管理人员人数">{{ firmInfo.management || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item label="联系电话">{{ firmInfo.mobile || '暂无数据' }}</el-descriptions-item>
                    <el-descriptions-item label="监管机构">{{ firmInfo.officeName || '暂无数据' }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
    </el-card>
</template>

<script>
import service from '../../../Authentication/api/service'

export default {
    props: {
        firmInfo: {
            type: Object,
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
    async created() {
        await this.getEconomicType();
    },
    data() {
        return {
            economicTypeList: [],
        }
    },
    methods: {
        getEconomicType() {
            return service.getEconomic_type().then(res => {
                if (res && res.status == 200) {
                    const data = res.data.datas
                    this.economicTypeList = data
                }
            })
        },
        dicTranslate(list = [], type = '', flag) {
            let item
            if (flag === 1) {
                item = list.find(item => item.value === type)
            } else {
                item = list.find(item => item.id.toString() === type)
            }
            if (!item) {
                return ''
            } else {
                return item.label
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../scss/firmreset.scss";
</style>