<template>
    <el-card>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" size="small"
             style="width: 500px">
        <el-form-item label="原密码" prop="oldPwd">
            <el-input @blur="checkPassword" type="password" v-model="ruleForm.oldPwd" placeholder="原有账号密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="ruleForm.newPwd" placeholder="新的登录密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPwd">
            <el-input type="password" v-model="ruleForm.checkPwd" placeholder="确认密码，跟新密码一致"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确定修改</el-button>
        </el-form-item>
    </el-form>
    </el-card>
</template>

<script>
    export default {
        name: "EditPassword",
        data() {
            return {
                ruleForm: {
                    oldPwd: '',
                    newPwd: '',
                    checkPwd: ''
                },
                rules: {
                    oldPwd: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    newPwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    checkPwd: [
                        {required: true, message: '请确认新密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            checkPassword() {
                if (this.rules.oldPwd === this.ruleForm.newPwd) {
                    this.$message.error("新旧密码相同，请重新设置");
                }
            },
            editPassword(){
                this.$http.put(`http://183.215.190.121:9999/account/editPassword/${this.ruleForm.newPwd}`).then(res=>{
                    if(res.data>0){
                        this.$message.success("密码修改成功！");
                    }
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？')
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
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>