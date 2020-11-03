<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>四川联通小号</el-breadcrumb-item>
            <el-breadcrumb-item>话单查询</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="12">
                    <span class="demonstration">呼叫时间</span>
                    <el-date-picker
                            v-model="value1"
                            size="mini"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
                    </el-date-picker>
                </el-col>
                <el-col :span="1.5">关键字</el-col>
                <el-col :span="8">
                    <el-input
                            @keyup.enter.native="search"
                            placeholder="根据类型、小号、接听号、备注模糊匹配"
                            clearable
                            v-model="searchVal"
                            size="mini">
                        <el-button
                                slot="append"
                                type="primary"
                                size="mini"
                                style="background-color:  #409EFF;color: white;"
                                icon="el-icon-search"
                                @click="search">
                            查询
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!--<el-table
                :data="scBilledQueryList"
                stripe
                style="width: 100%;margin-top: 18px;"
                @selection-change="handleSelectionChange"
                :default-sort="{prop: 'id', order: 'ascending'}"
                height="350"
                :row-style="{height:'5px'}"
                :cell-style="{padding:'0px'}"
            >-->
            <el-table
                    :row-style="{height:'5px'}"
                    :cell-style="{padding:'0px'}"
                    :data="scBilledQueryList"
                    ref="trumpetTable"
                    @selection-change="handleSelectionChange"
                    stripe
                    :default-sort="{prop: 'id', order: 'ascending'}"
                    style="width: 100%;margin-top: 0px;"
                    height="300"
            >
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column width="80" prop="id" label="callID" sortable></el-table-column>
                <el-table-column width="100" prop="realCalling" label="真实主叫" sortable></el-table-column>
                <el-table-column width="100" prop="realCalled" label="真实被叫" sortable></el-table-column>
                <el-table-column width="120" prop="calledNumber" label="被叫显示号码" sortable></el-table-column>
                <el-table-column width="130" prop="callingNumber" label="主叫拨打的虚号" sortable></el-table-column>
                <el-table-column width="140" prop="startTime" label="开始时间" sortable></el-table-column>
                <el-table-column width="140" prop="connectTime" label="接通时间" sortable></el-table-column>
                <el-table-column width="100" prop="ringingTime" label="振铃时间" sortable></el-table-column>
                <el-table-column width="140" prop="endTime" label="结束时间" sortable></el-table-column>
                <el-table-column width="100" prop="callTime" label="通话时长" sortable></el-table-column>
                <el-table-column width="100" prop="billingTime" label="计费时长" sortable></el-table-column>
                <el-table-column width="100" prop="callState" label="通话状态" sortable></el-table-column>
                <el-table-column width="100" prop="recordingAddress" label="录音地址" sortable></el-table-column>
                <el-table-column width="140" prop="callCharges" label="本次通话费用(元)" sortable></el-table-column>
                <el-table-column width="100" prop="callingRegion" label="主叫地区" sortable></el-table-column>
                <el-table-column width="100" prop="calledRegion" label="被叫地区" sortable></el-table-column>
                <el-table-column width="100" prop="extensionField" label="扩展字段" sortable></el-table-column>
                <el-table-column width="140" prop="storageTime" label="入库时间" sortable></el-table-column>
            </el-table>
            <el-row>
                <el-col :offset="14">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryInfo.pageNum"
                            :page-sizes="[10, 20, 50, 100,1000]"
                            :page-size="queryInfo.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "scBilledQuery",
        data() {
            return {
                total: '',
                queryInfo: {
                    pageNum: '',
                    pageSize: '',
                },
                searchVal: '',
                value1: [],
                scBilledQuery: {
                    id: '',
                    realCalling: '',
                    realCalled: '',
                    calledNumber: '',
                    callingNumber: '',
                    startTime: '',
                    connectTime: '',
                    ringingTime: '',
                    endTime: '',
                    callTime: '',
                    billingTime: '',
                    callState: '',
                    recordingAddress: '',
                    callCharges: '',
                    callingRegion: '',
                    calledRegion: '',
                    extensionField: '',
                    storageTime: '',
                },
                scBilledQueryList: [],
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                if (this.value1 !== "" || this.searchVal !== "") {
                    this.queryInfo.pageNum = 1;
                }
                this.$http.get("http://183.215.190.121:9999/scBilled/list?connectTime=" + this.value1 + "&pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal).then(res => {
                    this.scBilledQueryList = res.data.list;
                    this.total = res.data.total;
                    this.queryInfo.pageSize = res.data.pageSize;
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.search();
            },
            handleCurrentChange(newPage) {
                /*if(this.value1===""||this.searchVal===""){
                  this.queryInfo.pageNum = newPage;
                }else{
                  this.queryInfo.pageNum = 1;
                }*/
                this.queryInfo.pageNum = newPage;
                this.search();
            },
        },
        created() {
            this.search();
        }
    }
</script>

<style scoped>

</style>