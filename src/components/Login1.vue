<template>
  <div class="signin-form">
    <h3 class="sign-title">ticket-sys 登录</h3>
    <div>
      <el-form :model="loginForm" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              autocomplete="off"
              placeholder="用户名"
              prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" id="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {mapMutations} from "vuex";
export default {
  name: 'login',
  data() {
    return {
      loginForm:{
        username:'',
        password:''
      },
      userToken:'',
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    submitForm() {
      let v=this;
      this.$http({
        method: 'post',
        url: 'http://183.215.190.121:9999/user/login',
        data:{
          'username':v.loginForm.username,
          'password':v.loginForm.password
        }
      }).then(function(res){
        console.log(res.data);
        v.userToken = 'Bearer ' + res.data.token;
        // 将用户token保存到vuex中
        v.changeLogin({ Authorization:v.userToken });
        v.$router.push('/home');
        v.$message('登录成功');
      }).catch(function(err){
        console.log("err",err);
        v.$message('密码或用户名错误');
      })
    }
  }
}
</script>



<!--
<template>
  <div>
    <div class="login_box">
      &lt;!&ndash; 表单   &ndash;&gt;
      <h2 align="center">CRM系统登录</h2>
      <el-form ref="LoginFormRef" :rules="LoginFormRules" :model="loginForm" label-width="0" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" @keyup.enter.native="login" prefix-icon="el-icon-lock"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="danger" @click="loginFromReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  data() {
    return {
      loginForm: {
        loginForm:{
          username:'admin',
          password:'123'
        },
      },
      //这里是表单验证
      loginFormRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      }
    }
  },

  methods: {
    //这里是重置按钮,根据￥$refs.xxx获取到东西
    loginFromReset() {
      this.$refs.loginFormRef.resetFields();
    },

    login() {
      // 组件中使用get方法
      let url='http://183.215.190.121:9999/user/login';
      this.$http({ method: "post",
            url: url,
            params: {
              username: this.loginForm.username,
              password: this.loginForm.password,
            }
          }
      ).then((res) => {
        console.log(res)
        this.$message({ message: "登录成功", type: 'success' });
        //将后台返回的token和user存在store
        this.$store.commit('SET_TOKEN', res.data.data.token)
        this.$store.commit('GET_USER', JSON.stringify(res.data.data))
        if(res.data.data){ this.$router.push({name:'',params:{name: this.name}});}
        else{
          this.password="";
          alert("账号或者密码出错,请重新输入")
        }


      }).catch((error) => {
        console.log(error)
      })
    },
    //这里是登录了，先与验证
    // ...mapMutations(['changeLogin']),
   /* ...mapMutations(['setToken']),
    login() {
     /!* this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请正确填入相应数据');
        } else {*!/
          this.$http.post('http://183.215.190.121:9999/user/login',this.loginForm).then(res=>{
            alert(res.data.code)
            if(res.data.code==200){
              this.$message.success('登录成功');
              //把token存进localStorage里面
              // window.localStorage.setItem("token",resu.data.token)
              console.log(res.data.message)
              this.setToken({token: res.data.message });
              //this.$store.commit.changeLogin({ token: resu.data.token });
              this.$router.push({name: '/welcome'});
            }else{
              return this.$message.error('登录失败');
            }
          })
        }*/
      /*});
    }*/
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
</style>-->
