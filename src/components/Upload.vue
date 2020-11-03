<template>
  <div>
    <el-button class="btn-upload" type="primary" @click="handleUpdate">上传题库</el-button>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
    >
			<span>
				<el-upload class="upload-demo"
                   ref="upload"
                   drag
                   action="http://183.215.190.121:9999/upload/upload1"
                   multiple
                   :auto-upload="false"
                   :limit="5"
                   :on-success="handleFilUploadSuccess"
                   :on-remove="handleRemove"
        >
					<i class="el-icon-upload"></i>

					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传 Excel 文件，且不超过500kb</div>
				</el-upload>
			</span>
      <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleUpload">确 定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleRemove(file,fileList) {
      console.log(file,fileList);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传成功时的函数
    handleFilUploadSuccess (res,file,fileList) {
      console.log(res,file,fileList)
      this.$message.success("上传成功")
    },
    handleUpdate () {
      this.dialogVisible = true;
    },
    // 处理文件上传的函数
    handleUpload () {
      // console.log(res,file)
      this.submitUpload()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped="scoped">
.btn-upload {
  top: 70px;
  right: 40px;
  position: fixed;
  z-index: 100;
  border-radius: 30px;
  box-shadow: 0 2px 12px 0 rgba(91, 156, 255, 0.9)
}

.el-upload {
  margin: 0px;
}
</style>