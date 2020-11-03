<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>云南联通小号</el-breadcrumb-item>
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
            <el-table
                    :data="ynBilledQueryList"
                    style="width: 100%;margin-top: 18px;"
                    stripe
                    @selection-change="handleSelectionChange"
                    height="350"
                    :row-style="{height:'5px'}"
                    :cell-style="{padding:'5px'}">
                <el-table-column
                        type="selection"
                        width="55"
                >
                </el-table-column>
                <el-table-column width="140" prop="phoneNumberA" label="接听号码" sortable></el-table-column>
                <el-table-column width="140" prop="phoneNumberB" label="呼入号码" sortable></el-table-column>
                <el-table-column width="140" prop="phoneNumberX" label="中间小号" sortable></el-table-column>
                <el-table-column width="160" prop="startTime" label="开始" sortable></el-table-column>
                <el-table-column width="160" prop="releaseTime" label="结束" sortable></el-table-column>
                <el-table-column width="120" prop="duration" label="时长" sortable></el-table-column>
                <el-table-column width="160" prop="storageTime" label="入库时间" sortable></el-table-column>
            </el-table>
            <el-row>
                <el-col style="margin-top: 18px">
                    <el-button type="danger" size="mini" @click="batchDelete(multipleSelection)">批量删除</el-button>
                    <el-button @click="batchExport" style="margin-left: 0px;border-left: white;" type="success"
                               size="mini">批量导出
                    </el-button>
                </el-col>
                <el-col :offset="10" style="margin-top: -48px">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryInfo.pageNum"
                            :pager-count="5"
                            :page-sizes="[10,50,100,200,300]"
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
        name: "ynBilledQuery",
        data() {
            return {
                total: '',
                queryInfo: {
                    pageNum: '',
                    pageSize: '',
                },
                searchVal: '',
                ids:[],
                value1: [],
                selectedIDs: [],
                multipleSelection: [],
                ynBilledQuery: {
                    id: '',
                    phoneNumberA: '',
                    phoneNumberB: '',
                    phoneNumberX: '',
                    startTime: '',
                    releaseTime: '',
                    duration: '',
                    storageTime: '',
                },
                ynBilledQueryList: [],
            }
        },
        methods: {
            search() {
                if(this.value1!==""||this.searchVal!==""){
                    this.queryInfo.pageNum = 1;
                }
                this.$http.get("http://183.215.190.121:9999/ynBilled/list?startTime=" + this.value1 + "&pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal).then(res => {
                    this.ynBilledQueryList = res.data.list;
                    this.total = res.data.total;
                    this.queryInfo.pageSize = res.data.pageSize;
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.search();
            },
            handleCurrentChange(newPage) {
               /* if(this.value1 ===""||this.searchVal===""){
                    this.queryInfo.pageNum = newPage;
                }else{
                    this.queryInfo.pageNum = 1;
                }*/
                this.queryInfo.pageNum = newPage;
                this.search();
            },
            handleSelectionChange(val) {
                this.ids=[];
                this.multipleSelection = val;
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    this.ids.push(this.multipleSelection[i].id);
                }
            },
            batchDelete(multipleSelection) {
                for (let i = 0; i < multipleSelection.length; i++) {
                    this.selectedIDs.push(multipleSelection[i].id)
                }
                if (this.selectedIDs.length == 0) {
                    this.$message.warning('请选择要删除的数据')
                } else {
                    this.$confirm('确认删除？')
                        .then(() => {
                            this.$http.get('http://183.215.190.121:9999/ynBilled/batchDelete?ids=' + this.selectedIDs)
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
            //导出
            batchExport() {
                if (this.ids == null) {
                    this.$message.error("请选择要导出的数据");
                    return;
                }
                this.$http.get("http://183.215.190.121:9999/export/batchexportYnBilledQuery?startTime=" + this.value1+"&searchVal="+this.searchVal, {responseType: 'blob'}).then((res) => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    let num = ''
                    for (let i = 0; i < 10; i++) {
                        num += Math.ceil(Math.random() * 10)
                    }
                    link.setAttribute('download', '话单详情表_' + num + '.xlsx')
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            },
        },
        created() {
            this.search();
        }
    }
</script>

<style scoped>

</style>