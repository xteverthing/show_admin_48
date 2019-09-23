<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logot">
        欢迎光临~
        <a href="javascript:;" @click="logot">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

              <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logot () {
      this.$confirm('亲, 你确认要退出系统吗??', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message.success('亲！退出成功!')
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message('亲！退出已取消!')
        })
    }
  }
}
</script>

<style lang='scss' scoped >
.index {
  height: 100%;

  .el-header {
    background-color: #d8d8d8;
    display: flex;
    padding: 0;
    .logo {
      width: 200px;
      padding: 10px;
      img {
        height: 40px;
        display: block;
        margin: 0 auto;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      h1 {
        font-size: 24px;
        height: 60px;
        line-height: 60px;
        color: #545c64;
      }
    }
    .logot {
      width: 200px;
      line-height: 40px;
      text-align: right;
      font-weight: 700;
      padding: 10px;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu{
      border-right:none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
