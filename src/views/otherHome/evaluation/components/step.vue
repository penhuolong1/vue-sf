<template>
  <div class="wrapper">
    <h1>考评进度</h1>
    <el-steps :active="step" finish-status="success" align-center>
      <el-step v-for="item in list" :key='item.id' :title="item.title" />
    </el-steps>
  </div>
</template>

<script>
import {title} from '@/api/evaluation/index'
import {mapGetters} from 'vuex'
export default {
  components: {

  },
  props: {
    type: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getAnswerInfo'])
  },
  created() {
    this.getTitle()
  },
  mounted() {

  },
  watch: {
    step() {
      if (!this.list && this.list.length <= 0) {
        return
      }
      const obj = {
        index: this.step,
        info: this.list[this.step],
        id: this.list[this.step].id
      }
      this.$store.commit('SET_ANSWERINFO', obj)
    }
  },
  methods: {
    getTitle() {
      const params = {
        type: this.type
      }
      title(params).then(res => {
        if (res.state === 100) {
          this.list = res.data.evaluation
          const obj = {
            index: this.step,
            info: this.list[this.step],
            id: res.data.evaluation[this.step].id
          }
          this.$store.commit('SET_ANSWERINFO', obj)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  h1 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  padding: 10px 20px;
  padding-bottom: 20px;
  margin-top: 20px;
  box-shadow: 2px 3px 10px 0px rgba(119,119,119,0.1);
}
::v-deep .el-step__title{
  font-size: 15px;
  line-height: 1.5;
}
</style>
