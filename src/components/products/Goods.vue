<template>
  <div class="goods">
     <el-button  type="success" @click="goAdd" plain class="addBtn" >添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods-weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default="{ row }">
            {{row.add_time | time}}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="">
        <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
        <el-button type="danger" size="small" plain  icon="el-icon-delete"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      goodList: [],
      total: 0
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    async  getGoodList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
        console.log(data)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodList()
    },
    goAdd () {
      // 去添加的路由
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  .addBtn {
    margin-bottom: 10px;
  }
}
</style>
