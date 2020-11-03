<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="success" size="mini"
      >新增
      </el-button
      >
      <el-button type="primary" size="mini"
      >刷新
      </el-button
      >
      <el-table
          :row-style="{height:'5px'}"
          :cell-style="{padding:'0px'}"
          :data="tableList"
          stripe
          :default-sort="{prop: 'id', order: 'ascending'}"
          style="width: 100%;margin-top: 0px;"
          height="350">
        <el-table-column prop="id" label="菜单ID"></el-table-column>
        <el-table-column prop="username" label="角色名称"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作"></el-table-column>
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

    <!-- 添加用户对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
    >
      <el-form
          :model="addUserForm"
          ref="addUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="addUserForm.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addUserForm.upwd"></el-input>
        </el-form-item>
        <el-form-item label="访问受限ID">
          <el-input v-model="addUserForm.accessRestricedIp"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="addUserForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addUserForm.tbRole">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="普通用户" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <el-form
          :model="editUserForm"
          ref="editUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.uname" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="editUserForm.telephone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableList: [],
      search: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [
        {
          accessRestricedIp: '',
          creatTime: '',
          id: '',
          tbRole: '',
          tbState: '',
          telephone: '',
          uname: '',
          upwd: '',
        }
      ],
      editState: {
        id: '',
        tbState: '',//状态
      },
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        uname: '',
        upwd: '',
        tbRole: '',
        telephone: '',
        accessRestricedIp: '',
      },
      editUserForm: {
        uname: '',
        upwd: '',
        telephone: ''
      },
      setRoleDialogVisible: false,
      userInfo: '',
      rolesList: [],
      selectRoleId: ''
    }
  },
  methods: {
    getUserList() {
      this.$http.get('http://183.215.190.121:9999/user/list?pageNum=' + this.queryInfo.pagenum + "&search=" + this.search, {}).then((res) => {
        this.userlist = res.data.list
        this.total = res.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    userStateChanged(userinfo) {
      this.editState.id = userinfo.id
      if (userinfo.tbState == true) {
        this.editState.tbState = 1
      } else {
        this.editState.tbState = 0
      }
      this.$http.put(
          `http://183.215.190.121:9999/user/state`, this.editState
      ).then(res => {
        if (res.status != 201) {
          this.$message.error('获取信息失败！')
        }
        this.getUserList();
      })

    },
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    addUser() {
      this.$http.post(
          `http://183.215.190.121:9999/user/saveUser`, this.addUserForm
      ).then(res => {
        if (res.status != 200) {
          this.$message.error('新增失败！')
        }
        this.$message.success('添加用户成功!')
        this.dialogVisible = false;
      })
      this.getUserList();
    },
    async showEditDialog(id) {
      this.$http.get(`http://183.215.190.121:9999/user/findById/${id}`).then(res => {
        if (res.status !== 200) {
          this.$message.error('查询用户失败！')
        }
        this.editUserForm = res.data;
        this.editDialogVisible = true;
      })
    },
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    editUser() {
      this.$http.put(`http://183.215.190.121:9999/user/updateUser`, this.editUserForm).then(res => {
        if (res.status !== 200) {
          this.$message.error('修改用户信息失败！');
        }
        this.$message.success('修改成功！');
        this.editDialogVisible = false;
        this.getUserList();
      })
    },
    deleteUser(id) {
      let tip = confirm("确认删除吗？");
      if (tip) {
        this.$http.delete(`http://183.215.190.121:9999/user/deleteUser/${id}`).then(res => {
          if (res.status !== 200) {
            this.$message.error("删除失败!")
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
          }
        })
      }
    },
  },

  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped></style>
