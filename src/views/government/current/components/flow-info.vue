<template>
    <el-card>
        <div slot="header">
            <h2>生产经营许可备案信息</h2>
        </div>
        <div class="flow_info_container">
            <div v-if="hasChanged" class="firm_info_side">
                <div v-if="isBeforeChange">变更前</div>
                <div v-else>变更后</div>
            </div>
            <div class="flow_info_content">
                <ul class="tabledata">
                    <!-- 表头 -->
                    <li class="title">
                        <span>品种名称</span>
                        <span v-if="isShow == 1">载明产量</span>
                        <span v-if="isShow == 0">购入量</span>
                        <span v-if="isShow == 0">销售量</span>
                        <span v-if="isShow == 0">库存量</span>
                        <span>主要流向</span>
                        <span>销售量</span>
                    </li>
                    <!-- 列表项 -->
                    <div>
                        <li v-for="(item, index) in tableData" :key="index">
                            <div
                                class="dataname"
                                :style="{
                                    lineHeight:
                                        item.chemicalMainFlowList.length != 0
                                            ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                                            : 40 + 'px'
                                }"
                            >{{ item.chemicalName || '暂无数据' }}</div>
                            <div
                                class="dataname"
                                v-if="isShow == 1"
                                :style="{
                                    lineHeight:
                                        item.chemicalMainFlowList.length != 0
                                            ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                                            : 40 + 'px'
                                }"
                            >
                                {{ item.output || '暂无数据' }}
                                <b
                                    v-if="item.output"
                                >{{ '(' + item.unit + ')' }}</b>
                            </div>
                            <div
                                class="dataname"
                                v-if="isShow == 0"
                                :style="{
                                    lineHeight:
                                        item.chemicalMainFlowList.length != 0
                                            ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                                            : 40 + 'px'
                                }"
                            >
                                {{ item.purchaseVolume || '暂无数据' }}
                                <b
                                    v-if="item.purchaseVolume"
                                >{{ '(' + item.unit + ')' }}</b>
                            </div>
                            <div
                                class="dataname"
                                v-if="isShow == 0"
                                :style="{
                                    lineHeight:
                                        item.chemicalMainFlowList.length != 0
                                            ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                                            : 40 + 'px'
                                }"
                            >
                                {{ item.sales || '暂无数据' }}
                                <b
                                    v-if="item.sales"
                                >{{ '(' + item.unit + ')' }}</b>
                            </div>
                            <div
                                class="dataname"
                                v-if="isShow == 0"
                                :style="{
                                    lineHeight:
                                        item.chemicalMainFlowList.length != 0
                                            ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                                            : 40 + 'px'
                                }"
                            >
                                {{ item.inventory || '暂无数据' }}
                                <b
                                    v-if="item.inventory"
                                >{{ '(' + item.unit + ')' }}</b>
                            </div>
                            <div
                                class="contentbd"
                                :style="{
                                    lineHeight:
                                        item.chemicalMainFlowList.length != 0
                                            ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                                            : 40 + 'px'
                                }"
                            >
                                <div v-if="item.chemicalMainFlowList.length != 0">
                                    <span
                                        v-for="(clditem, index) in item.chemicalMainFlowList"
                                        :key="index"
                                    >{{ clditem.area || '暂无数据' }}</span>
                                </div>
                                <div v-else style="height: 40px">
                                    <span>暂无数据</span>
                                </div>
                            </div>
                            <div class="contentbd">
                                <div v-if="item.chemicalMainFlowList.length != 0">
                                    <div
                                        v-for="(clditem, index) in item.chemicalMainFlowList"
                                        :key="index"
                                        class="contentbd"
                                    >
                                        <span>{{ clditem.areaSales + '(' + item.unit + ')' }}</span>
                                    </div>
                                </div>
                                <div v-else style="height: 40px">
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </li>
                    </div>
                    <!-- 暂无数据 -->
                    <li v-show="tableData.length <= 0">
                        <div class="tabledata-mask">
                            <span>暂无数据</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </el-card>
</template>

<script>
export default {
    props: {
        isShow: {
            type: [String, Number],
            required: true
        },
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
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/firmreset.scss";
</style>