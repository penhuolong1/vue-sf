<template>
  <div class="wrapper">
    <div class="header">
      <h1>{{title}}</h1>
      <!-- 如果是诉非需要开启复评才能修改信息 -->
      <el-button v-if="!isNext" round size="mini" class="btn-col1" @click="save">保存, {{isLastStep ? '返回首页':'下一题'}}</el-button>
      <el-button v-if="isNext" round size="mini" class="btn-col1" @click="next">{{isLastStep ? '返回首页':'下一题'}}</el-button>
      <el-button v-if="getAnswerInfo.index !== 0" round size="mini" class="btn-col2" @click="back">上一题</el-button>
    </div>
    <div class="tip" v-if="step == 11">*该项在复评结束后统一进行核算。</div>
    <div class="content">
      <topicItem ref="topicItem" :info="info.system" type="1" :isEdit="false"></topicItem>
      <topicItem ref="topicItem1" :info="info.self" type="2" :isEdit="isEdit1"></topicItem>
      <topicItem ref="topicItem2" :info="info.review" type="3" :isEdit="isEdit2"></topicItem>
    </div>
  </div>
</template>

<script>
import {details, upFile, eva} from '@/api/evaluation/index'
import {mapGetters} from 'vuex'
import topicItem from './topicItem'
export default {
  components: {
    topicItem
  },
  props: {
    courtId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {
      },
      isEdit1: true, //编辑自评 
      isEdit2: true, //编辑复评 
      isSelf: true, // true 为自评false为复评
      fileUrl: ''
    }
  },
  computed: {
    ...mapGetters(['getAnswerInfo', 'getUserInfo', 'getTitleInfo', 'getEviInfo', 'getOpInfo']),
    title() {
      if (!this.getAnswerInfo.id) {
        return ''
      }
      const info = this.getAnswerInfo.info
      return `${info.orders}.${info.title}${info.content}(${info.scores})`
    },
    step() {
      return this.$route.query.type
    },
    isNext() { //显示下一题还是（直接查看下一题） 保存下一题（掉接口的）
      let flag = false
      if (this.getUserInfo.courtId == 1) { // 如果登陆角色为诉非的话就是复评
        if (this.getOpInfo.review == 1) { // 又复评权限 则下一步的时候需要掉保存按钮
          flag = false
        } else {
          flag = true
        }
      } else { // 不是诉非为自评阶段
        if (this.getOpInfo.review == 1) { // 如果在复评阶段 则自评的时候下一题不需要掉保存接口
          flag = true
        } else { // 如果不是复评阶段 或者是考评已经结束的状态 需按照是否是自评状态来显示
          if (this.getOpInfo.self == 1) { // 自评阶段下一题需要保存接口
            flag = false
          } else {
            flag = true
          }
        }
      }
      return flag
    },
    isLastStep() {
      const num = Number(this.$route.query.type)
      if (!this.getTitleInfo || !this.getTitleInfo.evaluation) {
        return false
      }
      return this.getTitleInfo.evaluation.length - 1 == num
    }
  },
  watch: {
    getAnswerInfo() {
      console.log(this.getAnswerInfo)
      this.getDetails()
    }
  },
  created() {
    // 只有诉非联动中心才能复评其他的都是自评
    if (this.getUserInfo.courtId == 1) {
      this.isEdit1 = false
      this.isEdit2 = true
      this.isSelf = false
    } else {
      this.isEdit1 = true
      this.isEdit2 = false
      this.isSelf = true
    }
  },
  mounted() {

  },
  methods: {
    reset() {
      this.$refs.topicItem.reset()
      this.$refs.topicItem1.reset()
      this.$refs.topicItem2.reset()
    },
    // 返回上一题
    back() {
      const num = Number(this.$route.query.type)
      this.reset()
      this.$router.push({path:`/evaluation/answer?type=${num-1}`})
    },
    next() {
      this.reset()
      const num = Number(this.$route.query.type)
      if (this.getTitleInfo.evaluation.length - 1 == num) {
        if (this.getEviInfo.area == '市') {
          this.$router.push({path:`/evaluation/city`})
        }
        if (this.getEviInfo.area == '区') {
          this.$router.push({path:`/evaluation/area`})
        }
      } else {
        this.$router.push({path:`/evaluation/answer?type=${num+1}`})
      }
    },
    // 提交
    save() {
      console.log(this.per2)
      let info = null
      if (this.isSelf) {
        info = this.$refs.topicItem1.infoData
      } else {
        info = this.$refs.topicItem2.infoData
      }
      let content = []
      if (info.content && info.content.length > 0) {
        content = info.content.map(item => {
          return {
            id: item.detail,
            content: item.content,
            files: item.files.length > 0 ? item.files.map(item => {
              return item.path
            }):[]
          }
        })
      }
      const params = {
        type: this.isSelf ? '单位自评':'中心复评',
        id: this.getAnswerInfo.id,
        score: `${info.score}`,
        contents: content
      }
      if (!this.isSelf) { // 复评的时候需要传机构id
        params.courtId = this.courtId
      }
      eva(params).then(res => {
        if (res.state === 100) {
          this.$message.success(res.message)
          this.reset()
          const num = Number(this.$route.query.type)
          const params = {
            type: this.getEviInfo.area,
            courtId: this.getEviInfo.courtId
          }
          this.$store.dispatch('GetTitle', params)
          if (this.getTitleInfo.evaluation.length - 1 == num) {
            if (this.getEviInfo.area == '市') {
              this.$router.push({path:`/evaluation/city`})
            }
            if (this.getEviInfo.area == '区') {
              this.$router.push({path:`/evaluation/area`})
            }
          } else {
            this.$router.push({path:`/evaluation/answer?type=${num+1}`})
          }
        }
      })
    },
    // 预览图片
    lookurl(url, list) {
      this.fileUrl = url
      this.$refs.preview.show(url, list)
    },
    // 删除文件
    delFile(url, index) {
      if (index == 1) { // 自评
        console.log(this.fileList1.indexOf(url))
        this.fileList1.splice(this.fileList1.indexOf(url), 1)
      } else {
        this.fileList2.splice(this.fileList2.indexOf(url), 1)
      }
    },
    // 获取页面数据
    getDetails() {
      const params = {
        id: this.getAnswerInfo.id,
        courtId: this.courtId || ''
      }
      details(params).then(res => {
        if (res.state === 100) {
          this.info = res.data
        }
      })
    },
    uploadFile() {
      this.$refs.file1.value = ''
      this.$refs.file1.dispatchEvent(new MouseEvent('click'))
    },
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('files', file) // 通过append向form对象添加数据
      this.$Message.loading({
        content: '正在上传，请稍后...',
        duration: 0
      })
      upFile(param).then(res => {
         this.$Message.destroy()
        if (res.state === 100) {
          if (this.isSelf) {
            this.fileList1.push(res.data)
          } else {
            this.fileList2.push(res.data)
          }
          this.$message.success(res.message)
        }
      }).catch(e => {
        this.$Message.destroy()
      })
    },
  }
}
</script>

