<template>
  <div class="menu-wrapper">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in menuData"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
        @click.native="getMenu(activity.id)"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    menuData: {
      type: Array,
      require: true,
      default: null
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getMenu(id) {
      this.$emit('getMenu', id)
    }
  }
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
  background-color: #FAFBFB;
  box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
  border-radius: 5px;
  ::v-deep .el-timeline {
    padding: 20px;
  }
  ::v-deep .el-timeline-item__wrapper {
    top: 0px;
    cursor: pointer;
    .el-timeline-item__content {
      font-size: 16px;
      color: #999999;
    }
  }
}
</style>
