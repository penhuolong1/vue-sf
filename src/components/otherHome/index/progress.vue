<template>
  <div class="progress-box">
    <div class="text">
      <span ref="colorBox" class="box" />
      <span>{{ title }}</span>
    </div>
    <div class="progress">
      <div class="runway">
        <!-- <div class="el-slider__bar" style="width: 42%;left: 0%;"></div> -->
        <!-- 圆点上方数字 -->
        <div ref="toptitle" class="el-slider__button-wrapper number" style="left:42%">
          <div class="el-slider__number">{{ toptitle }}</div>
        </div>
        <!-- 圆点 -->
        <div ref="pointBox" class="el-slider__button-wrapper" style="left:42%">
          <div ref="point" class="el-slider__button" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    percent: {
      type: Number,
      default: null
    },
    toptitle: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    }
  },
  watch: {
    percent() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$refs.toptitle.style.left = this.percent + '%'
      this.$refs.pointBox.style.left = this.percent + '%'
      this.$refs.colorBox.style.background = this.color
      this.$refs.point.style.background = this.color
      this.$refs.point.style.border = '2px solid ' + this.color
    }
  }

}
</script>

<style scoped lang = "scss">
.progress-box{
        padding: 0 2% 0 2%;
        display: flex;
        align-items: center;
        height: 20%;
        .text{
            display: inline-block;
            flex-shrink: 0;
            margin-right: 2%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            width: 38%;
        }
        .progress{
            width: 100%;
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
    width: 96%;
    height: 12px;
    margin: 16px 0;
    background-color: #E4E7ED;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    cursor: default;
        .el-slider__bar {
        height: 12px;
        background-color: #409EFF;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
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
