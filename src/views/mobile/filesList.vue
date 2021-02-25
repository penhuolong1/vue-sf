<template>
  <div class="list">
    <h1>文书列表</h1>
    <div v-for="item in list" :key="item.id" class="item" @click="lookFile(item.path)">
      {{ item.name }}
      <i class="icon el-icon-arrow-right" />
    </div>
  </div>
</template>

<script>
import { listFileUrl } from '@/api/dossier/dossier.js'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      params: {},
      list: []
    }
  },
  created() {
    console.log({ ...this.$route.query })
    this.getListFileUrl()
  },
  mounted() {
  },
  methods: {
    getListFileUrl() {
      listFileUrl(this.$route.query).then(res => {
        if (res.state == 100) {
          this.list = [...res.data]
          if (this.list.length == 1) {
            window.location = this.list[0].path
          }
        }
      })
    },
    // 查看文书
    lookFile(path) {
      // this.$router.push(path)
      window.location = path
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  padding: 0 10px;
  h1 {
    padding: 24px 0 8px 16px;
    color: rgba(69, 90, 100, 0.6);
    font-size: 14px;
  }
  .item {
    position: relative;
    margin: 0 0 12px;
    padding-left: 20px;
    padding-right: 40px;
    color: #323233;
    font-weight: 600;
    font-size: 14px;
    line-height: 40px;
    background: #f7f8fa;
    border-radius: 99px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-transition: background 0.3s;
    transition: background 0.3s;
    .icon {
      position: absolute;
      right: 0px;
      top: 0px;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #B6C3D2;
    }
  }
}
</style>
