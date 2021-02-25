<template>
  <div style="padding:20px">
    <div v-show="!imgUrlsList.length" class="mater-upload-wrapper">
      <div class="content">
        <input ref="file" type="file" style="display:none;" @change="getFile($event)">
        <div class="upload-content" @click="uploadImg()">
          <img src="@/assets/img/uploadEnclosure.png" alt="">
          <div class="tip">pdf最大10MB</div>
          <div class="title">民事裁定书上传</div>
        </div>
      </div>
    </div>
    <div v-show="imgUrlsList.length">
      <div class="operation">
        <p class="el-icon-plus" style="background:#2176FE" @click="uploadImg()" />
        <p class="el-icon-check" style="background:#FDC603" />
      </div>
      <div>
        <div v-for="(item,index) in imgUrlsList" :key="index" class="img-list">
          <div>
            <iframe style="border-bottom:1px solid #000" :src="item.path" frameborder="0" />
          </div>
          <!-- <div class="del-icon">
                    <i class="el-icon-error" @click="del(item)"></i>
                </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  detailDirType,
  uploadCivilRuling,
  createCivilRuling,
  delMediateFile
} from '@/api/dossier/dossier.js'
export default {
  name: 'RuleBook',
  props: ['showAction', 'coverData'],
  data() {
    return {
      actionId: '',
      imgUrlsList: []
    }
  },
  methods: {
    // 初始化
    init(id) {
      if (id) {
        this.actionId = id
      }
      return new Promise((resolve, reject) => {
        if (this.coverData.caseId) {
          detailDirType({
            mediateTableId: this.coverData.id,
            dirTypeId: this.actionId
          }).then(res => {
            if (res.data) {
              this.imgUrlsList = [...res.data]
            } else {
              this.imgUrlsList = []
            }
            resolve(true)
          })
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
      uploadCivilRuling(param).then(res => {
        if (res.state === 100) {
          this.$refs.file.value = ''
          createCivilRuling({
            caseId: this.coverData.caseId,
            url: res.url
          }).then(rs => {
            if (rs.state === 100) {
              this.$message({
                showClose: true,
                message: '上传成功',
                type: 'success'
              })
              this.init()
            }
          })
        }
      })
    },

    del(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMediateFile({
          fileIds: item.id
        }).then(res => {
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.init()
          }
        })
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
	        cursor: pointer;
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
    .operation {
        position: relative;
        display: flex;
        margin-bottom: 24px;
    }
    .operation p{
        margin-right: 25px;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        line-height: 40px;
        text-align: center;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
    }
    .img-list {
		position: relative;
		float: left;
		margin: 30px 5%;
		width: 40%;
		height: 400px;
		iframe {
			width: 100%;
			height: 400px;
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
</style>
