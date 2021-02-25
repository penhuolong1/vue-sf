<template>
  <div>
    <el-row class="content">
      <el-col :span="18" class="left-content">
        <el-row class="left-content-content">
          <el-row class="rowH">
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">用户名:</el-col>
                <el-col :span="16">{{ form1.name }}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">角色:</el-col>
                <el-col :span="16">{{ form1.role }}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-for="(item,key) in form1.courtInfoList" :key="key" class="rowH">
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">所属单位:</el-col>
                <el-col :span="16">{{ item.unitInfo }}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">所属组织:</el-col>
                <el-col :span="16">{{ item.courtName }}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="rowH">
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">手机:</el-col>
                <el-col :span="16">{{ form1.telephone }}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">邮箱:</el-col>
                <el-col :span="16">{{ form1.emial }}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="isQrCode" class="rowH">
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="contentSpan">单位二维码:</el-col>
                <el-col :span="16">
                  <img class="img" :src="qrCodeImg">
                  <el-button type="primary" size="mini" style="width: 70px;" @click="downImg">下载</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="6" class="right-content">
        <el-row>
          <el-image class="right-content-img" style="cursor: pointer;" :src="form1.url" :fit="fit[0]" />
        </el-row>
        <!-- <el-row :gutter="10">
          <el-button type="primary" style="width: 165px;" @click="submitImg">点击上传头像图片</el-button>
          <input ref="file" type="file" style="display:none" @change="uploadImg($event)">
        </el-row> -->
      </el-col>
      <el-button type="primary" style="width: 165px;" @click="submitImg">点击上传头像图片</el-button>
      <input ref="file" type="file" accept=".jpg,.png,.JPG,.PNG" style="display:none" @change="uploadImg($event)">
    </el-row>
  </div>
</template>

<script>
import { uploadImg } from '@/api/team/team'
import { getScan, fileDownload } from '@/api/common/common'
import { saveAdminImg } from '@/api/otherHome/account'
import { BASEIMGURL } from '@/utils/constVal.js'
import { mapGetters } from 'vuex'
export default {
  props: {
    form1: {
      type: Object,
      default: function() {
        return {
          form1: {
            name: '',
            telephone: '',
            role: '',
            emial: '',
            courtInfoList: [],
            url: ''
          }
        }
      }
    },
    fatherMoth: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      fit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      qrCodeImg: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    isQrCode() { // 是否需要机构二维码
      let flag = false
      if (this.getUserInfo.roleType == 1) { // 只有机构有单位二维码
        if (this.getUserInfo.courtType == 0) { // 联动中心没有该二维码
          flag = false
        } else {
          flag = true
        }
      } else {
        flag = false
      }
      return flag
    }
  },
  mounted() {
    this.getQrCodeImg()
  },
  methods: {
    getQrCodeImg() {
      const params = {
        url: `${BASEIMGURL}/addcase?type=1&courtId=${this.getUserInfo.courtUid}`
      }
      getScan(params).then(res => {
        if (res.state == 100) {
          this.qrCodeImg = res.data.path
        }
      })
    },
    // 下载二维码
    downImg() {
      fileDownload(this.qrCodeImg)
    },
    submitImg() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    // 上传头像
    uploadImg(e) {
      console.log(e)
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then((res) => {
        if (res.state === 100) {
          const data = {
            imgUrl: res.data.imgPath
          }
          saveAdminImg(data).then(res => {
            if (res.state == 100) {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'success'
              })
              this.fatherMoth()
            }
          })
        }
      })
    }

  }
}
</script>

<style scoped lang = "scss">
.img {
  width: 200px;
  height: 200px;
  display: block;
  margin-bottom: 10px;
}
.el-row {
    width: 100%;
    height: 100%;
    &.content{
        margin-top:60px;
        .el-form-item{
            margin-bottom:65px;
        }
         .left-content-content{
            .rowH{
                height:105px;
            }
            .contentSpan{
                text-align:right;
                padding-right: 10px;
            }
        }
        .right-content{
            height: 250px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .right-content-img{
                width: 165px;
                height: 205px;
                margin-bottom:10px;
            }
        }
    }
}

</style>
