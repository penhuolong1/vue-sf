<template>
  <div>
    <div class="hand-write-wrapper">
      <el-tooltip v-if="getTeamData.type != 2 " effect="dark" content="签名" placement="top" :hide-after="1500">
        <img src="@/assets/icon/handwrite.png" class="hand-write" alt="" @click.stop="getHandWriteCode">
      </el-tooltip>
      <el-tooltip effect="dark" :content="'电子送达'" placement="top" :hide-after="1500">
        <div class="file-img send-msg" @click.stop="serviceSubmit">
          <i class="el-icon-chat-line-round" />
        </div>
      </el-tooltip>
    </div>
    <el-checkbox-group v-model="checkList">
      <el-row
        v-for="(item,index) in menuList"
        :key="index"
        class="menu-item"
        @click.native="setAction(item.type,item.id)"
      >
        <div :class="{'action' : showAction == item.type}" class="menu-title">
          <span>{{ item.name }}</span>
          <i v-if="item.listFile && item.listFile.length > 0" class="el-icon-arrow-down" @click.stop="showFile(index)" />
        </div>
        <div v-if="item.listFile && item.listFile.length > 0 && item.showFile" class="file-wrapper">
          <div v-for="item1 in item.listFile" :key="item1.id" class="file-item">
            <el-checkbox v-if="isCheck(item1.sign, item1.signType)" :label="item1.id" @click.native.stop>{{ item1.name }}</el-checkbox>
            <span v-else><el-tag v-if="item1.sign" type="success">已签字</el-tag>{{ item1.name }}</span>
          </div>
        </div>
      </el-row>
    </el-checkbox-group>
    <el-dialog
      title="签字二维码"
      :visible.sync="dialogVisible"
      width="50%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div class="code-wrapper">
        <img :src="codeImgUrl" alt="">
        <label>使用微信扫描二维码进行签字</label>
      </div>
    </el-dialog>
    <el-dialog
      title="文书列表"
      :visible.sync="dialogVisible1"
      width="500px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div class="content">
        <el-table
          :data="fileList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label="文书名称"
          />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
      </span>
    </el-dialog>
    <serviceModal ref="serviceModal" />
  </div>
</template>

<script>
import { getCodeForTableFileSign, listFileByCase } from '@/api/dossier/dossier.js'
import serviceModal from '@/components/mediationDossier/serviceModal'
import { mapGetters } from 'vuex'
export default {
  components: {
    serviceModal
  },
  props: {

  },
  data() {
    return {
      menuList: [],
      showAction: 1,
      checkList: [],
      dialogVisible: false,
      codeImgUrl: '',
      dialogVisible1: false,
      fileList: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['getDirList', 'getUserInfo', 'getTeamData', 'getCaseInfo']),
    isCheck() {
      return function(sign, signType) {
        let flag = false
        if (sign) {
          flag = false
        } else {
          if (signType) {
            flag = true
          } else {
            flag = false
          }
        }
        return flag
      }
    }
  },
  watch: {
    getDirList() {
      this.init()
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
    },
    submit1() {
      console.log(this.multipleSelection)
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.error('请先选择文书')
        return
      }
      this.dialogVisible1 = false
      this.$refs.serviceModal.init(this.multipleSelection.map(item => item.id))
    },
    setAction(type, id) {
      this.showAction = type
      this.$emit('setAction', { type, id })
    },
    init() {
      if (this.getDirList && this.getDirList.length > 0) {
        this.menuList = [...this.getDirList].map(item => {
          if (item.listFile && item.listFile.length > 0) {
            item.listFile = item.listFile.map((item1, index1) => {
              if (item.sinInfo && item.sinInfo.length > 0) {
                item1.sign = item.sinInfo[index1].sign
                item1.signType = item.sinInfo[index1].signType
                return item1
              } else {
                return item1
              }
            })
          }
          return item
        })
        console.log('--------------')
        console.log(this.menuList)
        console.log('--------------')
        this.menuList.unshift({
          name: '卷宗封面',
          id: '1',
          type: 1
        })
      }
    },
    serviceSubmit() {
      this.dialogVisible1 = true
      // 获取所有文书
      listFileByCase({ caseId: this.getCaseInfo.id, noService: 1 }).then(res => {
        console.log(res)
        if (res.state === 100) {
          this.fileList = res.infoList
        }
      })
    },
    // 获取签名二维码
    getHandWriteCode() {
      console.log(this.checkList)
      console.log('-------------------')
      if (!this.checkList || this.checkList.length == 0) {
        this.$message.error('请先选择需要签名的文书')
        return
      }
      const params = {
        fileIds: this.checkList.join(',')
      }
      getCodeForTableFileSign(params).then(res => {
        if (res.state === 100) {
          this.$message.success(res.message)
          this.codeImgUrl = '/' + res.path
          this.dialogVisible = true
        }
      })
    },
    showFile(index) {
      console.log(index)
      console.log(this.menuList[index].showFile)
      this.menuList[index].showFile = !this.menuList[index].showFile
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss">
.file-item {
  .el-checkbox {
    width: 100%;
  }
  .el-checkbox__label {
    width: 100%;
    padding-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-checkbox__inner {
    position: relative;
    top: -4px;
  }
}
</style>
<style scoped lang="scss">
.menu-item {
  cursor: pointer;
}
.el-icon-arrow-down {
  padding: 5px;
}
.menu-title {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(218,219,230,0.5);
  display: flex;
  justify-content: space-between;
}
.menu-val {
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-val div {
  width: 20px;
  height: 20px;
  color: #fff;
  background: #23EAA4;
  text-align: center;
}
.action {
  background: rgb(200,230,254);
}
.file-wrapper {
  margin: 5px 0px;
  margin-bottom: 10px;
  padding-left: 20px;
}
.file-item {
  font-size: 14px;
  margin-top: 8px;
  width: 100%;
  ::v-deep.el-checkbox {
    width: 100%;
    ::v-deep.el-checkbox__label {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  span {
  }
}
.el-checkbox-group {
  font-size: 16px;
}
.hand-write-wrapper {
  overflow: hidden;
  margin-top: -20px;
  margin-bottom: 10px;
  cursor: pointer;
}
.hand-write {
  width: 40px;
  float: right;
  margin-right: 10px;
}
.code-wrapper {
  text-align: center;
  img {
    width: 200px;
  }
  label {
    margin-top: 10px;
    display: block;
  }
}
.send-msg {
  width: 40px;
  height: 40px;
  float: right;
  margin-right: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background-color: rgb(122, 194, 70);
  border-radius: 5px;
  color: #fff;
  vertical-align: bottom;
  cursor: pointer;
  margin-left: 20px;
}
.content {
  overflow: auto;
  max-height: 600px;
}
</style>