<style scoped lang="scss">
.tip {
  color: #f56c6c;
  font-size: 14px;
}
.wrapper {
  padding: 15px!important;
  box-shadow: 2px 3px 10px 0px rgba(119,119,119,0.1);
  h1 {
    display: inline-block;
    line-height: 1.5;
  }
  .btn-col1 {
    background-color: #2A96D6;
    border-color: #2A96D6;
    color: #fff;
  }
  .btn-col2 {
    background-color: #83c9ef;
    border-color: #83c9ef;
    color:#fff;
  }
  .content {
    .title {
      font-size: 14px;
      margin-top: 30px;
    }
    .score {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .slider {
        width: 400px;
        margin-left: 10px;
      }
      .label {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 10px;
        img {
          width: 20px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
    .item {
      position: relative;
    }
    .upload-wrapper {
      position: absolute;
      right: 0px;
      display: flex;
      align-items: center;
      .tips {
        font-size: 14px;
        color: #BDBDBD;
      }
      .upload-btn {
        width: 120px;
        height: 35px;
        color: #1B85CF;
        background-color: rgba(0,151,254,0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        img {
          margin-right: 10px;
          width: 15px;
        }
      }
    }
  }
}
.my-class-1 {
  ::v-deep.el-slider__runway {
    background-color: rgba(0,151,254,0.1);
  }
  ::v-deep.el-slider__bar {
    background-color: rgba(131,201,239,1);
  }
  ::v-deep.el-slider__button {
    border: 2px solid rgba(131,201,239,1);
  }
}
.my-class-2 {
  ::v-deep.el-slider__runway {
    background-color: rgba(255,132,35,0.1);
  }
  ::v-deep.el-slider__bar {
    background-color: rgba(255,132,35,1);
  }
  ::v-deep.el-slider__button {
    border: 2px solid rgba(255,132,35,1);
  }
}
.my-class-3 {
  ::v-deep.el-slider__runway {
    background-color:rgba(113,216,117,0.1);
  }
  ::v-deep.el-slider__bar {
    background-color:rgba(113,216,117,1);
  }
  ::v-deep.el-slider__button {
    border: 2px solid rgba(113,216,117,1);
  }
}
.file-wrapper {
  width: 500px;
  padding-bottom: 10px;
  .file-item {
    display: flex;
    background: #f5f5f5;
    color: #bdbdbd;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin-bottom: 5px;
    padding-left: 20px;
    .text {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon {
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.tap-wrapper {
  display: flex;
  height: 40px;
  align-items: center;
  margin-bottom: 20px;
  .text {
    font-size: 14px;
  }
  .tap {
    display: flex;
    .tap-item {
      cursor: pointer;
      height: 100%;
      width: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f3f3f3;
      color: #6A707E;
      height: 40px;
      margin-left: 10px;
      &.active {
        background: #83c9ef;
        color: #fff;
      }
    }
  }
}
</style>
