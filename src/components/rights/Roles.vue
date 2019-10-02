<template>
<!-- 角色列表 -->
  <div class="roles">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="showAddDialog" plain class="addBtn">添加角色</el-button>

        <!-- 表格 -->
    <el-table :data="rolesList">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <p v-if="row.children.length===0">暂无权限</p>
         <!-- <p v-for="item in row.children" :key="item.id">{{item.authName}}</p> -->
      <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
        <el-col :span="4">
          <el-tag @close="delRights(row,l1.id)" closable>{{l1.authName}}</el-tag>
          <i class="el-icon-arrow-right"></i>
        </el-col>
        <el-col :span="20">
          <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
            <el-col :span="4">
              <el-tag type="success" @close="delRights(row,l2.id)" closable>{{l2.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
               <el-tag  @close="delRights(row,l3.id)" class="l3" closable type="warning" v-for="l3 in l2.children" :key="l3.id">{{l3.authName}}</el-tag>
            </el-col>
          </el-row>
        </el-col>

      </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button plain size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(row)"></el-button>
          <el-button @click="delRole(row.id,$event)" plain size="small" type="danger"  icon="el-icon-delete"></el-button>
          <el-button @click="showAssignDialog(row)" plain size="small" type="success" icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 分配对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%">
      <el-tree
        node-key="id"
        ref="tree"
        default-expand-all
        show-checkbox
        :data="data"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
      <el-button @click="assignVisible = false">取 消</el-button>
      <el-button @click="assignRights" type="primary">分配</el-button>
      </span>
    </el-dialog>
<!-- 添加对话框（将来编辑的也复用）-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addVisible"
      @close="closeDialog"
      width="40%">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"  placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"  placeholder="请输入角色描述" ></el-input>
        </el-form-item>

      </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button  type="primary" @click="saveRole">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      rolesList: [],
      assignVisible: false,
      addVisible: false,
      data: [],
      defaultProps: {
        // 子列表的属性名
        children: 'children',
        // 展示的文字
        label: 'authName'
      },
      // 专门记录正在授权的角色的id
      roleId: '',
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      dialogTitle: '添加角色'

    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
        // console.log(data)
      } else {
        this.$message.error(meta.status)
      }
    },
    // 权限删除功能
    async  delRights (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限
    async showAssignDialog (row) {
      this.roleId = row.id
      console.log(row.id)

      this.assignVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        // 三级id
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },

    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色
    async delRole (id, e) {
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        e.target.parentNode.blur()
      }
      try {
        await this.$confirm('你确定要删除吗？', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAddDialog () {
      this.addVisible = true
      this.dialogTitle = '添加角色'
    },

    showEditDialog (row) {
      this.addVisible = true
      this.dialogTitle = '修改角色'
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    closeDialog () {
      // 重置表单的内容 会重置成第一次展示的状态
      this.$refs.form.resetFields()
      this.form.id = ''
    },
    async saveRole () {
      const isAdd = this.dialogTitle === '添加角色'
      const url = isAdd ? 'roles' : `roles/${this.form.id}`
      const method = isAdd ? 'post' : 'put'
      const { meta } = await this.$axios[method](url, this.form)
      // console.log(res)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功')
        this.addVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.roles{
  .addBtn{
    margin-bottom: 5px;
  }
    .l1 {
    margin-bottom: 5px;
    border-bottom: 1px dotted #ccc;
  }
  .l2 {
    margin-bottom: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

</style>
