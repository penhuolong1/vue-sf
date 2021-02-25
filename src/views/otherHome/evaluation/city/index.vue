<template>
  <div>
    <!-- <searchBox /> -->
    <div class="wrapper">
      <tableTips v-if="isTableTip" type='市' />
      <!-- 只有诉非才能有复评的列表 -->
      <evaluationTable v-if="getOpInfo.opening == 1 && getUserInfo.courtId == 1" type="市"/>
    </div>
  </div>
</template>

<script>
import searchBox from '../components/searchBox'
import tableTips from '../components/tableTipsCity'
import evaluationTable from '../components/evaluationTable'
import topic from '../components/topic'
import step from '../components/step'
import {mapGetters} from 'vuex'
export default {
  components: {
    searchBox,
    tableTips,
    evaluationTable,
    step,
    topic
  },
  props: {

  },
  data() {
    return {
      per: 2
    }
  },
  computed: {
    ...mapGetters(['getOpInfo', 'getUserInfo']),
    isTableTip() {
      let flag = false
      if (this.getUserInfo.courtId == 1) { // 如果是诉非
        if (this.getOpInfo.opening != 1) { //当还不能复评的时候先先生列表提示
          flag = true
        } else {
          flag = false
        }
      } else {
        flag = true
      }
      return flag
    }
  },
  watch: {
  },
  created() {
    this.$store.dispatch('GetOpInfo')
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 10px;
  margin-top: 10px;
}
</style>
