<template>
  <div class="wisdom-judgment-wrapper">
    <mtitle :title="title" />
    <div class="content">
      <div class="contentBox">
        <h1 class="title">组织资源数量</h1>
        <div class="numBox">
          <span v-for="(item,key) in tiao" :key="key">{{ item }}</span>
        </div>
      </div>
      <div class="contentBox">
        <h1 class="title">解纷人员</h1>
        <div class="numBox">
          <span v-for="(item,key) in man" :key="key">{{ item }}</span>
        </div>
      </div>
      <div class="contentBox">
        <h1 class="title">解纷人员平均年办案数</h1>
        <div class="numBox">
          <span v-for="(item,key) in average" :key="key">{{ item }}</span>
        </div>
      </div>
      <div class="contentBox">
        <h1 class="title">纠纷数</h1>
        <div class="numBox">
          <span v-for="(item,key) in total" :key="key">{{ item }}</span>
        </div>
      </div>
      <div class="contentBox">
        <h1 class="title">化解成功率</h1>
        <div class="numBox">
          <span v-for="(item,key) in sucessPercent" :key="key">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mtitle from './title'
import { char2 } from '@/api/common/resolvingDisputes.js'
export default {
  components: {
    mtitle
  },
  props: {
    thisTime: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: [' '],
      tiao: '', // 组织资源数量
      man: '', // 解纷人员数量
      average: '', // 解纷人员平均年办案数
      total: '', // 纠纷数
      sucessPercent: '' //  化解成功率

    }
  },
  watch: {
    thisTime(newVal, oldVal) {
      this.init()
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const params = {
        startTime: this.thisTime
      }
      char2(params).then(res => {
        // console.log(res)
        if (res.state == 100) {
          this.tiao = res.data.tiao.toString()
          this.man = res.data.man.toString()
          this.average = res.data.average.toString()
          this.total = res.data.total.toString()
          this.sucessPercent = res.data.sucessPercent.toString()
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.wisdom-judgment-wrapper {
  height: 100%;
  .content {
    height: calc(100% - 50px);
    background-color: #03183F;
    .contentBox{
        height: 20%;
        padding: 20px 80px 20px 80px;
        text-align: center;
        .title{
            font-size: 20px;
            color: #fff;
            height: 10%;
            background-image: url('../../../assets/bigData/xm/titlebg.png');
            background-repeat: no-repeat;
            background-size: 100%;
            background-position-y: bottom;
        }
        .numBox{
            font-size: 26px;
            color: #05e1fe;
            height: 90%;
            display: flex;
            justify-content:center;
            align-items:center;
            span{
                padding: 10px;
                margin: 50px 15px 15px 15px;
                display: inline-block;
                border:1px solid #3B74C6;
                background-color: rgba(59, 116, 198,0.2);
            }
        }
    }
  }
}
</style>
