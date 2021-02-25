<template>
  <div>
    <div v-if="imgFlag" class="img-box">
      <div v-show="imgList == 0" class="tip">暂无数据</div>
      <div v-for="(item,index) in imgList" :key="index" class="img-list">
        <div>
          <img :src="item" alt="">
        </div>
        <!-- <div class="del-icon">
                <i class="el-icon-error"></i>
              </div> -->
      </div>
    </div>
    <!-- <div class="operation">
            <p class="el-icon-plus" @click="uploadImg()" style="background:#2176FE"></p>
            <p class="el-icon-check" style="background:#FDC603"></p>
        </div> -->
    <div v-if="!imgFlag && list.length != 1">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        header-align="center"
        stripe
        align="center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="$store.state.user.userInfo.roleName != '法院'"
          type="selection"
          header-align="center"
          align="center"
          width="55"
        />
        <el-table-column
          v-if="type == 8"
          prop="evidenceName"
          label="证据名"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="文件名"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="book-name" @click="showBook(scope.row.path, scope.row.wordPath)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
                        prop="signType"
                        label="页数"
                        header-align="center"
                        align="center"
                        width="80">
                </el-table-column> -->
        <el-table-column
          prop="createDate"
          label="创建时间"
          header-align="center"
          align="center"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="btn-box">
              <el-tooltip v-if="showAction != 18" effect="dark" content="电子送达" placement="top" :hide-after="1500">
                <img src="@/assets/img/mediationRecord/icon2.png" alt="" @click="serviceSubmit(scope.row.id)">
              </el-tooltip>
              <el-tooltip effect="dark" content="下载" placement="top" :hide-after="1500">
                <img src="@/assets/img/mediationRecord/icon3.png" alt="" @click="plaintiffDown(scope.row.path)">
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1500">
                <img v-if="type != 13 && $route.name == 'mediationDossier'" src="@/assets/img/mediationRecord/icon4.png" alt="" @click="del(scope.row.id)">
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="!imgFlag && list.length == 1" class="look-wrapper">
      <img v-if="isImg" :src="lookUrl" alt="">
      <iframe v-if="!isImg" class="once-iframe" :src="lookUrl" frameborder="0" />
    </div>
    <el-dialog
      title="文书预览"
      top="5vh"
      align="center"
      :visible.sync="dialogVisible"
      custom-class="dialog-box"
      :modal-append-to-body="false"
    >
      <img v-if="isImg" :src="lookUrl" alt="">
      <iframe v-if="!isImg" class="iframe" :src="lookUrl" frameborder="0" />
    </el-dialog>
    <serviceModal ref="serviceModal" />
  </div>
</template>

