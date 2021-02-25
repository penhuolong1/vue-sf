<template>
  <div class="contentbox" style="width:100%,height:100%">
    <div v-for="item in value" :key="item.index" class="progress-box">
      <div class="text" style="margin-bottom:3px">{{ item.value }}件</div>
      <div class="progress">
        <div class="runway">
          <div class="el-slider__bar" :style="`height:${item.percent}%;`" />
        <!-- 圆点上方数字 -->
        <!-- <div ref="toptitle" class="el-slider__button-wrapper number" style="left:42%">
          <div class="el-slider__number">111111111</div>
        </div> -->
        <!-- 圆点 -->
        <!-- <div ref="pointBox" class="el-slider__button-wrapper" style="left:42%">
          <div ref="point" class="el-slider__button" />
        </div> -->
        </div>
      </div>
      <div class="text">
        <span>{{ item.name }}</span>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      content: []
    }
  },
  watch: {
    value() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // console.log(this.value)
      // const max = this.value.reduce((pr, cu) => Math.max(pr, cu.value), 0) + 10
      // this.content = this.value.map(item => {
      //   item.percent = item.value / max * 100
      //   return item
      // })
    }
  }

}
</script>

<style scoped lang = "scss">
.contentbox{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.progress-box{
        padding: 0 2% 0 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        .text{
            display: inline-block;
            flex-shrink: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            width: 40px;
            text-align: center;
            font-size: 12px;
        }
        .progress{
            height: 100%;
        }
        ::v-deep .el-progress__text{
            color: #4cb1ff;
            font-size: var(--fz)!important;
        }
        ::v-deep .el-progress-bar {
            width: calc(100% - 1em);
        }
        /* ::v-deep .el-progress-bar__inner{
            background: -webkit-linear-gradient(to right,#2770ED,#02D0FC);
            background: -o-linear-gradient(to right,#2770ED,#02D0FC);
            background: -moz-linear-gradient(to right,#2770ED,#02D0FC);
            background: -mos-linear-gradient(to right,#2770ED,#02D0FC);
            background: linear-gradient(to right,#2770ED,#02D0FC);
        } */
    }
        .box{
        display: inline-block;
        width:10px;
        height: 10px;
        background: #aaa;
        margin-right: 5px;
    }
    .runway {
    width: 15px;
    height: 95%;
    margin: 0 10px;
    background-color: #E4E7ED;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    cursor: default;
        .el-slider__bar {
        width:100%;
        bottom: 0%;
        background-color: #409EFF;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        border-radius: 6px;
        position: absolute;
        }
        .el-slider__button-wrapper {
            display: inline-block;
            position: absolute;
            height: 40px;
            width: 45px;
            z-index: 1001;
            top: -14px;
            transform: translateX(-50%);
            background-color: transparent;
            text-align: center;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            line-height: normal;
            .el-slider__button {
                vertical-align: middle;
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid #409EFF;
                background:  #409EFF;
                border-radius: 50%;
                transition: .2s;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        }
        .number{
            top: -25px;
        }
}
</style>
