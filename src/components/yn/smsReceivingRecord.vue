<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>四川联通小号</el-breadcrumb-item>
      <el-breadcrumb-item>短信接收记录</el-breadcrumb-item>
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
        <el-form-item label="关键字">
          <el-input
              placeholder="根据类型、小号、接听号、备注模糊匹配"
              clearable
              style="width: 350px;margin-top: 7px;"
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
      </el-form>
      <el-table
          :row-style="{height:'5px'}"
          :cell-style="{padding:'0px'}"
          :data="scOperationLogList"
          :default-sort="{prop: 'id', order: 'ascending'}"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%;margin-top: 0px;"
          height="350">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column width="80" prop="id" label="ID"></el-table-column>
        <el-table-column prop="privacyNumber" label="隐私号码"></el-table-column>
        <el-table-column prop="centreNumber" label="中间小号"></el-table-column>
        <el-table-column prop="receiveNumber" label="发送号码"></el-table-column>
        <el-table-column prop="callId" label="呼叫ID"></el-table-column>
        <el-table-column prop="bindId" label="绑定ID"></el-table-column>
        <el-table-column prop="sendTime" label="发送时间"></el-table-column>
      </el-table>
      <el-row>
        <el-col :span="4">
          <el-button @click="batchDelete" style="margin-top: 18px;" size="mini" type="danger">批量删除</el-button>
        </el-col>
        <el-col :span="20">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pageNum"
              :page-sizes="[10, 20, 50, 100,1000]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "smsReceivingRecord",
  data() {
    return {
      total: '',
      queryInfo: {
        pageNum: '',
        pageSize: '',
      },
      searchVal: '',
      value1: [],
      scOperationLog: {
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
      scOperationLogList: [],
      multipleSelection: [],
      ids: [],
    }
  },
  methods: {
    batchDelete() {
      let tips = confirm("确认删除吗？");
      if (tips) {
        this.$http.delete(`http://183.215.190.121:9999/smsReceiving/deleteSmsReceiving/${this.ids}`).then(res => {
          if (res.data > 0) {
            this.$message.success("删除成功");
            this.search();
            //location.reload();
          } else {
            this.$message.error("删除失败")
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.ids = [];
      this.multipleSelection = val;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.ids.push(this.multipleSelection[i].id);
      }
    },
    search() {
      if(this.value1!==""||this.searchVal!==""){
        this.queryInfo.pageNum = 1;
      }
      this.$http.get("http://183.215.190.121:9999/smsReceiving/search?startTime=" + this.value1 + "&pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal).then(res => {
        this.scOperationLogList = res.data.list;
        this.total = res.data.total;
        this.queryInfo.pageSize = res.data.pageSize;
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.search();
    },
    handleCurrentChange(newPage) {
    /*  if(this.value1 ===""||this.searchVal===""){
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