<template>
  <div>
    <div class="form-int-1">
      <span class="form-title">类型</span>
      <el-button style="color:#2475FE" :class="{'is-action' : formData.type == 1 ? true: false}" @click.native="setPageType(1)">页面类型</el-button>
      <el-button style="color:#2475FE" :class="{'is-action' : formData.type == 0 ? true: false,'disabled':formData.typeFlag}" @click.native="setPageType(0)">按钮类型</el-button>
    </div>
    <div class="form-int-1">
      <span class="form-title">父级</span>
      <el-select v-model="formData.parentId" class="form-val-1" filterable placeholder="请选择">
        <el-option
          v-for="item in allLabel"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="form-int-1">
      <span class="form-title">标题</span>
      <el-input v-model="formData.title" class="form-val-1" placeholder="请输入内容" clearable />
    </div>
    <div class="form-int-1">
      <span class="form-title">英文名</span>
      <el-input v-model="formData.menuName" class="form-val-1" placeholder="请输入内容" clearable />
    </div>
    <div class="form-int-1">
      <span class="form-title">路由</span>
      <el-input v-model="formData.path" class="form-val-1" placeholder="请输入内容" clearable />
    </div>
    <!-- <div class="form-int-1">
            <span class="form-title">请求路径</span>
            <el-input class="form-val-1" placeholder="请输入内容" v-model="formData.url" clearable></el-input>
        </div> -->
    <div class="form-int-1">
      <span class="form-title">图标</span>
      <el-input v-model="formData.icon" class="form-val-1" placeholder="请输入内容" clearable />
      <a class="form-info el-icon-info" href="https://element.eleme.cn/#/zh-CN/component/icon" target="view_window" title="图标库" />
    </div>
    <!-- <div class="form-int-1">
            <span class="form-title">前端组件</span>
            <el-input class="form-val-1" placeholder="请输入内容" v-model="formData.component" clearable></el-input>
        </div> -->
    <div class="form-int-1">
      <span class="form-title">权限</span>
      <el-input v-model="formData.perms" class="form-val-1" placeholder="请输入内容" clearable />
    </div>
    <div class="form-int-1">
      <span class="form-title">排序值</span>
      <el-input v-model="formData.orderNum" class="form-val-2" placeholder="请输入内容" clearable />
      <span class="tip">值越小越靠前</span>
    </div>
    <!-- <div class="form-int-1">
            <span class="form-title">是否启用</span>
            <el-switch v-model="formData.isEnabled" active-text="启用" inactive-text="禁用"></el-switch>
        </div> -->
  </div>
</template>

<script>
export default {
  name: 'MenuForm',
  props: ['formData', 'allLabel'],
  methods: {
    // 设置页面类型
    setPageType(type) {
      if (this.formData.typeFlag) return
      this.formData.type = type
      console.log(this.formData)
    }
  }
}
</script>

<style lang="scss" scoped>
    .form-int-1{
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        .form-title{
            display: inline-block;
            flex-shrink: 0;
            width: 90px;
        }
        .form-val-1 {
            width: 100%;
        }
        .form-val-2 {
            width: 40%;
        }
        .tip {
            margin-left: 38px;
        }
        ::v-deep .el-switch__label {
            color: #DCDFE6;
        }
        ::v-deep .is-active{
            color: #409EFF;
        }
        .form-info {
            display: flex;
            width: 100px;
            justify-content: center;
            font-size: 25px;
        }
        .disabled{
            cursor:not-allowed;
        }
    }
    .is-action{
        background: #2475FE;
        color: #fff !important;
        border-color: #2475FE;
    }
</style>
