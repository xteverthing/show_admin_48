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

        :default-active="defaultActive"
          unique-opened
          router
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="l1.path" v-for="l1 in menuList" :key="l1.id">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{l1.authName}}</span>
            </template>
            <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id" >
              <i class="el-icon-menu"></i>
              <span slot="title">{{l2.authName}}</span>
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
  data () {
    return {
      menuList: []
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  },
  async  created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
      // console.log(data)
    } else {
      this.$message.error(meta.msg)
    }
  },
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
