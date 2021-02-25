<template>
  <div>
    <div :class="direction=='horizontal' ? 'mydraw2' : 'mydraw' ">
      <div
        :class="direction=='horizontal' ? 'cont buttonDiv2 commoBtn2' : 'cont buttonDiv commoBtn' "
      >
        <el-button @click.native="clear">
          <span>清除</span>
        </el-button>
        <el-button v-loading="saveLoading" type="primary" @click.native="save">
          <span>保存</span>
        </el-button>
      </div>
      <div :class="direction=='horizontal' ? 'cont canvasDiv2' : 'cont canvasDiv'">
        <canvas
          id="canvas"
          ref="mycanvas"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >Canvas画板</canvas>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { tableFileAddSignByCode } from '@/api/dossier/dossier'
export default {
  data() {
    return {
      direction: 'vertical', // 画板方向 vertical horizontal
      ctx: '', // canvas对象
      stage_info: '', // mycanvas的大小及其相对于视口的位置
      canvasWidth: '', // canvas宽度
      canvasHeight: '', // canvas高度
      lineColor: 'black', // 线条的颜色
      lineWidth: 5, // 线条宽度
      url: '',
      myDrawShow: false,
      myNameShow: false,
      saveLoading: false, // 保存按钮加载状态
      submitLoading: false, // 保存按钮加载状态
      nameWidth: '50px',
      nameHeight: '100px',
      urlId: '',
      dataURL: '',
      onlineRoomId: '',
      litigantId: '',
      lawyerId: '',
      judgeId: '',
      caseId: '',
      emptyImg: '',
      params: {}
    }
  },
  created() {
    // 阻止默认微信系统字体大小的影响
    if (
      typeof WeixinJSBridge == 'object' &&
      typeof WeixinJSBridge.invoke == 'function'
    ) {
      handleFontSize()
    } else {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', handleFontSize)

        document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
      }
    }

    function handleFontSize() {
      // 设置网页字体为默认大小
      WeixinJSBridge.invoke('setFontSizeCallback', {
        fontSize: 0
      })
      // 重写设置网页字体大小的事件
      WeixinJSBridge.on('menu:setfont', function() {
        WeixinJSBridge.invoke('setFontSizeCallback', {
          fontSize: 0
        })
      })
    }
  },

  mounted() {
    this.initCanvas()
    this.dealUrl()
  },

  methods: {
    // 解析路由获取参数
    dealUrl() {
      console.log(this.$route)
      this.params = { ...this.$route.query }
    },
    /**
     * 初始化画板，获取canvas节点对象，设置画板的宽高
     * 不能在此方法中设置线条宽度样式，否则无效
     */
    initCanvas() {
      // 获取到当前canvas节点的信息，包含宽，高，top，left等
      var mycanvas = this.$refs.mycanvas // 获取canvas元素
      this.canvasWidth = mycanvas.clientWidth - 1 // 获取画板宽度
      this.canvasHeight = mycanvas.clientHeight - 1 // 获取画板高度
      mycanvas.width = this.canvasWidth
      mycanvas.height = this.canvasHeight

      // canvas基础设置，线条设置
      this.ctx = mycanvas.getContext('2d')
      // 获取mycanvas的大小及其相对于视口的位置
      this.stage_info = mycanvas.getBoundingClientRect()
      console.log('stage_info', this.stage_info)
      this.ctx.beginPath()
    },
    /**
     * 重写按钮点击事件，清空画板内容
     */
    clear() {
      // 清空图片
      this.url = ''
      // 清空画板
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      // 重新设置canvas画板节点对象，否则绘画会出问题,这里异步操作，否则绘画有误
      this.$nextTick(() => {
        this.initCanvas()
      })
    },
    // 保存签名
    save() {
      this.saveLoading = true // 保存按钮加载状态
      this.url = this.$refs.mycanvas.toDataURL()
      this.myDrawShow = true

      // 获取签名图片原尺寸
      this.oldWidth = this.$refs.mycanvas.offsetWidth
      this.oldHeight = this.$refs.mycanvas.offsetHeight
      const imgBase64 = this.$refs.mycanvas.toDataURL('image/png', 1) // 1表示质量(无损压缩
      // 图片等比例缩放
      this.nameWidth = this.oldWidth / 5 + 'px'
      this.nameHeight = this.oldHeight / 5 + 'px'
      const params = { ...this.params }
      params.image = imgBase64
      params.roleType = Number(params.roleType)
      console.log('旋转前')
      console.log(imgBase64)
      this.rotateBase64Img(
        imgBase64,
        // this.direction == 'horizontal' ? 360 : 270,
        270,
        base64data => {
          params.image = base64data
          tableFileAddSignByCode(params).then(res => {
            this.saveLoading = false
            if (res.state === 100) {
              this.$message.success(res.message)
              setTimeout(() => {
                // window.close()
                if (res.pdfIds) {
                  this.$router.push(`/mobile/filesList?fileIds=${res.pdfIds}`)
                } else {
                  // window.close()
                  window.WeixinJSBridge.call('closeWindow')
                }
              }, 1000)
            }
          })
        }
      )
      return
    },

    /**
     * 绘制笔触
     */
    handleDraw(targetX, targetY) {
      console.log(targetX, targetY)
      console.log(this.ctx)
      this.ctx.lineTo(targetX, targetY) // 将笔触移到当前点击点
      this.ctx.stroke()
    },

    /**
     * 触摸开始
     * 获取当前点击点的坐标
     * 设置线条颜色，宽度，样式等
     */
    onTouchStart(e) {
      const targetX = e.changedTouches[0].clientX - this.stage_info.left // 计算起始点X坐标
      const targetY = e.changedTouches[0].clientY - this.stage_info.top // 计算起始点Y坐标
      console.log(
        'clientX',
        e.changedTouches[0].clientX,
        'stage.top',
        this.stage_info.top
      )
      console.log(
        'clientY',
        e.changedTouches[0].clientY,
        'stage.left',
        this.stage_info.left
      )
      e.preventDefault()
      this.ctx.beginPath()
      this.ctx.strokeStyle = this.lineColor // 设置线条颜色
      this.ctx.lineWidth = this.lineWidth // 设置线条的宽度
      this.ctx.lineCap = 'round' // 设置线条的端点的样式，设为圆弧形
      this.ctx.lineJoin = 'round' // 设置线条的连接点的样式，设为弧形
      this.handleDraw(targetX, targetY)
    },
    /**
     * 触摸过程中
     * 获取并计算当前点击点的坐标，绘制线条
     */
    onTouchMove(e) {
      const targetX = e.changedTouches[0].clientX - this.stage_info.left // 计算起始点X坐标
      const targetY = e.changedTouches[0].clientY - this.stage_info.top // 计算起始点Y坐标
      e.preventDefault()
      this.handleDraw(targetX, targetY)
    },
    /**
     * 触摸结束
     */
    onTouchEnd(e) {
      e.preventDefault()
    },

    // 点击签名，初始化画板
    writeName() {
      this.myDrawShow = true
      this.url = ''
      this.$nextTick(() => {
        // 检查横竖屏
        this.checkScreen()
        // 初始化画板
        this.initCanvas()
        // 监听屏幕旋转
        this.orientationchange()
        // 监听窗体大小改变
        this.onSizeChange()
        setTimeout(() => {
          this.emptyImg = this.$refs.mycanvas.toDataURL('image/png', 1) // 1表示质量(无损压缩
        }, 300)
      })
    },

    close() {
      this.myDrawShow = false
    },
    // 监听窗体大小改变
    onSizeChange() {
      window.onresize = () => {
        console.log('窗体大小改变') // 这里是横屏
        this.clear() // 重置画板
      }
    },
    // 监听屏幕旋转
    // 用此事件获取改变后的屏幕尺寸需要注意：
    //  1）.iphone,可立即获取改变后的屏幕尺寸。
    //  2）.android,获取的尺寸是改变前的。需要设置setTimeout在一段时间后再获取。iScroll4是200ms,建议设成300ms.
    orientationchange() {
      window.addEventListener(
        'orientationchange',
        () => {
          this.$nextTick(() => {
            this.checkScreen() // 检查横竖屏
          })
        },
        false
      )
    },
    checkScreen() {
      // 检查横竖屏
      switch (window.orientation) {
        case 90:
        case -90:
          console.log('横屏') // 这里是横屏
          this.direction = 'horizontal'
          break
        default:
          console.log('竖屏') // 这里是竖屏
          this.direction = 'vertical'
          break
      }
      this.$nextTick(() => {
        this.clear() // 重置画板
      })
    },
    // div转图片
    toImage() {
      this.$nextTick(() => {
        html2canvas(this.$refs.mytext, {
          backgroundColor: '#fff'
          // logging: true,//日志
          // allowTaint:true,//允许加载跨域的图片
        }).then(canvas => {
          const dataURL = canvas.toDataURL('image/jpg')
          console.log('dataURL', dataURL)
          this.dataURL = dataURL
          this.saveLoading = false // 保存按钮加载状态
        })
      })
    },

    // 提交文书
    submitText() {
      if (this.dataURL != '') {
        // 追加base64文书图片,转换角度(横屏不需要旋转图片角度)
        this.rotateBase64Img(
          this.dataURL,
          // this.direction == 'horizontal' ? 360 : 270,
          360,
          base64data => {
          }
        )
      } else {
        this.$dialog.toast({
          mes: '请先签名才能提交！',
          timeout: 1500
        })
      }
    },
    // 旋转base64图片
    rotateBase64Img(src, edg, callback) {
      // 旋转base64图片
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var imgW // 图片宽度
      var imgH // 图片高度
      var size // canvas初始大小
      if (edg % 90 != 0) {
        console.error('旋转角度必须是90的倍数!')
        throw '旋转角度必须是90的倍数!'
      }
      edg < 0 && (edg = (edg % 360) + 360)
      const quadrant = (edg / 90) % 4 // 旋转象限
      const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 } // 裁剪坐标
      var image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = src
      image.onload = function() {
        imgW = image.width
        imgH = image.height
        size = imgW > imgH ? imgW : imgH
        canvas.width = size * 2
        canvas.height = size * 2
        switch (quadrant) {
          case 0:
            cutCoor.sx = size
            cutCoor.sy = size
            cutCoor.ex = size + imgW
            cutCoor.ey = size + imgH
            break
          case 1:
            cutCoor.sx = size - imgH
            cutCoor.sy = size
            cutCoor.ex = size
            cutCoor.ey = size + imgW
            break
          case 2:
            cutCoor.sx = size - imgW
            cutCoor.sy = size - imgH
            cutCoor.ex = size
            cutCoor.ey = size
            break
          case 3:
            cutCoor.sx = size
            cutCoor.sy = size - imgW
            cutCoor.ex = size + imgH
            cutCoor.ey = size + imgW
            break
        }
        ctx.translate(size, size)
        ctx.rotate((edg * Math.PI) / 180)
        ctx.drawImage(image, 0, 0)
        var imgData = ctx.getImageData(
          cutCoor.sx,
          cutCoor.sy,
          cutCoor.ex,
          cutCoor.ey
        )
        if (quadrant % 2 == 0) {
          canvas.width = imgW
          canvas.height = imgH
        } else {
          canvas.width = imgH
          canvas.height = imgW
        }
        ctx.putImageData(imgData, 0, 0)
        callback(canvas.toDataURL())
      }
    }
  }
}
// 图片缩放自适应宽高算法
/**
 * @imgWidth 图片宽
 * @imgHeight 图片高
 * @containerWidth 容器宽度
 * @containerHeight 容器高度
 **/
