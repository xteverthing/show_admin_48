<template>
<!-- 登录页 -->
  <div class="login">
    <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
      <img src="../assets/avatar.jpg" class="logo" />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
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
        username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名必须在3到12位之间', trigger: ['blur', 'change'] }
        ],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码必须在3到12位之间', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  methods: {
    reset () {
      // 作用: ref 属性配合 $ref 可以获取 dom 元素 (或者 vue组件实例)
      this.$refs.form.resetFields()
    },

    // 获取到 el-form组件, 调用校验方法
    // 参数1: 是否校验成功  boolean
    // 参数2: 错误的字段信息
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          this.$message({
            message: '登录成功',
            type: 'success',
            diration: 1000
          })
          // 把token存储起来
          localStorage.setItem('token', data.token)
          this.$router.push('/index')
        } else {
          this.$message({
            message: meta.msg,
            type: 'error',
            diration: 1000
          })
          console.log('登录失败')
        }
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    border-radius: 5px;
    background-color: #fff;
    padding: 75px 20px 20px;
    position: relative;
    .logo {
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .el-button:last-child {
      margin-left: 100px;
    }
  }
}
</style>
