<template>
  <div class="categories">
    <el-button plain type="success" class="addBtn" @click="showAddDialog">添加分类</el-button>
    <!-- 结合表格进行渲染 -->
      <el-table :data="categoryList"
       v-loading="loading"
        element-loading-text="拼命加载中"
      row-key="cat_id">
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" >
            <template v-slot:default="{row}">
              {{ row.cat_deleted ? '否' : '是' }}
            </template>
        </el-table-column>
        <el-table-column label="层级" prop="cat_level"></el-table-column>
        <el-table-column label="操作" >

            <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
            <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>

        </el-table-column>
      </el-table>
      <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
       @close="closeDialog"
      width="40%"
     >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
             <el-cascader
            clearable
            :props="props"
            v-model="form.cat_pid"
            :options="options"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addCategory" type="primary" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      categoryList: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        checkStrictly: true,
        children: 'children',
        label: 'cat_name',
        value: 'cat_id'
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
        console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    },
    async showAddDialog () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      }
    },
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success('恭喜，创建成功')
          this.dialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    }

  }
}
</script>

<style lang="scss" >
.categories{
  .addBtn{
    margin-bottom: 10px;
  }
}

</style>
