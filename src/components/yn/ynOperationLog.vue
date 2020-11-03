<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>云南联通小号</el-breadcrumb-item>
            <el-breadcrumb-item>操作日志</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="提交时间">
                    <el-date-picker
                            v-model="value1"
                            size="mini"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select style="width: 80px;" size="mini" v-model="trState" placeholder="全部" lable="状态">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关键字">
                    <el-input
                            style="margin-top: 7px;width: 350px;"
                            placeholder="根据类型、小号、接听号、备注模糊匹配"
                            clearable
                            v-model="searchVal"
                            size="mini"
                            @keyup.enter.native="search"
                    >
                        <el-button
                                slot="append"
                                type="primary"
                                size="mini"
                                style="background-color:  #409EFF;color: white;"
                                icon="el-icon-search"
                                @click="search"
                        >查询
                        </el-button>
                    </el-input>
                </el-form-item>
                <br>
                <el-table
                        :row-style="{height:'5px'}"
                        :cell-style="{padding:'5px'}"
                        :data="ynOperationLogList"
                        style="width: 100%;margin-top: -3px;"
                        stripe
                        @selection-change="handleSelectionChange"
                        height="350">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column width="100" prop="type" label="类型" show-overflow-tooltip></el-table-column>
                    <el-table-column width="110" prop="trumpet" label="小号"></el-table-column>
                    <el-table-column width="110" prop="answerNo" label="接听号"></el-table-column>
                    <el-table-column width="120" prop="stopTime" label="截止日期"></el-table-column>
                    <el-table-column width="150" prop="commitTime" label="提交时间"></el-table-column>
                    <el-table-column prop="logState" label="状态" width="60">
                        <template v-slot="scope">
                            <span v-if="scope.row.logState==1" style="color: green;">成功</span>
                            <span v-if="scope.row.logState==0" style="color: red;">失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="serialNumber" label="流水号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="callback" label="回调" show-overflow-tooltip></el-table-column>
                </el-table>
                <el-row>
                    <el-col style="margin-top: 18px">
                        <el-button type="danger" size="mini" @click="batchDelete(multipleSelection)">批量删除</el-button>
                    </el-col>
                    <el-col :offset="10" style="margin-top: -48px">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="queryInfo.pageNum"
                                :pager-count="5"
                                :page-sizes="[10, 50, 100, 500, 1000]"
                                :page-size="queryInfo.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "ynOperationLog",
        data() {
            return {
                trState: '',
                total: '',
                queryInfo: {
                    pageNum: '',
                    pageSize: '',
                },
                searchVal: '',
                value1: [],
                selectedIDs: [],
                ynOperationLog: {
                    id: '',
                    type: '',
                    trumpet: '',
                    answerNo: '',
                    serialNumber: '',
                    callback: '',
                    stopTime: '',
                    commitTime: '',
                    logState: '',
                    remarks: '',
                },
                options: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '0',
                    label: '失败'
                }, {
                    value: '1',
                    label: '成功'
                }],
                ynOperationLogList: [
                    {
                        id: '',
                        type: '',
                        trumpet: '',
                        answerNo: '',
                        stopTime: '',
                        commitTime: '',
                        logState: '',
                        remarks: '',
                        serialNumber: '',
                        callback: '',
                    }
                ],
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                if(this.value1!==""||this.trState!==""||this.searchVal!==""){
                    this.queryInfo.pageNum = 1;
                }
                this.$http.get("http://183.215.190.121:9999/YnOperationLog/list?commitTime=" + this.value1 + "&logState=" + this.trState + "&pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal).then(res => {
                    this.ynOperationLogList = res.data.list;
                    this.total = res.data.total;
                    this.queryInfo.pageSize = res.data.pageSize;
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.search();
            },
            handleCurrentChange(newPage) {
               /*if(this.value1 ==="" || this.trState===""||this.searchVal===""){
                   this.queryInfo.pageNum = newPage;
               }else{
                   this.queryInfo.pageNum = 1;
               }*/
                this.queryInfo.pageNum = newPage;
                this.search();
            },
            batchDelete(multipleSelection) {
                for (let i = 0; i < multipleSelection.length; i++) {
                    this.selectedIDs.push(multipleSelection[i].id)
                }
                if (this.selectedIDs.length == 0) {
                    this.$message.warning('请选择要删除的数据')
                } else {
                    this.$confirm('本次操作选中(' + this.selectedIDs.length + ')条，确认删除？')
                        .then(() => {
                            this.$http.get('http://183.215.190.121:9999/YnOperationLog/batchDelete?ids=' + this.selectedIDs)
                                .then(() => {
                                    this.$message.success('删除成功');
                                    this.search();
                                    this.selectedIDs = [];
                                }).catch(() => {
                                this.$message.error('操作失败，请重试')
                                this.selectedIDs = [];
                            })
                        })
                        .catch(() => {
                            this.selectedIDs = [];
                        })
                }
            },
        },
        created() {
            this.search();
        }
    }
</script>

<style scoped>

</style>