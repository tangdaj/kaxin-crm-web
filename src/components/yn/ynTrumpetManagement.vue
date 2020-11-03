<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>云南联通小号</el-breadcrumb-item>
            <el-breadcrumb-item>小号管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="绑定日期">
                    <el-date-picker
                            v-model="bindDate"
                            size="mini"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                            v-model="endDate"
                            size="mini"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-form style="margin-top: -18px;" :inline="true" class="demo-form-inline">
                <el-form-item label="ID区间">
                    <el-input v-model="startId" style="width: 100px;" size="mini" placeholder="开始记录ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <span>-</span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="endId" style="width: 100px;" size="mini" placeholder="结束记录ID"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 110px;" size="mini" v-model="trState" placeholder="全部" lable="状态">
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
                            style="margin-top: 8px; width: 350px;"
                            placeholder="根据号码、接听号码、省市、备注模糊匹配"
                            clearable
                            v-model="searchVal"
                            @keyup.enter.native="getList"
                            size="mini"
                    >
                        <el-button
                                slot="append"
                                size="mini"
                                style="background-color: #409EFF;color: white"
                                icon="el-icon-search"
                                @click="getList"
                        >查询
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="margin-top: 9px;" size="mini" @click="addDialogVisible=true" type="success">添加小号
                    </el-button>
                    <el-button
                            size="mini"
                            style="background-color: #409EFF;color: white"
                            icon="el-icon-download"
                            @click="allExport"
                    >导出
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :row-style="{height:'5px'}"
                    :cell-style="{padding:'0px'}"
                    class="tableBox"
                    :data="tableList"
                    ref="trumpetTable"
                    @selection-change="handleSelectionChange"
                    stripe
                    style="width: 100%;margin-top: 0px;"
                    show-overflow-tooltip="true"
                    fit="fit"
                    height="300">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column width="80" fixed prop="id" label="记录ID"></el-table-column>
                <el-table-column width="130" prop="trumpet" label="小号"></el-table-column>
                <el-table-column width="100" prop="provinceCity" label="省市"></el-table-column>
                <el-table-column width="130" prop="answerNumber" label="接听号码"></el-table-column>
                <el-table-column width="160" prop="bindTime" label="绑定日期"></el-table-column>
                <el-table-column width="160" prop="endTime" label="结束日期"></el-table-column>
                <el-table-column width="150" prop="smsControl" label="短信控制">
                    <template slot-scope="scope">
                        <span v-if="scope.row.smsControl=='1'" style="color: orange;">短信转发，不推送</span>
                        <span v-if="scope.row.smsControl=='2'" style="color: orangered;">短信不转发，仅推送</span>
                        <span v-if="scope.row.smsControl=='3'" style="color: green;">短信转发，并推送</span>
                        <span v-if="scope.row.smsControl=='4'" style="color: red;">小号平台缺省</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" prop="trState" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.trState==0" style="color: red;">失败</span>
                        <span v-if="scope.row.trState==1" style="color: green;">绑定成功</span>
                        <span v-if="scope.row.trState==2" style="color: #9a6e3a;">处理中</span>
                        <span v-if="scope.row.trState==3" style="color: dimgray;">暂未绑定</span>
                    </template>
                </el-table-column>
                <el-table-column width="250" prop="bindId" label="绑定ID"></el-table-column>
                <el-table-column width="200" prop="remarks" label="备注"></el-table-column>
                <el-table-column width="310" prop="bindUnbindReasons" label="绑定/解绑失败原因"></el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="160">
                    <template slot-scope="scope">
                        <el-button @click="bindOpen(scope.row)" type="text" size="small">绑定</el-button>
                        <el-button @click="Untie(scope.row)" type="text" size="small">解绑</el-button>
                        <el-button @click="smsSendOpen(scope.row)" type="text" size="small">短信</el-button>
                        <el-button @click="deleteTrumpet(scope.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col style="margin-top: 18px;" :span="14">
                    <el-button @click="importBindDialogVisible = true" type="primary" size="mini">导入绑定</el-button>
                    <el-button @click="batchExport" style="margin-left: 0px;border-left: white;" type="success"
                               size="mini">批量导出
                    </el-button>
                    <el-button @click="batchUnbind" style="margin-left: 0px;border-left: white;" type="warning"
                               size="mini">批量解绑
                    </el-button>
                    <el-button @click="importUnBindDialogVisible = true" style="margin-left: 0px;border-left: white;"
                               type="primary" size="mini">导入解绑
                    </el-button>
                    <el-button @click="unbound" style="margin-left: 0px;border-left: white;" type="primary" size="mini">
                        到期解绑
                    </el-button>
                    <el-button @click="batchSynchronize" style="margin-left: 0px;border-left: white;" type="info"
                               size="mini">
                        批量同步
                    </el-button>
                    <el-button @click="batchDelete" style="margin-left: 0px;border-left: white;" type="danger"
                               size="mini">批量删除
                    </el-button>
                </el-col>
                <el-col :span="10" pull="2">
                    <el-pagination
                            small
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryInfo.pageNum"
                            :pager-count="5"
                            :page-sizes="[10, 50, 100, 500, 1000]"
                            :page-size="queryInfo.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </el-col>
            </el-row>

            <!-- 添加小号对话框 -->
            <el-dialog
                    title="绑定小号"
                    :visible.sync="addDialogVisible"
                    width="50%"
                    @close="addDialogClosed"
            >
                <el-form
                        :model="addTrumpetForm"
                        ref="addUserFormRef"
                        label-width="70px"
                        class="demo-ruleForm"
                >
                    <el-input
                            type="textarea"
                            :rows="10"
                            placeholder="支持多号码新增，多个号码用换行，逗号，竖线任意一种方式分隔"
                            v-model="addTrumpetForm.trumpet">
                    </el-input>
                </el-form>
                <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrumpet">确 定</el-button>
      </span>
            </el-dialog>
            <!-- 绑定小号对话框 -->
            <el-dialog
                    title="绑定小号"
                    :visible.sync="bindDialogVisible"
                    width="50%"
                    @close="bindDialogClosed"
            >
                <el-form
                        :model="bindForm"
                        ref="bindForm"
                        label-width="80px"
                        class="demo-ruleForm"
                        :rules="rules"
                        size="mini"
                >
                    <el-form-item label="接听号码" prop="phoneNumberA">
                        <el-input placeholder="必填,真实号码" v-model="bindForm.phoneNumberA"></el-input>
                    </el-form-item>
                    <el-form-item label="小号号码" prop="phoneNumberX">
                        <el-input v-model="bindForm.phoneNumberX" readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="结束日期" prop="endTime">
                        <el-date-picker type="date" placeholder="结束日期必填" v-model="bindForm.endTime"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="短信控制">
                        <el-select v-model="bindForm.smsMtChannel" placeholder="请选择短信控制方式">
                            <el-option label="短信转发，不推送" value="1"></el-option>
                            <el-option label="短信不转发，仅推送" value="2"></el-option>
                            <el-option label="短信转发，并推送" value="3"></el-option>
                            <el-option label="小号平台缺省" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="bindForm.remarks"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
  <el-button @click="bindDialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="bind('bindForm')">确 定</el-button>
