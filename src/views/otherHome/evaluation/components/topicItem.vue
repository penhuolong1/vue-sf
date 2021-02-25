<template>
  <div class="item">
    <div class="title">{{titleMap[type]}}</div>
    <div class="score">
      <el-slider v-model="infoData.score" class="slider" :class="'my-class-'+type" :show-tooltip="false" :disabled="isDisabled" :min="0" :max="scoreInfo.maxScore" :step="scoreInfo.score" />
      <span class="label">
        分数
        {{scoreInfo.statisticalType === 1 ? '-':'+'}}{{infoData.score}}
        <el-tooltip v-if="infoData && infoData.content && infoData.content.length > 0" class="item" effect="dark"  :content="'评分标准:'+getGrading(infoData.content)" placement="top">
          <img src="@/assets/icon/tips.png">
        </el-tooltip>
        <div class="upload-wrapper" v-if="isEdit">
          <div class="tips">只支持上传doc.docx.pdf.jpg.png文件</div>
          <a class="upload-btn" @click="uploadFile"><img src="@/assets/icon/add-evi.png" alt="">上传文件</a>
          <input ref="file1" type="file" accept=".jpg,png,.doc,.docx,.pdf" style="display: none;" @change="getFile">
        </div>
      </span>
    </div>
    <div class="tap-wrapper" v-if="infoData.content && infoData.content.length > 1">
      <div class="text">选项:</div>
      <div class="tap">
        <el-tooltip v-for="(item, index) in infoData.content" :key="item.id" class="item" effect="dark" :content="item.items" placement="top"> 
          <div  @click="getTap(index)" :class="index == tabIndex ? 'active':''" class="tap-item">要求{{index+1}}</div>
        </el-tooltip>
      </div>
    </div>
    <div v-for="(item, index1) in infoData.content" :key="item.id">
      <div v-if="index1 == tabIndex">
        <div class="file-wrapper" v-if="item.files && item.files.length > 0">
          <div class="file-item" v-for="(item1, index) in item.files" :key="index+'a'" @click="lookurl(item1.path, item.files)">
            <span class="text">{{item1.name}}</span>
            <i v-if="isEdit" class="icon el-icon-close" @click.stop="delFile(item1.path, 1)"></i>
          </div>
        </div>
        <el-input type="textarea" rows="4" v-model="item.content" :disabled="!isEdit"/>
      </div>
    </div>
    <preview ref="preview" :file-url="fileUrl" />
  </div>
</template>

<script>
import {details, upFile, eva} from '@/api/evaluation/index'
import {mapGetters} from 'vuex'
import preview from '@/components/preview/index'
export default {
  components: {
    preview
  },
  props: {
    info: {
      type: Object
    },
    type: {
      type: String,
      default: '1' // 1系统评分 2 自评 3复评
    }
  },
  data() {
    return {
      infoData: {
        score: 0,
        content: [
          {
            files: [],
            items: ''
          }
        ]
      },
      fileUrl: '',
      isEdit: false,
      tabIndex: 0,
      titleMap: {
        1: '系统评分',
        2: '自评',
        3: '复评',
      },
      scoreInfo: {} //分数限制信息
    }
  },
  computed: {
    ...mapGetters(['getAnswerInfo', 'getUserInfo', 'getTitleInfo', 'getEviInfo', 'getOpInfo']),
    typeNum() {
      return this.$route.query.type
    },
    step() {
      return this.$route.query.type
    },
    getGrading() {
      return function(list) {
        let string = ''
        if (!list && list.length == 0) {
          string = ''
        } else {
          list.forEach((item, index) => {
            if (item.items) {
              string += `${index+1}${item.items}`
            }
          })
          return string
        }
        return string
      }
    },
    isDisabled() {
      let flag = true
      if (this.getEviInfo.area == '区' && this.step == 11) { // 区级的指标考核复评结束后统一进行核算。
        flag = true
      } else {
        flag = !this.isEdit
      }
      return flag
    }
  },
  watch: {
    info() {
      if ((!this.info.content || this.info.content.length == 0) && this.info.score == 0) {
        this.infoData = {
          score: 0,
          content: [
            {
              files: [],
              items: ''
            }
          ]
        }
        return
      }
      this.infoData = this.info
      this.infoData.score = Number(this.infoData.score)
      if (!this.info.content || this.info.content.length == 0) {
        this.infoData.content = [
          {
            files: [],
            items: '',
            content: ''
          }
        ]
      }
    },
    typeNum() {
      this.scoreInfo = this.getTitleInfo.evaluation[this.typeNum]
      if (this.scoreInfo.maxScore === 0) { // 如果为0的话最大值为90
        this.scoreInfo.maxScore = 90
        this.scoreInfo.score = 1
      }

    },
    type() {
      this.getIsEdit()
    },
    getTitleInfo() {
      this.scoreInfo = this.getTitleInfo.evaluation[this.typeNum]
      if (this.scoreInfo.maxScore === 0) { // 如果为0的话最大值为90
        this.scoreInfo.maxScore = 90
        this.scoreInfo.score = 1
      }
    },
    getOpInfo() {
      this.getIsEdit()
    }
  },
  created() {
    this.getIsEdit()
    console.log(this.getEviInfo)
  },
  mounted() {

  },
  methods: {
    reset() {
      this.infoData = {
        score: 0,
        content: [
          {
            files: [],
            items: ''
          }
        ]
      }
      this.tabIndex = 0
    },
    getTap(index) {
      console.log(index)
      this.tabIndex = index
    },
    getIsEdit() {
      if (this.type === 1) { // 如果是系统评分则都不能编辑
        this.isEdit = false
      } else if (this.type == 2){ // 如果是自评 只有诉非不能自评
        if (this.getUserInfo.courtId == 1) {
          this.isEdit = false
        } else {
          if (this.getOpInfo.review == 1) { // 复评阶段不能修改自评数据
            this.isEdit = false
          } else {
            if (this.getOpInfo.self == 1) {
              this.isEdit = true
            } else {
              this.isEdit = false
            }
          }
        }
      } else if (this.type == 3) { // 如果是复评只有诉非可以复评
        if (this.getUserInfo.courtId == 1) {
          if (this.getOpInfo.review == 1) {
            this.isEdit = true
          } else {
            this.isEdit = false
          }
        } else {
          this.isEdit = false
        }
      }
    },
    // 预览图片
    lookurl(url, files) {
      this.fileUrl = url
      console.log(files)
      const list1 = files.length > 0 && files.map(item => {
        return item.path
      }) 
      this.$refs.preview.show(url, list1)
    },
    // 删除文件
    delFile(url) {
      const index = this.infoData.content[this.tabIndex].files.findIndex(item => {
        return item.path == url
      })
      console.log(this.infoData.content[this.tabIndex].files)
      this.infoData.content[this.tabIndex].files.splice(index, 1)
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
        const obj = {
          name: res.data.split('/').pop(),
          path: res.data
        }
        this.infoData.content[this.tabIndex].files.push(obj)
        this.$message.success(res.message)
      }).catch(e => {
        this.$Message.destroy()
      })
    },
  }
}
</script>

<style scoped lang="scss">
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
