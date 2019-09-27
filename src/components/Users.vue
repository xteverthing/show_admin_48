<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button class="addBtn" plain type="success"  @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template v-slot:default="obj">
        <el-switch v-model="obj.row.mg_state" @change="changeState(obj.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot:default="obj">
          <!-- {{ obj.row.id }} -->
          <el-button plain  size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(obj.row)"></el-button>
          <el-button plain  size="small" type="danger" @click="delUser(obj.row.id)" icon="el-icon-delete"></el-button>
          <el-button plain  size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog
     @close="closeDialog"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
           <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" ></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="30%"
      >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
          <el-form-item label="用户名">
              <el-tag type="info">{{ editForm.username }}</el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      dialogVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的电话号码', trigger: ['blur', 'change'] }
        ]

      }

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async  getUserList () {
      const { data, meta } = await this.$axios.get('users', { params: { query: this.query, pagenum: this.pagenum, pagesize: this.pagesize } })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 修改每页的条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 将当前页更新成第一页
      this.pagenum = 1
      // 重新渲染
      this.getUserList()
    },
    // 当前页变化时, 触发
    handleCurrentChange (val) {
      // val 用户选择的当前页
      this.pagenum = val
      // 重新渲染
      this.getUserList()
    },
    async delUser (id) {
      try {
        await this.$confirm('亲, 你确认要进行删除吗?', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message('取消成功')
      }
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (meta.status === 200) {
        this.$message.success('修改状态成功')
      } else {
        this.message.error(meta.msg)
      }
    },
    showAddDialog () {
      this.dialogVisible = true
    },
    async  addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    showEditDialog (row) {
      console.log(row)

      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    async  editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
          this.editVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users {

  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
  .el-table{
    margin-bottom: 10px;
  }
}
</style>
