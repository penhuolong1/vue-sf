<template>
  <div class="electronic-file-wrapper">
    <!-- <div class="content-left">
      <menuLeft :menu-data="menuData" />
    </div> -->
    <div class="content-right">
      <file />
    </div>
  </div>
</template>

<script>
import file from './file'
import menuLeft from '@/components/menu/caseMenuLeft'
export default {
  components: {
    menuLeft,
    file
  },
  props: {

  },
  data() {
    return {
      menuData: [{
        content: '卷宗封面',
        color: '#F4AA5A'
      }, {
        content: '卷宗目录',
        color: '#7AC246'
      }]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.electronic-file-wrapper {
  width: 100%;
  height: auto;
  display: flex;
  .content-left {
    width: 150px;
  }
  .content-right {
    width: calc(100%);
    padding-left: 30px;
  }
}
</style>
