<template>
  <div class="header-wrapper">
    <el-scrollbar ref="scrollContainer" class="scroll-container">
      <div v-for="(item, index) in list" :key="index" :class="styleClass(item.type).class" class="header-item">
        <i class="icon1 el-icon-arrow-right" />
        <img class="icon-img" :src="styleClass(item.type).img">
        <span class="name">{{ item.name }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    caseLineData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    styleClass() { // 根据状态获取不一样的class
      return function(index) {
        const classMap = {
          1: {
            class: 'success',
            img: require('@/assets/icon/iconSuccess.png')
          },
          2: {
            class: 'edit',
            img: require('@/assets/icon/iconEdit.png')
          },
          3: {
            class: 'error',
            img: require('@/assets/icon/iconBack.png')
          }
        }
        return classMap[index]
      }
    }
  },
  watch: {
    caseLineData: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  mounted() {
    // this.$refs['scrollContainer'].moveX = 120
    // console.log(this.$refs['scrollContainer'].moveX)
  },
  methods: {
    // 初始化数据
    init() {
      if (!this.caseLineData || this.caseLineData.length == 0) {
        return
      }
      this.list = []
      this.list = this.caseLineData.map((item, index) => {
        const obj = {
          name: item.name,
          type: 1
        }
        if (item.name === '补正' || item.name === '不予受理') {
          obj.type = 3
        } else {
          if (index == this.caseLineData.length - 1) {
            obj.type = 2
          }
        }
        return obj
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header-wrapper {
  text-align: center;
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .header-item {
    display: inline-block;
    line-height: 37px;
    padding: 0 20px;
    border-radius: 20px;
    color: #fff;
    margin-left: 60px;
    position: relative;
    .icon-img {
      margin-right: 10px;
    }
    .icon1 {
      position: absolute;
      font-size: 30px;
      font-weight: bold;
      line-height: 37px;
      left: -40px;
    }
    &:first-child {
      .icon1 {
        display: none;
      }
    }
    &.success {
      background: linear-gradient(90deg,#55c674, #31a952);
      .icon1 {
        color: #31a952;
      }
    }
    &.edit {
      background: linear-gradient(90deg,#589ce6, #007aff);
      .icon1 {
        color: #007AFF;
      }
      .icon-img {
        position: relative;
        top: 3px;
      }
    }
    &.error {
      background: linear-gradient(90deg,#e8695e, #eb4132);
      .icon1 {
        color: #eb4132;
      }
      .icon-img {
        position: relative;
        top: 1px;
      }
    }
  }
}
</style>
