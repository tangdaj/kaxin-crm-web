<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号维护</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
              @keyup.enter.native="getAccountList"
              placeholder="根据登录名称、姓名、角色模糊匹配"
              clearable
              v-model="searchVal"
              size="mini"
          >
            <el-button
                slot="append"
                icon="el-icon-search"
                style="background-color: #409EFF;color: white;"
                size="mini"
                @click="getAccountList"
            >查询
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" size="mini" @click="addDialogVisible = true"
          >新增
          </el-button
          >
        </el-col>
      </el-row>
      <el-table
          :row-style="{height:'5px'}"
          :cell-style="{padding:'0px'}"
          :data="accountList"
          stripe
          :default-sort="{prop: 'id', order: 'ascending'}"
          style="width: 100%;margin-top: 0px;"
          height="350">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column prop="id" label="账号ID"></el-table-column>
        <el-table-column prop="username" label="登录账号"></el-table-column>
        <el-table-column prop="aname" label="姓名"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.role==0">普通用户</el-tag>
            <el-tag v-if="scope.row.role==1">超级管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creatTime" width="180" label="创建时间"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column width="200" label="操作">
          <!-- 编辑账号 -->
          <!-- @click="showEditDialog(scope.row.id)"   @click="deleteUser(scope.row.id)"-->
          <template v-slot="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                @click="getAccountById(scope.row.id)"
                size="mini"
            ></el-button>
            <!-- 删除账号 -->
            <el-button
                type="danger"
                @click="deleteUser(scope.row.id)"
                icon="el-icon-delete"
                size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
           :page-sizes="[10, 20, 50, 100,1000]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加账号对话框 -->
    <el-dialog
        title="添加账户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
    >
      <el-form
          :model="addAccountForm"
          ref="addUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item label="登录账号">
          <el-input size="mini" v-model="addAccountForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input size="mini" v-model="addAccountForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input size="mini" v-model="addAccountForm.aname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input size="mini" v-model="addAccountForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select size="mini" v-model="addAccountForm.role">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="普通用户" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
              size="mini"
              type="textarea"
              :rows="5"
              placeholder="请输入备注信息"
              v-model="addAccountForm.remarks">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addAccount">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改账户对话框 -->
    <el-dialog
        title="修改账户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <el-form
          :model="editAccountForm"
          ref="addUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item label="登录账号">
          <el-input size="mini" v-model="editAccountForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input size="mini" v-model="editAccountForm.aname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input size="mini" v-model="editAccountForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select size="mini" v-model="editAccountForm.role">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="普通用户" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
              size="mini"
              type="textarea"
              :rows="5"
              placeholder="请输入备注信息"
              v-model="editAccountForm.remarks">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editAccount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AccountMaintenance",
  data() {
    return {
      searchVal: '',
      addDialogVisible: false,
      editDialogVisible: false,
      addAccountForm: {
        id: '',
        username: '',
        password: '',
        aname: '',
        role: '',
        telephone: '',
        creatTime: '',
        remarks: '',
      },
      editAccountForm: {
        id: '',
        username: '',
        password: '',
        aname: '',
        role: '',
        creatTime: '',
        remarks: '',
      },
      accountList: [],
      total: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
    }
  },
  methods: {
    getAccountList() {
      let pagenum = this.queryInfo.pagenum;
      let pagesize = this.queryInfo.pagesize;
      let searchVal = this.searchVal;
      if(searchVal!==""){
        this.queryInfo.pageNum = 1;
      }
      this.$http.get("http://183.215.190.121:9999/account/search?pageNum=" + pagenum + "&pageSize=" + pagesize + "&searchVal=" + searchVal).then(res => {
        this.accountList = res.data.list;
        this.total = res.data.total;
        this.queryInfo.pagesize = res.data.pageSize;
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getAccountList();
    },
    handleCurrentChange(newPage) {
      if(this.searchVal===""){
        this.queryInfo.pagenum = newPage;
      }else{
        this.queryInfo.pagenum = 1;
      }
      this.getAccountList();
    },
    showEditDialog(id) {
      alert(id);
    },
    deleteUser(id) {
      alert(id);
    },
    addAccount() {
      this.$http.post("http://183.215.190.121:9999/account/saveAccount", this.addAccountForm).then(res => {
        if (res.data > 0) {
          this.$message.success("保存成功");
          this.getAccountList();
          this.addDialogVisible = false;
        } else {
          this.$message.error("新增失败");
          this.dialogVisible = false;
          this.addDialogVisible = false;
        }
      })
    },
    getAccountById(id) {
      this.editDialogVisible = true;
      this.$http.get(`http://183.215.190.121:9999/account/findById/${id}`).then(res => {
        this.editAccountForm = res.data;
      })
    },
    editAccount() {
      this.$http.put("http://183.215.190.121:9999/account/updateAccount", this.editAccountForm).then(res => {
        if (res.data > 0) {
          this.$message.success("修改成功");
          this.editDialogVisible = false;
          this.getAccountList();

        } else {
          this.$message.error("修改失败");
          this.editDialogVisible = false;
          this.editDialogClosed();
        }
      })
    },
    editDialogClosed() {
      this.editDialogVisible = false;
      this.$refs.editUserFormRef.resetFields();
    },
    addDialogClosed() {
      this.addDialogVisible = false;
      this.$refs.addUserFormRef.resetFields()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.editDialogVisible = false;
    }
  },
  created() {
    this.getAccountList();
  }
}
</script>

<style scoped>

</style>