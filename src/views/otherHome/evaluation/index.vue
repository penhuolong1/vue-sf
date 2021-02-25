<template>
  <div>
    <ul class="header">
      <router-link v-for="(item, index) in list" :key="index" class="menu-item" :to="item.path">{{item.name}}</router-link>
    </ul>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    this.$emit('update:nowChoice', '工作考评')
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      if (this.getUserInfo.courtId == 1) {
        this.list = [
          {
            name: '市直考评',
            path: '/evaluation/city'
          },
          {
            name: '各区考评',
            path: '/evaluation/area'
          }
        ]
      } else {
        if (this.getUserInfo.courtType == 1 && this.getUserInfo.courtLevel == 1) {
          this.list = [
            {
              name: '市直考评',
              path: '/evaluation/city'
            }
          ]
        } 
        if (this.getUserInfo.courtType == 0) {
          this.list = [
            {
              name: '各区考评',
              path: '/evaluation/area'
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  border-bottom: 5px solid #f2f5fa;
}
.menu-item {
  width: 100px;
  height: 60px;
  line-height: 60px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: #5a516e;
  &.router-link-active{
    border-bottom: 5px solid #007aff;
  }
}
</style>
