<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- tab栏 -->
    <el-tabs v-model="activeTab" tab-position="left" @tab-click="handleClick">
      <el-tab-pane name="0" label="基本信息">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :props="props"
              v-model="form.goods_cat"
              :options="options"></el-cascader>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="1" label="商品图片">
        <!-- action:指定提交图片的地址,不走axios,需要写全路径
             需要自己指定headers, 添加token
        -->
        <el-upload
          multiple
          :headers="headers"
          name="file"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
          <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>

      <el-tab-pane name="2" label="商品内容">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">添加</el-button>
      </el-tab-pane>

    </el-tabs>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      options: [],
      form: {
        goods_name: '',
        goods_cat: [], // 选择的分类id数组
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [] // 存放将来上传的图片的地址
      },
      props: {
        children: 'children',
        label: 'cat_name',
        value: 'cat_id'
      },
      activeTab: '0',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
      console.log(data)
    }
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    handleSuccess (response, file, fileList) {
      // 响应的数据
      // console.log(response)
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      }
    },
    // 删除, 默认就有删除的功能
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      // console.log(file)
      // 删除的路径名
      const filePath = file.response.data.tmp_path
      // 保留所有不是该路径名的图片
      this.form.pics = this.form.pics.filter(item => item.pic !== filePath)
    },
    // 预览
    handlePictureCardPreview (file) {
      // 赋值路径
      this.dialogImageUrl = file.url
      // 显示对话框
      this.dialogVisible = true
    },
    async addGoods () {
      // 发送添加的ajax请求
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success('恭喜, 创建成功')
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped不会渗透到子组件的
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor {
    min-height: 300px;
  }
}
</style>
