<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<style lang="scss" >
*{
  padding: 0;
  margin:0;
}
html,body,#app{
  height: 100%;
  width: 100%;
}
#app{
    .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
}
</style>
