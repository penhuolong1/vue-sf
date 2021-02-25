<template>
  <div class="list-wrapper">
    <div v-if="!listIndex && listIndex !== 0" class="no-data">
      暂无
    </div>
    <div v-else>
      <collaborationLogListItem v-for="(item, index) in list[0].logs" :key="index" :item="item" />
    </div>
  </div>
</template>

<script>
import collaborationLogListItem from './collaborationLogListItem'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    collaborationLogListItem
  },
  props: {
    listIndex: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      endType: null // 结束方式 1 下发拒绝的结束 2 当事人的结束
    }
  },
  computed: {
    ...mapGetters(['getLogList'])

  },
  watch: {
    getLogList() {
      this.init()
    },
    listIndex() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      this.endType = null
      console.log(this.listIndex)
      if (!this.getLogList.infoList) {
        return
      }
      if (!this.listIndex && this.listIndex !== 0) {
        return
      }
      this.list = this.getLogList.infoList.filter(item => {
        return item.uid == this.listIndex
      })
    }
  }
}
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;
  margin: 20px;
}
.list-wrapper {
  margin-top: 20px;
  background-color: rgba(0,0,0,0.02);
  padding: 10px 0px;
}
</style>
