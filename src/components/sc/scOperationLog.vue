<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>四川联通小号</el-breadcrumb-item>
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
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%;margin-top: 0px;"
          height="350">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column width="80" prop="id" label="ID"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="trumpet" label="小号"></el-table-column>
        <el-table-column prop="answerNo" label="接听号"></el-table-column>
        <el-table-column prop="serialNumber" label="流水号"></el-table-column>
        <el-table-column prop="callback" label="回调"></el-table-column>
        <el-table-column width="150" prop="stopTime" label="截止时间"></el-table-column>
        <el-table-column width="150" prop="commitTime" label="提交时间"></el-table-column>
        <el-table-column prop="logState" label="状态">
          <template v-slot="scope">
            <span v-if="scope.row.logState==0" style="color: red;">失败</span>
            <span v-if="scope.row.logState==1" style="color: green;">成功</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[10, 20, 50, 100,1000]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "scOperationLog",
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
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    search() {
      if(this.searchVal!==""){
        this.queryInfo.pageNum = 1;
      }
      this.$http.get("http://183.215.190.121:9999/scOpera/list?commitTime=" + this.value1 + "&pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal).then(res => {
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
     /* if(this.searchVal===""){
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