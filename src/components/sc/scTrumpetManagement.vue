<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>四川联通小号</el-breadcrumb-item>
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
        <el-form-item label="状态">
          <el-select size="mini" v-model="trState" placeholder="请选择">
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
              placeholder="根据号码、接听号码、省市、备注模糊匹配"
              clearable
              style="margin-top: 8px;"
              v-model="searchVal"
              size="mini"
              @keyup.enter.native="getList"
          >
            <el-button
                slot="append"
                size="mini"
                style="background-color: #409EFF;color: white;"
                icon="el-icon-search"
                @click="getList"
            >查询
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-top: 2px;">
          <el-button size="mini" @click="dialogVisible=true" type="success">添加小号</el-button>
          <el-button @click="importBindDialogVisible = true" size="mini" type="primary">批量导入</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :row-style="{height:'5px'}"
          :cell-style="{padding:'0px'}"
          :data="tableList"
          :default-sort="{prop: 'id', order: 'ascending'}"
          stripe
          style="width: 100%;margin-top: 0px;"
          height="300">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column width="80" fixed prop="id" label="ID"></el-table-column>
        <el-table-column width="100" prop="callNumber" label="号码"></el-table-column>
        <el-table-column width="100" prop="provinceCity" label="省市"></el-table-column>
        <el-table-column width="120" prop="answerNumber" label="接听号码"></el-table-column>
        <el-table-column width="180" prop="bindTime" label="绑定日期"></el-table-column>
        <el-table-column width="180" prop="endTime" label="结束日期"></el-table-column>
        <el-table-column width="100" prop="trState" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.trState==0">失败</span>
            <span v-if="scope.row.trState==1">绑定成功</span>
            <span v-if="scope.row.trState==2">处理中</span>
            <span v-if="scope.row.trState==3">暂未绑定</span>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="remarks" label="备注"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="160">
          <template slot-scope="scope">
            <el-button @click="bindOpen(scope.row.callNumber)" type="text" size="small">绑定</el-button>
            <el-button @click="unbind(scope.row)" type="text" size="small">解绑</el-button>
            <el-button @click="deleteTrumpet(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[10, 20, 50, 100,1000]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @selection-change="handleSelectionChange"
          :total="total"
      ></el-pagination>
      <!-- 添加小号对话框 -->
      <el-dialog
          title="添加小号"
          :visible.sync="dialogVisible"
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
              v-model="addTrumpetForm.callNumber">
          </el-input>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrumpet">确 定</el-button>
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
          <input  type="file" @change="getFile($event)">
          <button style="background-color: #0086b3;" class="button button-primary button-pill button-small" @click="submit($event)">提交</button>
        </form>
       <!-- <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="fileList"
            @on-change="handleChange"
            :http-request="getFile"
        >
          <el-button size="small" type="primary">上传</el-button>
        </el-upload>
         <el-button size="small" type="success" @click="upload">确认上传</el-button>
        -->
        <el-button type="text" @click="Xmodle">仅X号模板下载</el-button>
        <el-button type="text" @click="provinceCityModel">省市区号模板下载</el-button>
        <el-button type="text" @click="batchBangdingModel">批量绑定模板下载</el-button>
        <p style="color: #FF55D4;">【仅X号模板】:系统自动根据号段到基础号段表中查找X号对应省市，可能存在X号号段不在基础表的情况导致X 号匹配归属失败</p>
        <p style="color: #FF55D4;">【省市区号模板】:X号归属以导入为准,省市、区号必填</p>
        <p style="color: #FF55D4;"> 【批量绑定模板】:X号归属以导入为准,省市、区号、绑定号码、到期日期必填，上传成功后自动处理，若导入数据量大，处理时间可能会比较长，若失败，可在“备注”字段查询失败原因</p>
        <!-- <el-upload
             style="display: inline"
             :show-file-list="false"
             :on-success="onSuccess"
             :on-error="onError"
             :before-upload="beforeUpload"
             action="/system/basic/jl/import">
           <el-button size="mini" type="success" :disabled="!enabledUploadBtn" :icon="uploadBtnIcon">{{btnText}}</el-button>
         </el-upload>-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="importBindDialogVisible = false">取 消</el-button>
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
            ref="bindFormRef"
            label-width="70px"
            class="demo-ruleForm"
        >
          <el-form-item label="接听号码">
            <el-input placeholder="必填真实号码" v-model="bindForm.phoneNumberA"></el-input>
          </el-form-item>
          <el-form-item label="小号号码">
            <el-input v-model="bindForm.phoneNumberX"></el-input>
          </el-form-item>
          <!-- <el-form-item label="结束日期">
               <el-date-picker type="date" placeholder="结束日期必填" v-model="bindForm.expiration"
                               style="width: 100%;"></el-date-picker>
           </el-form-item>-->
          <el-form-item label="短信控制">
            <el-select v-model="bindForm.smsMtChannel" placeholder="请选择短信控制方式">
              <el-option label="短信转发，不推送" value="短信转发，不推送"></el-option>
              <el-option label="短信不转发，仅推送" value="短信不转发，仅推送"></el-option>
              <el-option label="短信转发，并推送" value="短信转发，并推送"></el-option>
              <el-option label="小号平台缺省" value="小号平台缺省"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="bindForm.remarks"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="bindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bind">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "scTrumpetManagement",
  data() {
    return {
      file: {},
      fileList: [],
      bindForm: {
        phoneNumberA: '',
        phoneNumberX: '',
        expiration: '',
        smsMtChannel: '',
        remarks: '',
      },
      bindDialogVisible: false,
      dialogVisible: false,
      importBindDialogVisible: false,
      queryInfo: {
        pageNum: '',
        pageSize: '',
      },
      unbindForm: {
        id: '',
        bindingId: '',
        trState: ''
      },
      total: '',
      tableList: [{
        id: '',
        callNumber: '',
        provinceCity: '',
        answerNumber: '',
        bindTime: '',
        endTime: '',
        trState: '',
        remarks: '',
        bindId: ''
      }],
      addTrumpetForm: {
        callNumber: '',
      },
      bindDate: '',
      endDate: '',
      searchVal: '',
      trState: '',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '失败'
      }, {
        value: '1',
        label: '绑定成功'
      }, {
        value: '2',
        label: '处理中'
      }, {
        value: '3',
        label: '暂未绑定'
      }],
    }
  },
  methods: {
    Xmodle(){
      this.$http.get("http://183.215.190.121:9999/export/onlyXNumber", {responseType: 'blob'}).then((res) => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        let num = ''
        for (let i = 0; i < 10; i++) {
          num += Math.ceil(Math.random() * 10)
        }
        link.setAttribute('download', '仅X号表_' + num + '.xlsx')
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
    },
    provinceCityModel(){
      this.$http.get("http://183.215.190.121:9999/export/cityNumberModel", {responseType: 'blob'}).then((res) => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        let num = ''
        for (let i = 0; i < 10; i++) {
          num += Math.ceil(Math.random() * 10)
        }
        link.setAttribute('download', '省市区号表_' + num + '.xlsx')
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
    },
    batchBangdingModel(){
      this.$http.get("http://183.215.190.121:9999/export/scbatchBind", {responseType: 'blob'}).then((res) => {
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
    getFile: function (event) {
      this.file = event.target.files[0];
      console.log(this.file);
    },
    submit: function (event) {
      //阻止元素发生默认的行为
      event.preventDefault();
      let formData = new FormData();
      formData.append("file", this.file);
      this.$http.post('http://183.215.190.121:9999/upload/uploading', formData)
          .then(function (response) {
            alert(response.data);
            window.location.reload();
          })
          .catch(function (error) {
            alert("上传失败");
            console.log(error);
            window.location.reload();
          });
    },
    upload() {
      const fd = new FormData()
      fd.append('filename', this.file)
      const config = {headers: {'Content-Type': 'multipart/form-data'}}
      this.$http.post('/', fd, config
      ).then(res => {
        this.$message.success(res.data.message)
      })
    },
    bindOpen(trumpet) {
      if(trumpet.trState===1){
        this.$message.error("小号已绑定，请勿重复绑定");
      }else{
        this.bindForm.id = trumpet.id;
        this.trState = trumpet.trState;
        //this.bindForm.phoneNumberX = trumpet;
        this.bindDialogVisible = true;
      }
    },
    bind() {
      this.bindList=[];
      this.bindList.push(this.bindForm)
      this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/binding", this.bindList).then(res => {
        if (res.status === 200) {
          const resultList = res.data.response;
          for (const re of resultList) {
            const msg = re.message;
            this.bindForm.bindId = re.data.bindingId;
            this.bindForm.phoneNumberX = re.data.phoneNumberX;
            console.log(re.data.bindingId);
            if (re.success==true){
              this.bindForm.trState = 1;
              //this.updateTrumpet();
              this.$message.success("绑定成功");
              this.bindDialogClosed();
            }else{
              this.$message.error(msg);
            }
          }
          this.bindList=[];
        } else {
          this.$message.error("请求发送失败，请重试");
          this.bindForm.trState = 0;
          this.bindDialogClosed();
        }
      })
    },
    //解绑
    Untie(row) {
      if(row.trState !=1 || row.bindId == ''){
        this.$message.error("当前号码未绑定，请先绑定");
        return;
      }
      this.unbindForm.bindingId = row.bindId;
      this.unbindList=[];
      this.unbindList.push(this.unbindForm);
      this.$http.post("http://183.215.190.121:9999/bas/api/query/request.json/ax/unbinding", this.unbindList).then(res => {
        if (res.status === 200) {
          const resultList = res.data.response;
          for (const re of resultList) {
            const msg = re.message;
            if (re.success==true){
              this.bindForm.trState = 3;
              this.bindForm.bindId='';
              //this.updateTrumpet();
              this.$message.success("解绑成功");
            }else{
              this.$message.error(msg);
            }
          }
          this.unbindList=[];
        } else {
          this.$message.error("请求发送失败，请重试");
        }
      })
    },
    bindDialogClosed() {
      this.$refs.bindFormRef.resetFields();
      this.bindDialogVisible = false;
    },
    importBindDialogClosed() {
      this.importBindDialogVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      if(this.queryInfo.pageSize!==""|| this.searchVal!==""||this.trState!==""|| this.endDate!=="" || this.bindDate!==""){
        this.queryInfo.pageNum = 1;
      }
      this.$http.get("http://183.215.190.121:9999/scTrumpet/search?pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal + "&trState=" + this.trState + "&endTime=" + this.endDate + "&bindTime=" + this.bindDate).then(res => {
        this.tableList = res.data.list;
        this.total = res.data.total;
        this.queryInfo.pageSize = res.data.pageSize;
        console.log(this.tableList);
      })
    },
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getList();
    },
    handleCurrentChange(newPage) {
     /* if(this.queryInfo.pageSize===""|| this.searchVal===""||this.trState===""|| this.endDate==="" || this.bindDate===""){
        this.queryInfo.pageNum = newPage;
      }else{
        this.queryInfo.pageNum = 1;
      }*/
      this.queryInfo.pageNum = newPage;
      this.getList();
    },
    addTrumpet() {
      this.$http.post("http://183.215.190.121:9999/scTrumpet/saveTrumpet", this.addTrumpetForm).then(res => {
        if (res.data > 0) {
          this.$message.success("添加成功");
          this.getList();
          this.dialogVisible = false;
        } else {
          this.$message.error("添加失败");
          this.dialogVisible = false;
        }
      })
    },
    deleteTrumpet(id) {
      let tips = confirm("确定要删除吗？");
      if (tips) {
        this.$http.delete(`http://183.215.190.121:9999/scTrumpet/deleteTrumpet/${id}`).then(res => {
          if (res.data > 0) {
            this.$message.success("删除成功！");
            this.getList();
          } else {
            this.$message.error("删除失败！");
          }
        })
      }
    }
  },
  created() {
    this.getList();
  }
}
</script>

<style scoped>

</style>