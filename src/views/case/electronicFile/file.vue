<template>
  <div>
    <el-row type="flex" style="justify-content: space-between;">
      <!-- 左侧目录 -->
      <el-col class="menu" :span="4">
        <menuLeft @setAction="setAction" />
      </el-col>
      <!-- 中间内容 -->
      <el-col class="view-action" :span="19">
        <dossierEdit ref="dossierEdit" :show-action="showAction" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import menuLeft from '@/components/mediationDossier/menuLeft'// 右侧菜单
import dossierEdit from '@/components/mediationDossier/dossierEdit'
export default {
  name: '',
  components: {
    menuLeft,
    dossierEdit
  },
  data() {
    return {
      showAction: 1
    }
  },
  computed: {
  },
  watch: {

  },
  created() {

  },
  methods: {
    setAction({ type, id }) {
      this.showAction = type
      this.$refs.dossierEdit.setAction({ type, id })
    }
  }
}
</script>

<style lang="scss" scoped>

.item-title {
    width: 100%;
    min-height: 60px;
    height: 100%;
    border-bottom: 1px solid #E7E8E8;
    border-right: 1px solid #E7E8E8;
    line-height: 60px;
    font-weight: bold;
    text-align: center;
}
.item-textarea {
    width: 100%;
    // height:80px;
    word-wrap:break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
::v-deep .cover .el-textarea__inner {
    min-height: 40px !important;
    border: none;
}
.item-data {
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #E7E8E8;
    line-height: 60px;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #707070;
}
.remark {
    text-align: center;
    background-color: #f3f3f3;
}
.menu {
    padding: 44px 0;
    background: #FAFBFB;
    box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
          -15px 0 15px -15px rgba(0, 0, 0, 0.16);
}

.action {
    background: rgb(200,230,254);
}
.view-action {
    // padding: 30px 0;
    background: #fff;
    box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
          -15px 0 15px -15px rgba(0, 0, 0, 0.16);
}
.operation {
    position: relative;
    padding-top: 30px;
}
.operation p {
    margin-bottom: 25px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
}
.operation-bule {
    border: 1px solid #0093FF;
    color: #0093FF;
}
.operation-yellow {
    border: 1px solid #FEC500;
    color: #FEC500;
}
.view-action-btn {
    padding: 10px;
}
.img-box img{
    margin-left: 20px;
    cursor: pointer;
}
</style>
