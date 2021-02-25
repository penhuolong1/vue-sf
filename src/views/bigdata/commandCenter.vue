<template>
  <el-row style="position: relative;">
    <a href="/otherHome/index" style="position:absolute;top:-60px;left:30px;color:#fff;cursor:pointer;z-index:10"><Icon type="ios-undo-outline" size="24" />返回</a>
    <el-col :span="8" class="left-wrapper">
      <el-row v-for="(item,index) in localInfo.left" :key="index" :gutter="40" class="local-wrapper" style="position: relative;">
        <el-col v-for="item1 in item" :key="item1.name" :span=" 6" :class="{'active': item1.state == 0}" class="local-item" @click.native="connect(item1.id, item1.name, item1.state)">
          <div :style="{'margin-top':item1.state == 1 ? '45px':'0'}" class="contentBox">
            <div>{{ item1.name }}</div>
            <div v-if="item1.state == 1 " style="text-align:center;font-size:12px;">{{ item1.num ? item1.num+'件' : '' }}</div>
            <!-- <div v-if="item1.state == 1 " style="text-align:center;font-size:12px;" /> -->
          </div>
        </el-col>
        <dv-flyline-chart-enhanced :config="config" :dev="true" style="width:100%;height:100%;position: absolute;top:0;left:0;z-index：10;" />
      </el-row>
    </el-col>
    <el-col :span="8" class="center-wrapper">
      <div ref="picBox" class="center-wrapper-top" :style="{height:getHeight + 'px'}">
        <div class="content" :style="{paddingTop:getpadding +16+ 'px'}">
          <p class="text">平台案件总数</p>
          <h1 class="num" style="padding-top:15px;padding-bottom:15px;">{{total}}件</h1>
          <!-- <p class="text" style="padding-bottom:15px;">数据总量同比去年</p> -->
          <!-- <p class="text" style="padding-bottom:15px;">2019年法院收案</p> -->
          <!-- <h1 class="num2"> -->
          <!-- <span>同比去年</span> -->
          <!-- 下降是用绿色的 -->
          <!-- <img style="height: 26px;position: relative;top: 1px;margin-right: 7px;margin-left: 7px;" src="../../assets/bigData/xm/green.png" alt=""> -->
          <!-- 上升是预警用红色的 -->
          <!-- <img style="height: 26px;position: relative;top: 1px;margin-right: 7px;margin-left: 7px;" src="../../assets/bigData/xm/red.png" alt=""> -->
          <!-- <span>8.5万件</span> -->

        </div>
      </div>

      <dv-border-box-8 :reverse="true" class="center-wrapper-bottom">
        <!-- <div class="center-wrapper-bottom"> -->
        <el-row style="height:50%" />
        <el-row class="one">
          <el-col :span="8">
            <div class="topThree">
              <div class="contentText">在线调解数</div>
              <div class="contentNum" style="color:#10E3FE">{{ online }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="topThree">
              <div class="contentText">结案总数</div>
              <div class="contentNum" style="color:#10E3FE">{{ end }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="topThree">
              <div class="contentText">调解成功率</div>
              <div class="contentNum" style="color:#10E3FE">{{ sucessPercent }}</div>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="topThree">
              <div class="contentText">委派委托调解成功率</div>
              <div class="contentNum" style="color:#10E3FE">00.00%</div>
            </div>
          </el-col> -->
        </el-row>
      <!-- </div> -->
      </dv-border-box-8>

      <!-- <div id="main" style="z-index:10px;width:100%;position:absolute;top:0;left:0;height:616px"></div> -->
    </el-col>
    <el-col :span="8" class="right-wrapper">
      <el-row v-for="(item,index) in localInfo.right" :key="index" class="local-wrapper" style="position: relative;">
        <el-col v-for="item1 in item" :key="item1.name" :span="6" :class="{'active': item1.state == 0}" class="local-item" @click.native="connect(item1.id, item1.name, item1.state)">
          <div :style="{'margin-top':item1.state == 1 ? '45px':'0'}" class="contentBox">
            <div>{{ item1.name }}</div>
            <div v-if="item1.state == 1" style="text-align:center;font-size:12px;">{{ item1.num ? item1.num+'件' : '' }}</div>
            <!-- <div v-if="item1.state == 1 " style="text-align:center;font-size:12px;" /> -->
          </div>
        </el-col>
        <dv-flyline-chart-enhanced :config="config2" :dev="true" style="width:100%;height:100%;position: absolute;top:0;left:0; z-index：10;" />
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import quantity from './compontents/quantity'
import heatmap from './compontents/heatmap'
// import { localInfo } from './compontents/localinfo'
import progressGroup from './compontents/progressGroup'
import { getMediater } from '../../api/common/common.js'
import echarts from 'echarts'
export default {
  components: {
    quantity,
    progressGroup,
    heatmap
  },

  props: {

  },
  data() {
    return {
      rm: '10px', // 在1920分辨率下面为10px
      localInfo: {
        left: [],
        right: []
      },
      selectIndex: '',
      getHeight: 1,
      // getTop: 1,
      getpadding: 1,
      config: {
        curvature: 10, // 飞线曲率
        k: 0.08, // 飞线收束程度
        points: [
          {
            name: '中间点',
            coordinate: [0.1, 0.7]
          },
          {
            name: '终点',
            coordinate: [0.85, 0.69]
          }
        ],
        lines: [
          {
            source: '中间点',
            target: '终点',
            color: '#00ffff', // 飞线得颜色
            width: 4, // 飞线得宽度
            orbitColor: 'transparent'
          }
        ]
      },
      config2: {
        curvature: 10, // 飞线曲率
        k: 0.08, // 飞线收束程度
        points: [
          {
            name: '中间点',
            coordinate: [0.9, 0.69]
          },
          {
            name: '终点',
            coordinate: [0.15, 0.7]
          }
        ],
        lines: [
          {
            source: '中间点',
            target: '终点',
            color: '#00ffff', // 飞线得颜色
            width: 4, // 飞线得宽度
            orbitColor: 'transparent'
          }
        ]
      },
      sucessPercent: '', // 调解成功率
      total: '', // 纠纷数
      end: '', // 结案数
      online: '',// 在线调解数量
      total: ''// 平台案件总数
    }
  },
  created() {

  },
  mounted() {
    this.adaptive()
    this.getWidth()
    const params = {
      courtType: 1,
      pageSize: 100
    }
    // 获取机构
    getMediater(params).then(res => {
      // console.log(res)
      if (res.state == 100) {
        this.sucessPercent = res.sucessPercent + '%' // 调解成功率
        this.total = res.total// 纠纷数
        this.end = res.end// 结案数
        this.online = res.online// 在线调解数
        this.total=res.total//平台案件总数
        const arr = res.content
        for (let i = 0; i < arr.length; i++) {
          if (i <= 18) {
            if (i <= 15) {
              this.localInfo.left.push(arr.slice(i, i + 3))
              i = i + 2
            } else {
              this.localInfo.left.push(arr.slice(i, i + 1))
            }
          } else {
            this.localInfo.right.push(arr.slice(i, i + 3))
            i = i + 2
          }
        }
        console.log(this.localInfo.left, 'ssss', this.localInfo.right)
      }
    })

    // 中间动态圈圈得效果
    // const myChart = echarts.init(document.getElementById('main'));
    // let angle = 0; //角度，用来做简单的动画效果的
    // const option = {
    //     series: [{
    //             name: "ring5",
    //             type: 'custom',
    //             coordinateSystem: "none",
    //             renderItem: function(params, api) {
    //                 return {
    //                     type: 'arc',
    //                     shape: {
    //                         cx: api.getWidth() / 2,
    //                         cy: api.getHeight() / 2-12,
    //                         r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9,
    //                         startAngle: (0 + angle) * Math.PI / 180,
    //                         endAngle: (90 + angle) * Math.PI / 180
    //                     },
    //                     style: {
    //                         stroke: "#0CD3DB",
    //                         fill: "transparent",
    //                         lineWidth: 1.5
    //                     },
    //                     silent: true
    //                 };
    //             },
    //             data: [0]
    //         }, {
    //             name: "ring5",
    //             type: 'custom',
    //             coordinateSystem: "none",
    //             renderItem: function(params, api) {
    //                 return {
    //                     type: 'arc',
    //                     shape: {
    //                         cx: api.getWidth() / 2,
    //                         cy: api.getHeight() / 2-12,
    //                         r: Math.min(api.getWidth(), api.getHeight()) / 2 *0.9,
    //                         startAngle: (180 + angle) * Math.PI / 180,
    //                         endAngle: (270 + angle) * Math.PI / 180
    //                     },
    //                     style: {
    //                         stroke: "#0CD3DB",
    //                         fill: "transparent",
    //                         lineWidth: 1.5
    //                     },
    //                     silent: true
    //                 };
    //             },
    //             data: [0]
    //         }, {
    //             name: "ring5",
    //             type: 'custom',
    //             coordinateSystem: "none",
    //             renderItem: function(params, api) {
    //                 return {
    //                     type: 'arc',
    //                     shape: {
    //                         cx: api.getWidth() / 2,
    //                         cy: api.getHeight() / 2-12,
    //                         r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95,
    //                         startAngle: (270 + -angle) * Math.PI / 180,
    //                         endAngle: (40 + -angle) * Math.PI / 180
    //                     },
    //                     style: {
    //                         stroke: "#0CD3DB",
    //                         fill: "transparent",
    //                         lineWidth: 1.5
    //                     },
    //                     silent: true
    //                 };
    //             },
    //             data: [0]
    //         }, {
    //             name: "ring5",
    //             type: 'custom',
    //             coordinateSystem: "none",
    //             renderItem: function(params, api) {
    //                 return {
    //                     type: 'arc',
    //                     shape: {
    //                         cx: api.getWidth() / 2,
    //                         cy: api.getHeight() / 2-12,
    //                         r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95,
    //                         startAngle: (90 + -angle) * Math.PI / 180,
    //                         endAngle: (220 + -angle) * Math.PI / 180
    //                     },
    //                     style: {
    //                         stroke: "#0CD3DB",
    //                         fill: "transparent",
    //                         lineWidth: 1.5
    //                     },
    //                     silent: true
    //                 };
    //             },
    //             data: [0]
    //         }, {
    //             name: "ring5",
    //             type: 'custom',
    //             coordinateSystem: "none",
    //             renderItem: function(params, api) {
    //                 let x0 = api.getWidth() / 2;
    //                 let y0 = api.getHeight() / 2-12;
    //                 let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95;
    //                 let point = getCirlPoint(x0, y0, r, (90 + -angle))
    //                 return {
    //                     type: 'circle',
    //                     shape: {
    //                         cx: point.x,
    //                         cy: point.y,
    //                         r: 4
    //                     },
    //                     style: {
    //                         stroke: "#0CD3DB", //粉
    //                         fill: "#0CD3DB"
    //                     },
    //                     silent: true
    //                 };
    //             },
    //             data: [0]
    //         }, {
    //             name: "ring5", //绿点
    //             type: 'custom',
    //             coordinateSystem: "none",
    //             renderItem: function(params, api) {
    //                 let x0 = api.getWidth() / 2;
    //                 let y0 = api.getHeight() / 2-12;
    //                 let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95;
    //                 let point = getCirlPoint(x0, y0, r, (270 + -angle))
    //                 return {
    //                     type: 'circle',
    //                     shape: {
    //                         cx: point.x,
    //                         cy: point.y,
    //                         r: 4
    //                     },
    //                     style: {
    //                         stroke: "#0CD3DB", //绿
    //                         fill: "#0CD3DB"
    //                     },
    //                     silent: true
    //                 };
    //             },
    //             data: [0]
    //         },

    //     ]
    // };
    // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
    // 获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
    function getCirlPoint(x0, y0, r, angle) {
      const x1 = x0 + r * Math.cos(angle * Math.PI / 180)
      const y1 = y0 + r * Math.sin(angle * Math.PI / 180)
      return {
        x: x1,
        y: y1
      }
    }
    function draw() {
      angle = angle + 3
      myChart.setOption(option, true)
      // window.requestAnimationFrame(draw);
    }
    // setInterval(function() {
    //     //用setInterval做动画感觉有问题
    //     draw()
    // }, 100);
  },

  methods: {
    // 计算自适应
    adaptive() {
      this.rm = 10 * document.body.clientWidth / 1920
      this.rm = this.rm + 'px'
    },
    getWidth() {
      console.log(this.$refs.picBox.clientWidth)
      this.getHeight = this.$refs.picBox.clientWidth - 24
      // this.getTop = this.$refs.picBox.clientWidth - 20
      // this.getpadding = (this.$refs.picBox.clientWidth) / 2 - 110
      this.getpadding = (this.$refs.picBox.clientWidth) / 2 - 110 + 31
    },
    // 跳转到连接的页面
    connect(id, name, state) {
      console.log('跳转到连接的页面')
      if (state == 0) {
        return
      }
      this.$store.commit('SET_MENUINDEX', 12)
      this.$store.commit('SET_COURTID', id)
    },

    // 基于准备好的dom，初始化echarts实例
    initBar() {

    }
  }
}
</script>

<style scoped lang="scss">
.xm-bigdata-wrapper{
  position: fixed!important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1400px;
  min-height: 700px;
  z-index: 1;
  background-size:100% 100%;
  background-repeat:no-repeat;
  .menu-wrapper {
    position: absolute;
    background-color: transparent;
    color: white;
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    top: 85px;
    ul {
      display: inline-flex;
      justify-content: space-between;
      width: 240px;
    }
  }
  .center-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .center-wrapper-top {
      width: 100%;
      background-size: 105% 105%;
      background-repeat: no-repeat;
      background-image: url('../../assets/bigData/xm/command.png');
      .content{
        width: 100%;
        height: 195px;
        .num{
          font-size: 50px;
          color:#1BF3D0;
          font-weight: 700;
          letter-spacing: 4px;
          text-align: center;
        }
        .num2{
          font-size: 24px;
          color:#1BF3D0;
          letter-spacing: 4px;
          text-align: center;
          font-weight: bold;
        }
        .text{
          font-size: 24px;
          color:#fff;
          text-align: center;
        }
      }

    }
    .center-wrapper-bottom {
      width: 100%;
      height: 20%;
      // bottom: 20px;
      left: 0px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url('../../assets/bigData/xm/8(1).png');
      // position: absolute;
      .one{
        height: 50%;
        .contentText{
          font-size: 14px;
          font-weight: 600;
          color:#fff;
          text-align: center;
          width: 100%;
          height: 50%;
          line-height: 20px;
          position: relative;
          left: -3px;
      }
      .contentNum{
          font-size: 24px;
          font-weight: 500;
          text-align: center;
          font-weight: 700;
          width: 100%;
          height: 50%;
          line-height: 40px;
          letter-spacing: 4px;
      }
      }
    }
  }
  .content-wrapper {
    position: fixed;
    top: 140px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    min-width: 1440px;
    z-index: 10;
    &>.el-row {
      height: 100%;
      &>.el-col {
        height: 100%;

      }
    }
    .left-wrapper {
      .local-wrapper {
        height: 14.28%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/bigData/xm/left.png');
        margin-bottom: 5px;

        display: flex;
        justify-content: space-around;
        .contentBox{
          height:100px;
          display:flex;
          flex-direction:column;
          justify-content:space-around
        }
        .active{
          background-image: url('../../assets/bigData/xm/active.png')!important;
          color:#70768B!important;
            &:nth-child(1) {
              &::after {
                content: '--'!important;
                position: absolute;
                right: -38px!important;
                color: #0EFBFF;
                font-size: 20px;
                font-weight: blod;
                letter-spacing:10px
              }
            }
            &:nth-child(2) {
              &::after {
                content: '--'!important;
                position: absolute;
                right: -38px!important;
                color: #0EFBFF;
                font-size: 20px;
                font-weight: blod;
                letter-spacing:10px
              }
            }
        }
        .local-item {
          height: 40%;
          color: white;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          padding-left: 20px;
          font-size: 15px;
          background-image: url('../../assets/bigData/xm/item.png');
          position: relative;
          cursor: pointer;
          z-index: 100;
          &:nth-child(1) {
            &::after {
              content: '---';
              position: absolute;
              right: -16px;
              color: #0EFBFF;
              font-size: 20px;
              font-weight: blod;
              letter-spacing:10px
            }
          }
          &:nth-child(2) {
            &::after {
              content: '---';
              position: absolute;
              right: -16px;
              color: #0EFBFF;
              font-size: 20px;
              font-weight: blod;
              letter-spacing:10px
            }
          }
        }
      }
    }
    .right-wrapper {
      .local-wrapper {
        height: 14.28%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/bigData/xm/right.png');
        padding-right: 20px;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-around;
        .contentBox{
          height:100px;
          display:flex;
          flex-direction:column;
          justify-content:space-around
        }
        .active{
          background-image: url('../../assets/bigData/xm/active.png')!important;
          color:#70768B!important;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            transform: rotate(180deg);
            background-image: url('../../assets/bigData/xm/item.png');
          }
          &:nth-child(2),&:nth-child(3) {
            &::after {
              content: '--'!important;
              position: absolute;
              left: -30px!important;
              color: #0EFBFF;
              font-size: 20px;
              font-weight: blod;
              letter-spacing:10px
            }
          }
        }
        .local-item {
          height: 40%;
          color: white;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          padding-left: 20px;
          font-size: 15px;
          position: relative;
          z-index: 100;
          justify-content: flex-end;
          padding-right: 20px;
          cursor: pointer;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            transform: rotate(180deg);
            background-image: url('../../assets/bigData/xm/item.png');
          }
          &:nth-child(2),&:nth-child(3) {
            &::after {
              content: '---';
              position: absolute;
              left: -16px;
              color: #0EFBFF;
              font-size: 20px;
              font-weight: blod;
              letter-spacing:10px
            }
          }
        }
      }
    }
  }
}
</style>
