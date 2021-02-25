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
import { listTopCourt } from '@/api/litigant/litigant'
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
    this.getlistTopCourt()
  },
  mounted() {

  },
  methods: {
    getlistTopCourt() {
      listTopCourt({ pageSize: 10 }).then(res => {
        if (res.state === 100) {
          this.list = res.content.map((item, index) => {
            const obj = {
              name: `${index + 1}.${item.name}`,
              ca: `解纷件数: ${item.ca}件`,
              me: `解纷员数量: ${item.me}`
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