//   function scalingImage(imgWidth, imgHeight, containerWidth, containerHeight) {
//       var containerRatio = containerWidth / containerHeight;
//       var imgRatio = imgWidth / imgHeight;

//       if (imgRatio > containerRatio) {
//           imgWidth = containerWidth;
//           imgHeight = containerWidth / imgRatio;
//       } else if (imgRatio < containerRatio) {
//           imgHeight = containerHeight;
//          imgWidth = containerHeight * imgRatio;
//       } else {
//          imgWidth = containerWidth;
//           imgHeight = containerHeight;
//       }
//       return { width: imgWidth, height: imgHeight };
//  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#app {
  min-width: auto!important;
}
</style>
<style scoped>
body {
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;

  padding: 0;
}

li {
  display: inline-block;

  margin: 0 10px;
}

a {
  color: #42b983;
}

.cont {
  display: inline-block;
  vertical-align: middle;
}

.cont p {
  transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
}

.buttonDiv {
  width: 70px;
}

.buttonDiv2 {
  height: 15%;
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

#canvas {
  background: #fff;
  cursor: default;
  border: 1px dashed rgb(204, 204, 204);
  height: 100%;
  width: 100%;
}

#keyword-box {
  margin: 10px 0;
}

.mytext {
  font-size: 0.3rem;
  text-align: left;
  line-height: 25px;
  padding: 10px 10px;
  word-wrap: break-word;
}

.mytext h1 {
  font-size: 0.5rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
}

.mydraw {
  height: 100%;
  width: 100%;
}

.mydraw2 {
  height: 100%;
  width: 100%;
  transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}

.commoBtn button {
  transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  margin: 20px 0px;
}

.commoBtn2 button {
  display: inline-block;
  margin: 10px;
}

.canvasDiv {
  width: calc(100% - 100px);
  height: 100vh;
  position: relative;
}

.canvasDiv2 {
  height: 70%;
  width: 100%;
  position: relative;
  transform: rotate(180deg);
}

.signLabelDiv {
  width: 12%;
  font-size: 0.3rem;
}

.signLabelDiv2 {
  height: 12%;
  font-size: 0.3rem;
  transform: rotate(90deg);
  margin-left: -4.5%;
}

.nameDiv {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
}

.nameDiv span {
  margin-right: 45px;
}

.writeName .yd-btn {
  margin-right: 10px;
  padding: 5px 25px;
}

.myName {
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  /* border: 1px solid red; */
  margin-right: 35px;
}

.myName2 {
  /* border: 1px solid red; */
  margin-right: 35px;
}

.real_pic {
  height: 100%;
  width: 100%;
}
</style>
