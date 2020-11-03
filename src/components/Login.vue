<template>
  <div class="login_container">
      <div class="login_box">
        <!-- 表单   :rules="LoginFormRules"-->
        <h2 align="center">CRM系统登录</h2>
        <el-form ref="LoginFormRef" :model="loginForm" label-width="0"  class="login_form">
          <el-form-item >
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user" ></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="loginForm.password" @keyup.enter.native="check" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary"  @click="check">登录</el-button>
            <el-button type="danger" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        loginForm:{
          username:'admin',
          password:'123'
        },
       /* LoginFormRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }*/
      }
    },
    methods: {

      /*keyupEnter(){
        document.onkeydown = e =>{
          let body = document.getElementsByTagName('body')[0];
          if (e.keyCode === 13 && e.target.baseURI.match(/inputbook/) && e.target === body) {
            //console.log('enter')
            alert(111)
            this.check();
          }
        }
      },*/
      /*handleAddBook(){
        if(this.validate()){
          alert(1111);
          //this._printQrcode();
          this.check();
        }
      },*/
      resetLoginForm() {
        this.$refs.LoginFormRef.resetFields()
      },
      check(){
        this.$http.get("http://183.215.190.121:9999/account/checkUser?uname="+this.loginForm.username+"&upwd="+this.loginForm.password).then(res=>{
          if(res.data>0){
            this.$router.push({path:'/welcome'});
          }else{
            alert("用户名或密码不正确，请重新输入");
          }
        })
      },
     /* login() {
        this.$refs['LoginFormRef'].validate(async (valid) => {
          if (valid) {
            const {data:res} = await this.$http.post('login',this.loginForm)
            if (res.meta.status==200){
              this.$message({
                message:'登录成功',
                type:'success'
              })
              window.sessionStorage.setItem('token',res.data.token)
              this.$router.push('/home')
            }else{
              this.$message({
                message:res.meta.msg,
                type:'error'
              })
            }
          } else {
            return false
          }
        })
      }*/
    },
  created() {
  /*  let _this = this;
    document.onkeydown = function() {
      let key = window.event.keyCode;
      if (key == 13) {
        _this.check();
      }
    };*/
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #373D41;
  height: 100%;
  background-image: url("../assets/img/2025634.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%)
}

.avatar_box{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content:flex-end;
}
</style>>