</span>
            </el-dialog>
            <!-- 发送短信对话框 -->
            <el-dialog
                    title="发送短信"
                    :visible.sync="smsDialogVisible"
                    width="50%"
                    @close="smsDialogClosed"
            >
                <el-form
                        :model="smsForm"
                        ref="smsFormRef"
                        label-width="70px"
                        class="demo-ruleForm"
                >
                    <el-form-item label="隐私号码">
                        <el-input v-model="smsForm.phoneNumberA"></el-input>
                    </el-form-item>
                    <el-form-item label="小号号码">
                        <el-input readonly v-model="smsForm.phoneNumberX"></el-input>
                    </el-form-item>
                    <el-form-item label="接收号码">
                        <el-input v-model="smsForm.phoneNumberB"></el-input>
                    </el-form-item>
                    <el-form-item label="短信内容">
                        <el-input type="textarea" v-model="smsForm.smsContent"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
        <el-button @click="smsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="smsSend">确 定</el-button>
      </span>
            </el-dialog>

            <!-- 导入绑定对话框 -->
            <el-dialog
                    title="号码导入"
                    :visible.sync="importBindDialogVisible"
                    width="50%"
                    @close="importBindDialogClosed"
            >
                <form>
                    <input type="file" @change="getFile($event)">
                    <button style="background-color: #0086b3;" class="button button-primary button-pill button-small"
                            @click="submit($event)">提交
                    </button>
                </form>
                <el-button type="text" @click="batchImportModel">批量导入模板下载</el-button>
                <el-button type="text" @click="batchBindModel">批量绑定模板下载</el-button>
                <p style="color: #FF55D4;">【批量导入模板】系统自动根据号段到基础号段表中查找X号对应省市，若基础数据号段不存在，请到系统管理-号码归属维护中维护号段。</p>
                <p style="color: #FF55D4;">
                    【批量绑定】根据导入数据绑定号码，若导入号码在系统中不存在，新增并绑定；若号码已经存在且在系统中已经绑定，跳过不处理；若已存在未绑定，将根据导入数据绑定</p>
                <span slot="footer" class="dialog-footer">
        <!--<el-button @click="importBindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrumpet">确 定</el-button>-->
      </span>
            </el-dialog>

            <!-- 导入解绑对话框 -->
            <el-dialog
                    title="号码导入"
                    :visible.sync="importUnBindDialogVisible"
                    width="50%"
                    @close="importUnBindDialogClosed"
            >
                <form>
                    <input type="file" @change="getFile($event)">
                    <button style="background-color: #0086b3;" class="button button-primary button-pill button-small"
                            @click="submit($event)">提交
                    </button>
                </form>
                <p>支持xls文件，为了不影响导入效率，单次上传建议不超过1000条</p>
                <el-button type="text" @click="batchUnBindModel">批量解绑模板下载</el-button>
                <p style="color: #FF55D4;">【批量解绑】根据导入数据解绑号码，请谨慎操作</p>
                <span slot="footer" class="dialog-footer">
       <!-- <el-button @click="importUnBindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrumpet">确 定</el-button>-->
      </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "ynTrumpetManagement",
        data() {
            return {
                rules: {
                    phoneNumberA: [
                        {required: true, message: '接听号码必填', trigger: 'blur'},
                    ],
                    phoneNumberX: [
                        {required: true, message: '小号号码必填', trigger: 'blur'},
                    ],
                    endTime: [
                        {type: 'date', required: true, message: '结束日期必选', trigger: 'blur'}
                    ],
                },
                file: '',
                addForm: {},
                bindIds: [],
                trumpets: [],
                ids: [],
                startVal: '',
                endVal: '',
                addDialogVisible: false,
                bindDialogVisible: false,
                smsDialogVisible: false,
                importBindDialogVisible: false,
                importUnBindDialogVisible: false,
                bindForm: {
                    id: '',
                    phoneNumberA: '',
                    phoneNumberX: '',
                    bindId: '',
                    trState: '',
                    expiration: '',
                    endTime: '',
                    smsMtChannel: '2',
                    remarks: '',
                    areaCode: '',
                },
                unbindForm: {
                    phoneNumberX: '',
                    bindingId: '',
                },
                smsForm: {
                    phoneNumberA:'',
                    phoneNumberX:'',
                    phoneNumberB: "",
                    smsContent: '',
                },
                smsFormList: [{
                    phoneNumberA:'',
                    phoneNumberX:'',
                    phoneNumberB: "",
                    smsContent: '',
                }],
                queryInfo: {
                    pageNum: '',
                    pageSize: '',
                },
                total: '',
                tableList: [{
                    id: '',
                    trumpet: '',
                    provinceCity: '',
                    answerNumber: '',
                    bindTime: '',
                    endTime: '',
                    smsControl: '',
                    trState: '',
                    bindId: '',
                    remarks: '',
                    bindUnbindReasons: '',
                }],
                addTrumpetForm: {
                    trumpet: '',
                },
                bindDate: '',
                endDate: '',
                searchVal: '',
                trState: '',
                options: [{
                    value: '',
                    label: '全部'
                }, {
                    value: 0,
                    label: '失败'
                }, {
                    value: 1,
                    label: '绑定成功'
                }, {
                    value: 2,
                    label: '处理中'
                }, {
                    value: 3,
                    label: '暂未绑定'
                }],
                multipleSelection: [],
                startId: '',
                endId: '',
                bindList: [{
                    id: '',
                    phoneNumberA: '',
                    phoneNumberX: '',
                    bindId: '',
                    endTime: '',
                    trState: '',
                    expiration: '',
                    smsMtChannel: '',
                    remarks: '',
                    areaCode: '',
                }],
                unbindList: [{
                    phoneNumberX: '',
                    bindingId: ''
                }]
            }
        },
        methods: {
            //到期解绑
            unbound() {
                this.$http.get("http://183.215.190.121:9999/ynTrumpet/unbound").then(res => {
                    if (res.status == 200) {
                        this.$message.success("请求成功！")
                        this.getList();
                    } else {
                        this.$message.error("请求发送失败，请重试");
                    }
                })
            },
            //批量获取id，
            handleSelectionChange(val) {
                this.ids = [];
                this.bindIds = [];
                this.trumpets = [];
                this.multipleSelection = val;
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    this.ids.push(this.multipleSelection[i].id);
                    this.bindIds.push(this.multipleSelection[i].bindId);
                    this.trumpets.push(this.multipleSelection[i].trumpet);
                    //alert(this.multipleSelection[i].trumpet);
                }
            },
            //批量同步
            batchSynchronize() {
                /* this.unbindList = [];
                 for (let i = 0; i < this.trumpets.length; i++) {
                   this.unbindForm.phoneNumberX = this.trumpets[i];
                   this.unbindList.push(this.unbindForm);
                   alert(this.unbindList[i].phoneNumberX);
                 }*/
                /* for (const argument of this.trumpets) {
                   alert(argument);
                 }*/
                if (this.trumpets == null) {
                    this.$message.error("请选择要同步的数据")
                    return;
                }
                this.$confirm('本次操作选中(' + this.trumpets.length + ')条，批量同步是指去对接平台查询号码绑定情况，并以对接平台为准更新本系统绑定关系，是否继续？')
                    .then(() => {
                        this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/queryBinding", this.trumpets).then(res => {
                            console.log(res.data);
                            if (res.status == 200) {
                                this.$message.success("同步请求已受理，请稍后刷新本页查看结果，请勿重复操作！！！");
                                //this.getList();
                            } else {
                                this.$message.error("请求失败");
                            }
                        })
                    })
                    .catch(() => {
                        this.trumpets = [];
                    })

            },
            getFile: function (event) {
                this.file = event.target.files[0];
                console.log(this.file);
            },
            submit: function (event) {
                //阻止元素发生默认的行为
                event.preventDefault();
                let formData = new FormData();
                formData.append("file", this.file);
                this.$http.post('http://183.215.190.121:9999/upload/excelImport', formData)
                    .then(function (res) {
                        //console.log(res.data.response[0].success);
                        if (res.status == 200) {
                            alert("导入成功");
                            document.location.reload();
                        } else {
                            alert("导入失败/小号已全部绑定");
                        }
                    })
                .catch(function (error) {
                  alert("上传失败/小号已全部绑定");
                  console.log(error);
                  document.location.reload();
                });
            },
            batchUnBindModel() {
                this.$http.get("http://183.215.190.121:9999/export/ynBatchUnBind", {responseType: 'blob'}).then((res) => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    let num = ''
                    for (let i = 0; i < 10; i++) {
                        num += Math.ceil(Math.random() * 10)
                    }
                    link.setAttribute('download', '批量导入解绑表_' + num + '.xlsx')
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            },
            batchImportModel() {
                this.$http.get("http://183.215.190.121:9999/export/batchImportModel", {responseType: 'blob'}).then((res) => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    let num = ''
                    for (let i = 0; i < 10; i++) {
                        num += Math.ceil(Math.random() * 10)
                    }
                    link.setAttribute('download', '批量导入表_' + num + '.xlsx')
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            },
            batchBindModel() {
                this.$http.get("http://183.215.190.121:9999/export/batchBindModel", {responseType: 'blob'}).then((res) => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    let num = ''
                    for (let i = 0; i < 10; i++) {
                        num += Math.ceil(Math.random() * 10)
                    }
                    link.setAttribute('download', '批量导入绑定表_' + num + '.xlsx')
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            },
            batchUnbind() {
                if (this.ids == "") {
                    this.$message.error("请选择需要解绑的数据");
                    return;
                }
                /* this.unbindList = [];
                 for (let i = 0; i < this.bindIds.length; i++) {
                   this.unbindForm.bindingId = this.bindIds[i];
                   this.unbindForm.phoneNumberX = this.trumpets[i];
                   this.unbindList.push(this.unbindForm);
                 }
                 for (let i = 0; i < this.trumpets.length; i++) {
                   this.unbindList[i].phoneNumberX = this.trumpets[i];
                 }*/
                this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/unbinding", this.bindIds).then(res => {
                    if (res.status == 200) {
                        /*
                         const resultList = res.data.response;
                        for (const re of resultList) {
                          const msg = re.message;
                          if (re.success == true) {
                            //this.$message.success("解绑成功");
                          } else {
                             this.$message.error(msg);
                          }
                        }*/
                        this.unbindList = [];
                        this.$message.success("请求成功！")
                        this.bindIds = [];
                        this.getList();
                    } else {
                        this.$message.error("请求发送失败，请重试");
                        this.bindIds = [];
                    }
                })
            },
            smsSendOpen(row) {
                if (row.trState != 1 || row.bindId == '') {
                    this.$message.error("当前号码未绑定，请先绑定");
                    return;
                }
                this.smsDialogVisible = true;
                //this.smsForm.trState = row.trState;
                this.smsForm.bindingId = row.bindId;
                this.smsForm.phoneNumberA = row.answerNumber;
                this.smsForm.phoneNumberX = row.trumpet;
            },
            smsSend() {
                this.smsFormList=[];
                this.smsFormList.push(this.smsForm);
                this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/SMS", this.smsFormList).then(res => {
                    if (res.status == 200) {
                        const resultList = res.data.response;
                        for (const re of resultList) {
                            const msg = re.message;
                            if (re.success == true) {
                                this.$message.success("短信发送成功");
                            } else {
                                this.$message.error(msg);
                            }
                        }
                        this.smsDialogClosed();
                    } else {
                        this.$message.error("请求发送失败，请重试");
                        this.smsDialogClosed();
                    }
                })
            },
            batchDelete() {
                //批量删除
                if (this.ids == "") {
                    this.$message.error("请选择小号信息");
                } else {
                    let tips = confirm("确认删除吗？");
                    if (tips) {
                        this.$http.delete(`http://183.215.190.121:9999/ynTrumpet/batchDeleteYnTrumpet/${this.ids}`).then(res => {
                            if (res.data > 0) {
                                this.$message.success("删除成功");
                                this.getList();
                                //location.reload();
                            } else {
                                this.$message.error("删除失败");
                            }
                        })
                    }
                }
            },
            getList() {
                if(this.endId!=="" || this.bindDate!==""||this.endDate!==""||this.startId!==""||this.trState!==""||this.searchVal!==""){
                    this.queryInfo.pageNum = 1;
                }
                this.$http.get("http://localhost:9999/ynTrumpet/search?pageNum=" + this.queryInfo.pageNum
                    + "&pageSize=" + this.queryInfo.pageSize + "&bindTime=" + this.bindDate + "&endTime=" + this.endDate +
                    "&endId=" + this.endId + "&startId=" + this.startId + "&trState=" + this.trState + "&searchVal=" + this.searchVal
                ).then(res => {
                    this.tableList = res.data.list;
                    this.total = res.data.total;
                    this.queryInfo.pageSize = res.data.pageSize;
                })
            },
            addDialogClosed() {
                this.addTrumpetForm.trumpet = '',
                    this.addDialogVisible = false;
            },
            bindDialogClosed() {
                this.$refs.bindFormRef.resetFields();
                this.bindDialogVisible = false;
            },
            smsDialogClosed() {
                this.$refs.smsFormRef.resetFields();
                this.smsDialogVisible = false;
            },
            importUnBindDialogClosed() {
                this.importUnBindDialogVisible = false;
            },
            importBindDialogClosed() {
                this.importBindDialogVisible = false;
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.getList();
            },
            handleCurrentChange(newPage) {
               /* if(this.endId==="" || this.bindDate===""||this.endDate===""||this.startId===""||this.trState===""||this.searchVal===""){
                    this.queryInfo.pageNum = newPage;
                }else{
                    this.queryInfo.pageNum = 1;
                }*/
                this.queryInfo.pageNum = newPage;
                this.getList();
            },
            addTrumpet() {
                this.$http.post("http://localhost:9999/ynTrumpet/saveYnTrumpet", this.addTrumpetForm).then(res => {
                    if (res.data > 0) {
                        this.$message.success("小号添加成功");
                        this.addDialogClosed();
                        this.getList();
                    } else {
                        this.$message.error("小号重复，添加失败")
                        this.addDialogClosed();
                    }
                })
            },
            bindOpen(trumpet) {
                if (trumpet.trState === 1) {
                    this.$message.error("小号已绑定，请勿重复绑定");
                } else {
                    this.bindForm.id = trumpet.id;
                    this.bindForm.areaCode = trumpet.areaCode;
                    //this.trState = trumpet.trState;
                    this.bindForm.phoneNumberX = trumpet.trumpet;
                    this.bindDialogVisible = true;
                }
            },
            bind() {
                this.bindList = [];
                if (this.bindForm.phoneNumberA == '') {
                    this.$message.error("真实号码不能为空");
                    return;
                }
                this.bindList.push(this.bindForm);
                this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/binding", this.bindList).then(res => {
                    if (res.status == 200) {
                        const resultList = res.data.response;
                        for (const re of resultList) {
                            const msg = re.message;
                            //this.bindForm.bindId = re.data.bindingId;
                            if (re.success == true) {
                                /*this.bindForm.trState = 1;
                                this.updateTrumpet();*/
                                this.$message.success("绑定成功");
                                this.getList();
                                this.bindDialogVisible = false;
                            } else {
                                this.$message.error(msg);
                            }
                        }
                        this.bindDialogClosed();
                        this.bindList = [];
                        this.getList();
                    } else {
                        this.$message.error("请求发送失败，请重试");
                        this.bindForm.trState = 0;
                        this.bindDialogClosed();
                    }
                })
            },
            //解绑
            Untie(row) {
                this.bindIds = [];
                if (row.bindId == '') {
                    this.$message.error("当前号码未绑定，请先绑定");
                    return;
                }
                let tips = confirm("确认要解除绑定吗？");
                this.bindIds.push(row.bindId);
                //alert(this.bindIds[0]);
                if (tips) {
                    this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/unbinding", this.bindIds).then(res => {
                        if (res.status == 200) {
                            const resultList = res.data.response;
                            for (const re of resultList) {
                                const msg = re.message;
                                if (re.success == true) {
                                    this.$message.success("解绑成功");
                                } else {
                                    this.$message.error(msg);
                                }
                            }
                            this.unbindList = [];
                            this.getList();
                        } else {
                            this.$message.error("请求发送失败，请重试");
                        }
                    })
                }
                /*console.log(row.trumpet);
                this.unbindList = [];
                this.unbindList.push(this.unbindForm);*/
            },
            deleteTrumpet(id) {
                let tips = confirm("确定要删除吗？");
                if (tips) {
                    this.$http.delete(`http://183.215.190.121:9999/ynTrumpet/deleteYnTrumpet/${id}`).then(res => {
                        if (res.data > 0) {
                            this.$message.success("删除成功！");
                            this.getList();
                        } else {
                            this.$message.error("删除失败！");
                        }
                    })
                }
            },
            //导出
            batchExport() {
                if (this.ids == null) {
                    this.$message.error("请选择要导出的数据");
                    return;
                }
                this.$http.get("http://183.215.190.121:9999/export/exportYnTrumpet?ids=" + this.ids, {responseType: 'blob'}).then((res) => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    let num = ''
                    for (let i = 0; i < 10; i++) {
                        num += Math.ceil(Math.random() * 10)
                    }
                    link.setAttribute('download', '小号详情表_' + num + '.xlsx')
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            },
            //全部导出
            allExport() {
                if (this.ids == null) {
                    this.$message.error("请选择要导出的数据");
                    return;
                }
                this.$http.get("http://183.215.190.121:9999/export/searchYnTrumpetExport?bindTime=" + this.bindDate + "&endTime=" + this.endDate +
                    "&endId=" + this.endId + "&startId=" + this.startId + "&trState=" + this.trState + "&searchVal=" + this.searchVal, {responseType: 'blob'}).then((res) => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    let num = ''
                    for (let i = 0; i < 10; i++) {
                        num += Math.ceil(Math.random() * 10)
                    }
                    link.setAttribute('download', '小号详情表_' + num + '.xlsx')
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            },
        },
        created() {
            this.getList();

        }
    }
</script>

<style scoped>
    /*.upgrade-popup >>> .el-table__row current-row .el-table td {
      padding: 6px 0 !important;
    }*/
    /*.el-table__header tr,
    .el-table__header th {
      padding: 0;
      height: 10px;
    }
    .el-table__body tr,
    .el-table__body td {
      padding: 0;
      height: 10px;
    }*/
    .upgrade-popup >>> .el-table__row current-row .el-table td {
        padding: 6px 0 !important;
    }
</style>
