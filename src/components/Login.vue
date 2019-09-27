<template>
<!-- 登录页 -->
<div class="login">
  <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
    <img src="../assets/avatar.jpg" alt="" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username"  @keyup.enter.native="login" placeholder="请输入用户名"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="form.password" type="password"  @keyup.enter.native="login" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login" class="loginBtn">登录</el-button>
    <el-button @click="reset">重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
// import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['blur', 'change'] }
        ],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度必须是3-12位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      // 调用表单组件的方法  resetFields 重置表单
      this.$refs.form.resetFields()
    },
    async login () {
      // 调用表单组件的方法 validate  校验长度
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)

        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '恭喜, 登录成功',
            duration: 1000
          })
          localStorage.setItem('token', data.token)
          this.$router.push('/index')
        } else {
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 1000
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style lang="scss">
.login{
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form{
    width:400px;
    margin:200px auto;
    background-color: #fff;
    padding:75px 20px 20px;
    border-radius: 20px;
    position: relative;
  img{
    position: absolute;
    top:-70px;
    left:50%;
    transform: translateX(-50%);
    border-radius: 50%;
    border:5px solid #fff
  }
  .loginBtn{
    margin-right:50px;
  }
  }
}
</style>
