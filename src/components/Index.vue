<template>
  <!-- 首页 -->

  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          unique-opened
          router
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
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

           <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('亲, 你确认要退出系统吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(e => {
        console.log(e)
        this.$message.error('取消退出')
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
    padding: 0;
    display: flex;
    .logo {
      width: 200px;
      padding: 10px;
      img {
        height: 40px;
        margin: 0 auto;
        display: block;
      }
    }
    .title {
      flex: 1;
      h1 {
        line-height: 60px;
        text-align: center;
        font-weight: 700;
      }
    }
    .logout {
      width: 200px;
      padding: 10px;
      text-align: right;
      line-height: 40px;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu{
      border-right: none
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
