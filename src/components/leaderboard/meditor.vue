<template>
  <div class="leader-board-wrapper">
    <ul>
      <li v-for="(item, index) in list" :key="index" :class="{'top1': index == 0}" class="leader-board-item">
        <div><img v-if="index < 3" src="@/assets/images/recommend.png">{{ item.name }}</div>
        <div>{{ item.ca }}</div>
        <div>{{ item.me }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { listTopMediator } from '@/api/litigant/litigant'
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
  created() {
    this.getlistTopMediator()
  },
  mounted() {

  },
  methods: {
    getlistTopMediator() {
      listTopMediator({ pageSize: 10 }).then(res => {
        if (res.state === 100) {
          this.list = res.data.content.map((item, index) => {
            const obj = {
              name: `${index + 1}.${item.name}`,
              ca: `解纷件数: ${item.caseNum}件`,
              me: `解纷成功率: ${item.casePercent}%`
            }
            return obj
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
<style scoped lang="scss">
.leader-board-wrapper {
  .leader-board-item {
     &>div {
       &:nth-child(1) {
         width: 200px;
         flex: none;
       }
       &:nth-child(2) {
         flex: 1;
         width: auto;
         text-align: left;
       }
     }
  }
}
</style>
