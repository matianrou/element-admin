<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>
<style>
.contentContainer {
  width: 100%;
  /* height: calc(100vh - 50px); */
  padding: 20px 20px 20px 20px;
  max-height: 85%;
  overflow: scroll;
}
.el-input {
  width: 200px;
}
.el-date-editor.el-input {
  width: 200px;
}
.btn {
  margin-bottom: 10px;
}
body {
  padding-right: 0 !important;
}
body, h1, h2, h3, h4, h5, h6, hr, p,

blockquote, /* structural elements 结构元素 */

dl, dt, dd, ul, ol, li, /* list elements 列表元素 */

pre, /* text formatting elements 文本格式元素 */

form, fieldset, legend, button, input, textarea, /* form elements 表单元素 */

th, td, /* table elements 表格元素 */

img/* img elements 图片元素 */ {
  border: medium none;

  margin: 0;

  padding: 0;
}
li {
  list-style: none;
}
.tree {
  width: 300px;
  border: 1px solid #000;
  overflow: scroll;
}
::-webkit-scrollbar {
  width: 8px;
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: inherit;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #c3c9cd;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
</style>
<style lang="scss">
.sizeposition {
  margin-left: 47px;
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding-left: 9px;
    border: 1px solid #000;
  }
  .sizebtn {
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    text-align: center;
    background: #000;
    margin-right: 5px;
    font-size: 18px;
  }
}
</style>
