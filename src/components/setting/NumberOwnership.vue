<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>号码归属维护</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="运营商">
          <el-select style="width: 80px;" size="mini" v-model="operator" placeholder="全部">
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
              placeholder="根据区号、归属地、号段模糊匹配"
              clearable
              v-model="searchVal"
              size="mini"
              @keyup.enter.native="getList"
          >
            <el-button
                slot="append"
                type="primary"
                size="mini"
                style="background-color:  #409EFF;color: white;"
                icon="el-icon-search"
                @click="getList"
            >查询
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="success"
              style="margin-top: 8px;"
              size="mini"
              @click="addDialogVisible = true"
          >新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
          :row-style="{height:'5px'}"
          :cell-style="{padding:'0px'}"
          :data="tableList"
          ref="trumpetTable"
          @selection-change="handleSelectionChange"
          stripe
          :default-sort="{prop: 'id', order: 'ascending'}"
          style="width: 100%;margin-top: 0px;"
          height="350">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column sort-orders="" width="100" fixed prop="id" label="ID"></el-table-column>
        <el-table-column width="150" prop="areaCode" label="区号"></el-table-column>
        <el-table-column width="150" prop="belongingTo" label="归属地"></el-table-column>
        <el-table-column width="150" prop="themRoughly" label="号段"></el-table-column>
        <el-table-column width="150" prop="operator" label="运营商"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="160">
          <template slot-scope="scope">
            <el-button @click="openUpdateNumber(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteNumber(scope.row.id)" type="text" size="small">删除</el-button>
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
          :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
        title="添加归属维护"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
    >
      <el-form
          :model="addForm"
          ref="addNumberFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item pl label="区号">
          <el-input aria-placeholder="全国统一行政区号" v-model="addForm.areaCode"></el-input>
        </el-form-item>
        <el-form-item label="归属地">
          <el-input v-model="addForm.belongingTo"></el-input>
        </el-form-item>
        <el-form-item label="号段">
          <el-input v-model="addForm.themRoughly"></el-input>
        </el-form-item>
        <el-form-item label="运营商">
          <el-select style="width: 100px;" size="mini" v-model="addForm.operator" placeholder="请选择">
            <el-option v-for="o in operators"
                       :key="o.value"
                       :label="o.label"
                       :value="o.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNumber">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
        title="修改归属维护"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <el-form
          :model="editForm"
          ref="editNumberFormRef"
          label-width="70px"
          class="demo-ruleForm"
      >
        <el-form-item pl label="区号">
          <el-input v-model="editForm.areaCode"></el-input>
        </el-form-item>
        <el-form-item label="归属地">
          <el-input v-model="editForm.belongingTo"></el-input>
        </el-form-item>
        <el-form-item label="号段">
          <el-input v-model="editForm.themRoughly"></el-input>
        </el-form-item>
        <el-form-item label="运营商">
          <el-select style="width: 100px;" size="mini" v-model="editForm.operator" placeholder="请选择">
            <el-option v-for="o in operators"
                       :key="o.value"
                       :label="o.label"
                       :value="o.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="运营商">
           <el-input v-model="editForm.operator"></el-input>
         </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateNumber">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NumberOwnership",
  data() {
    return {
      operators: [{
        label: "中国移动",
        value: 1
      },
        {
          label: "中国联通",
          value: 2
        },
        {
          label: "中国电信",
          value: 3
        }
      ],
      total: '',
      queryInfo: {
        query: '',
        pageNum: '',
        pageSize: ''
      },
      operator: '',
      addDialogVisible: false,
      editDialogVisible: false,
      tableList: [{
        id: '',
        areaCode: '',
        belongingTo: '',
        themRoughly: '',
        operator: '',
      }],
      searchVal: '',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '移动'
      }, {
        value: '2',
        label: '联通'
      },
        {
          value: '3',
          label: '电信'
        }
      ],
      addForm: {
        id: '',
        areaCode: '',
        belongingTo: '',
        themRoughly: '',
        operator: '',
      },
      editForm: {
        id: '',
        areaCode: '',
        belongingTo: '',
        themRoughly: '',
        operator: '',
      },
    }
  },
  methods: {
    getList() {
      if(this.searchVal!==""||this.operator!==""){
        this.queryInfo.pageNum = 1;
      }
      this.$http.get("http://183.215.190.121:9999/number/search?pageNum=" + this.queryInfo.pageNum + "&pageSize=" + this.queryInfo.pageSize + "&searchVal=" + this.searchVal + "&operator=" + this.operator).then(res => {
        this.tableList = res.data.list;
        //console.log(this.tableList);
        this.total = res.data.total;
        this.queryInfo.pageSize = res.data.pageSize;
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getList();
    },
    handleCurrentChange(newPage) {
      /*if(this.searchVal===""||this.operator===""){
        this.queryInfo.pageNum = newPage;
      }else{
        this.queryInfo.pageNum = 1;
      }*/
      this.queryInfo.pageNum = newPage;
      this.getList();
    },
    addDialogClosed() {
      //this.$refs.addNumberFormRef.resetFields();
      this.addForm.id = '',
          this.addForm.areaCode = '',
          this.addForm.belongingTo = '',
          this.addForm.themRoughly = '',
          this.addForm.operator = '',
          this.addDialogVisible = false;
    },
    editDialogClosed() {
      this.$refs.editNumberFormRef.resetFields();
      this.editDialogVisible = false;
    },
    openUpdateNumber(row) {
      this.editForm.id = row.id;
      this.editForm.areaCode = row.areaCode;
      this.editForm.belongingTo = row.belongingTo;
      this.editForm.themRoughly = row.themRoughly;
      this.editForm.operator = row.operator;
      this.editDialogVisible = true;
    },
    updateNumber() {
      this.$http.put("http://183.215.190.121:9999/number/updateNumber", this.editForm).then(res => {
        if (res.data > 0) {
          this.$message.success("修改成功");
          this.editDialogVisible = false;
          this.getList();
        } else {
          this.$message.error("修改失败");
          this.editDialogVisible = false;
        }
      })
    },
    deleteNumber(id) {
      let tips = confirm("确认要删除吗？");
      if (tips) {
        this.$http.delete(`http://183.215.190.121:9999/number/deleteNumber/${id}`).then(res => {
          if (res.data > 0) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.error("删除失败")
          }
        })
      }
    },
    addNumber() {
      this.$http.post("http://183.215.190.121:9999/number/saveNumber", this.addForm).then(res => {
        if (res.data > 0) {
          this.$message.success("添加成功");
          this.addDialogClosed();
          this.getList();
        } else {
          this.$message.error("添加失败");
          this.addDialogVisible = false;
        }
      })
    },
  },
  created() {
    this.getList();
  }
}
</script>

<style scoped>

</style>