<script>
import { detailDirType, delMediateFile } from '@/api/dossier/dossier.js'
import { delEvi } from '@/api/case/index.js'
import { formatDate } from '@/lib/date.js'
import { OFFICE365RUL, OFFICE365ID, SERVICEURL, HWYURL } from '@/utils/constVal.js'
import { getPreviewUrl } from '@/api/common/common.js'
import serviceModal from '@/components/mediationDossier/serviceModal'
export default {
  name: 'BookTable',
  components: {
    serviceModal
  },
  props: ['coverData', 'showAction'],
  data() {
    return {
      OFFICE365RUL: OFFICE365RUL,
      OFFICE365ID: OFFICE365ID,
      SERVICEURL: SERVICEURL,
      imgFlag: false,
      imgList: [],
      list: [],
      bookUrl: '',
      pdfFlag: false,
      dialogVisible: false,
      id: '',
      type: '',
      multipleSelection: [],
      lookUrl: '',
      isImg: false
    }
  },
  watch: {
    list() {
      if (this.list && this.list.length > 0) {
        this.lookSrc(this.list[0].path || this.list[0].wordPath)
      }
    }
  },
  methods: {
    serviceSubmit(id) {
      this.$refs.serviceModal.init([id])
    },
    serviceSubmit1(onceFlag) {
      if (onceFlag) {
        this.$refs.serviceModal.init([this.list[0].id])
      } else {
        if (!this.multipleSelection.length) {
          console.log('未选择')
          this.$message.error('请选择文书')
          return
        }
        this.$refs.serviceModal.init(this.multipleSelection.map(item => {
          return item.id
        }))
      }
    },
    // 初始化
    init(id, type) {
      this.dialogVisible = false
      this.bookUrl = ''
      this.multipleSelection = []
      if (id) this.id = id
      if (type) this.type = type
      return new Promise((resolve, reject) => {
        if (this.coverData.caseId && this.id) {
          detailDirType({
            mediateTableId: this.coverData.id,
            dirTypeId: this.id
          }).then(res => {
            const jpgFlag = [16]
            if (jpgFlag.indexOf(this.type) != -1) { // 图片
              this.imgFlag = true
              if (res.data && res.data.length) {
                this.imgList = [...res.data]
              } else {
                this.imgList = []
              }
            } else { // pdf
              console.log(this.type)
              this.imgFlag = false
              let data = res.data
              // 多种文件格式
              if (this.type == 8) {
                data = []
                for (const i in res.data) {
                  for (const j in res.data[i].evidenceAttachments) {
                    res.data[i].evidenceAttachments[j].path = res.data[i].evidenceAttachments[j].url
                    res.data[i].evidenceAttachments[j].evidenceName = res.data[i].evidenceName
                    // 假性删除不显示
                    if (res.data[i].evidenceAttachments[j].enable) data.push(res.data[i].evidenceAttachments[j])
                  }
                }
              }
              console.log(data, '************')
              if (data && data.length) {
                for (const i in data) {
                  data[i].createDate = formatDate(new Date(data[i].createDate), 'yyyy-MM-dd hh:mm')
                }
                this.list = [...data]
              } else {
                this.list = []
              }
              const ids = this.list && this.list.length > 0 ? this.list[0].id : ''
              this.$emit('isOnce', this.list.length == 1, ids)
            }
            resolve(true)
          })
        } else {
          console.log('无caseId')
          this.list = []
          resolve(true)
        }
      })
    },
    // 文书链接
    lookSrc(src) {
      const ary = src.split('.')
      console.log(ary[ary.length - 1])
      const ImgTypeAry = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      if (ImgTypeAry.indexOf(ary[ary.length - 1]) != -1) {
        this.isImg = true
        this.lookUrl = src
        return
      }
      this.isImg = false
      if (ary[ary.length - 1] == 'pdf') {
        this.lookUrl = src
        if (src.indexOf(HWYURL) == -1) {
          this.lookUrl = SERVICEURL + src
        }
      } else {
        if (!src) {
          return ''
        }
        let url = src
        if (src.indexOf(HWYURL) == -1) {
          url = SERVICEURL + src
        }
        getPreviewUrl(url).then(res => {
          if (res.code === 200) {
            this.lookUrl = res.data.wpsUrl
          } else {
            this.$message.error('预览文件失败')
            return ''
          }
        })
      }
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    plaintiffDown(item) {
      if (!item) {
        item = this.list[0].path
      }
      // 必须同源才能下载
      var alink = document.createElement('a')
      alink.href = item
      console.log('item', item)
      const aryss = item.split('.')
      const xar = aryss[aryss.length - 2].split('/')
      console.log(xar)
      const type = aryss[aryss.length - 1]
      const name = xar[xar.length - 1]
      console.log(name + '.' + type)
      alink.download = name + '.' + type // 图片名
      console.log(alink)
      alink.click()
    },
    // 删除操作
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(res => {
        if (this.type == 8) {
          // 删除证据
          delEvi({
            eviAIds: id.split(',')
          }).then(res => {
            if (res.state == 100) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.init()
              this.$store.dispatch('GetListDirType')
            }
          })
        } else {
          // 删除文书
          delMediateFile({
            fileIds: id
          }).then(res => {
            if (res.state == 100) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.init()
              this.$store.dispatch('GetListDirType')
            }
          })
        }
      }).catch(res => {
        console.log(res)
      })
    },
    // 批量删除文书
    delDatal(onceFlag) {
      if (onceFlag) {
        this.multipleSelection = [...this.list]
      } else {
        if (!this.multipleSelection.length) {
          this.$message.error('请勾选要删除的文书')
          return
        }
      }
      const fileIdsList = []
      for (const i in this.multipleSelection) {
        fileIdsList.push(this.multipleSelection[i].id)
      }
      this.del(fileIdsList.join(','))
    },
    // 打开预览
    showBook(bookUrl, bookUrl1) {
      this.lookSrc(bookUrl || bookUrl1)
      this.dialogVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
.look-wrapper {
  text-align: center;
}
    .book-name {
        // color:#2475FE;
        cursor: pointer;
    }
    .iframe {
        width: 100%;
        height: 70vh;
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
    .img-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .img-list {
		position: relative;
		// float: left;
        flex-shrink: 0;
		margin: 30px 40px;
		width: 200px;
		height: 300px;
		img {
			width: 100%;
			height: 100%;
			max-width: 200px;
			max-height: 300px;
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
    .once-iframe{
        width: 100%;
        height: 90vh;
        border-bottom: 1px solid #000;
    }
    .tip{
        width: 100%;
        padding: 30px;
        text-align: center;
        font-size: 18px;
    }
    .btn-box {
        span {
            margin-left: 10px;
            cursor: pointer;
        }
        img {
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
        }
    }
</style>
