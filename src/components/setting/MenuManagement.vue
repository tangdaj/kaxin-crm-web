<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">系统配置</a></el-breadcrumb-item>
          <el-breadcrumb-item>菜单配置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-card>

      <el-button type="success" size="mini"
      >新增
      </el-button
      >
      <el-button type="success" size="mini"
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
        <el-table-column prop="username" label="菜单名称"></el-table-column>
        <el-table-column prop="aname" label="图标"></el-table-column>
        <el-table-column prop="aname" label="类型"></el-table-column>
        <el-table-column prop="aname" label="路由"></el-table-column>
        <el-table-column prop="aname" label="备注"></el-table-column>
        <el-table-column prop="aname" label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableList: [],
    }
  }
}
</script>

<style scoped>

</style>
