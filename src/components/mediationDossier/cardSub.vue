// 身份证明材料复印件
<template>
  <div>
    <div v-show="!imgUrlsList.length" class="mater-upload-wrapper ">
      <input ref="file" type="file" style="display:none;" @change="getFile($event)">
      <div class="upload-content" @click="uploadImg()">
        <img src="@/assets/img/materUpload.png" alt="">
        <div class="tip">png、jpg、doc&pdf最大10MB</div>
        <div class="title">身份证明材料复印件上传</div>
      </div>
    </div>
    <div class="again-box">
      <div v-show="imgUrlsList.length">
        <span class="text-blue">继续上传(png、jpg、doc&pdf最大10MB)</span>
        <el-button class="el-icon-plus" type="primary" @click="uploadImg()" />
      </div>
    </div>
    <div>
      <div v-for="(item,index) in imgUrlsList" :key="index" class="img-list">
        <div>
          <img src="@/assets/img/materUpload.png" alt="">
        </div>
        <div class="del-icon">
          <i class="el-icon-error" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImg } from '@/api/case/index.js'
export default {
  name: 'CardSub',
  components: {

  },
  props: ['showAction', 'coverData'],
  data() {
    return {
      imgUrlsList: []
    }
  },
  methods: {
    // 初始化
    init() {
      this.imgUrlsList = []
      return new Promise((resolve, reject) => {
        if (this.coverData.caseId) {
          resolve(true)
        } else {
          resolve(true)
        }
      })
    },
    uploadImg() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.imgUrlsList.push(res.url)
          this.$refs.file.value = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	@import '~@/styles/variables.scss';
	.upload-wrapper {
		height: 100%;
	}
	.mater-upload-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		.content {
			text-align: center;
			.tip {
			font-size: 12px;
			color: #8a92a5;
			margin-top: 5px;
			}
			.title {
			font-size: 16px;
			color: $themeColor;
			margin-top: 5px;
			}
		}
		.image-show-wrapper {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.no-img {
			font-size: 20px;
			color: #bababa;
			}
			.upload-content {
			flex: 1;
			cursor: pointer;
			}
			.img-wrapper {
				flex: 1;
				height: 80%;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				padding: 10px;
				position: relative;
				&:first-child {
					margin-right: 10px;
				}
				&:last-child {
					margin-left: 10px;
				}
				img {
					width: 100%;
				}
			}
		}
	}
	.upload-content {
		cursor: pointer;
	}
	.img-list {
		position: relative;
		float: left;
		margin: 30px 5%;
		width: 40%;
		height: 200px;
		img {
			width: 100%;
			max-height: 200px;
		}
	}
	.del-icon {
		position: absolute;
		width: 100%;
		bottom: -40px;
		text-align: center;
		cursor: pointer;
		i {
			color: #ec4c4d;
			font-size: 30px;
		}
	}
	.again-box {
		text-align: right;
		.text-blue {
			color: $subMenuActiveText;
			margin-right: 10px;
		}
		::v-deep .el-button {
			padding: 8px;
		}
	}
</style>
