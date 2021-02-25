<template>
  <!-- 首页-队伍管理@tlh -->
  <div class>
    <div class="header menu-header">
      <span
        v-for="item in itemArr"
        :key="item.index"
        :class="{isChoice:nowChoice === item.index}"
        @click="getNotice(item.index)"
      >{{ item.name }}</span>
    </div>
    <div class="body">
      <center v-if="nowChoice === 0" ref="center" :team-type="nowChoice" />
      <unit v-if="nowChoice === 1" ref="unit" :team-type="nowChoice" />
      <organize v-if="nowChoice === 2" ref="organize" :team-type="nowChoice" />
      <staff v-if="nowChoice === 20" ref="staff" :team-type="nowChoice" />
      <unitGrid v-if="nowChoice === 99" />
    </div>
  </div>
</template>

<script>
import center from './center'
import unit from './unit'
import organize from './organize'
import staff from './staff'
import unitGrid from '../unitGrid'
import { mapGetters } from 'vuex'
export default {
  name: 'Team',
  components: {
    center,
    unit,
    organize,
    staff,
    unitGrid
  },
  data() {
    return {
      itemArr: [
        { name: '分流中心', index: 0 },
        { name: '联动单位', index: 1 },
        { name: '解纷组织', index: 2 },
        { name: '解纷员', index: 20 },
        { name: '单位网格图', index: 99, class: 'menu-left' }
      ],
      nowChoice: 0
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
    // menuList() { // 不同权限下的菜单显示
    //   let list = []
    //   if (this.getUserInfo.courtType === 0) { // 分流中心
    //     list = [
    //       { name: '分流中心', index: 0 },
    //       { name: '联动单位', index: 1 },
    //       { name: '解纷组织', index: 2 },
    //       { name: '解纷员', index: 20 },
    //       { name: '单位网格图', index: 99 }
    //     ]
    //   } else if (this.getUserInfo.courtType === 1) { // 联动单位
    //     list = [
    //       { name: '分流中心', index: 0 },
    //       { name: '联动单位', index: 1 },
    //       { name: '解纷组织', index: 2 },
    //       { name: '解纷员', index: 20 },
    //       { name: '单位网格图', index: 99 }
    //     ]
    //   } else if (this.getUserInfo.courtType === 2) { // 调解组织
    //     list = [
    //       { name: '解纷组织', index: 2 },
    //       { name: '解纷员', index: 20 }
    //     ]
    //   } else if (this.getUserInfo.courtType === 20) { // 调解员
    //     list = [
    //       { name: '解纷员', index: 20 }
    //     ]
    //   } else { // 其他
    //     list = [
    //       { name: '分流中心', index: 0 },
    //       { name: '联动单位', index: 1 },
    //       { name: '解纷组织', index: 2 },
    //       { name: '解纷员', index: 20 },
    //       { name: '单位网格图', index: 99 }
    //     ]
    //   }
    //   return list
    // }
  },
  mounted() {
    // this.nowChoice = this.getUserInfo.courtType
    // if (this.getUserInfo.courtType === 1) {
    //   this.nowChoice = 0
    // }
    this.$emit('update:nowChoice', '队伍管理')
  },
  methods: {
    getNotice(index) {
      this.nowChoice = index
      this.$nextTick(() => {
        // if (this.nowChoice === 0) {
        //   this.$refs.center.getList(this.nowChoice);
        // }
        if (this.nowChoice === 2) {
          this.$refs.organize.getList(1)
        }
        if (this.nowChoice === 20) {
          this.$refs.staff.getList(1)
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
.menu-header {
  span:last-child {
    text-align: right;
  }
}
.header {
  height: 60px;
  display: flex;
  border-bottom: 5px solid #f2f5fa;
  span {
    width: 100px;
    height: 60px;
    line-height: 60px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    &:last-child {
      margin-left: auto;
    }
  }
}
.isChoice {
  border-bottom: 5px solid #007aff;
}
</style>
