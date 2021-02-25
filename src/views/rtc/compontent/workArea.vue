<template>
  <div>
    <div class="title">
      案件结果
    </div>
    <div class="content">
      <a v-if="isCanAddResult" @click="addResult">{{ getCaseInfo.endType || '点击输入案件结果' }}</a>
      <span v-else>{{ getCaseInfo.endType || '暂无' }}</span>
    </div>
    <div class="title">
      解纷方案
    </div>
    <div class="content">
      <a v-if="isCanAddResult" @click="addMethod">{{ getCaseInfo.method || '点击输入解纷方案' }}</a>
      <span v-else>{{ getCaseInfo.method || '暂无' }}</span>
    </div>
    <resolveResult :dialog-form-visible.sync="resolveResultModal" :is-rtc-room="isRtcRoom" />
    <h1 class="title title-btn">
      <span>文书</span>
      <div class="add-evi" @click="showFile">
        添加
      </div>
    </h1>
    <div class="file-wrapper">
      <div v-for="(item, index) in fileList" :key="index" class="file-item" @click="preview(item)"><a>{{ item.name }}</a></div>
    </div>
    <preview ref="preview" :file-list="fileUrl" />
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      title="解纷方案"
      append-to-body
      :visible.sync="modalVisible"
    >
      <el-form ref="form" :model="form">
        <el-form-item label="解纷方案">
          <!-- <el-input v-model="form.provideDate" /> -->
          <el-input v-model="form.method" style="width: 300px;" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import preview from '@/components/preview/index.vue'
import resolveResult from '@/views/case/caseHandle/components/resolveResult.vue'
import { mapGetters } from 'vuex'
import { updateMethod } from '@/api/case/index.js'
import { listFileByCase } from '@/api/dossier/dossier.js'
export default {
  components: {
    resolveResult,
    preview
  },
  props: {

  },
  data() {
    return {
      resolveResultModal: false,
      isRtcRoom: true,
      fileList: [],
      fileUrl: [],
      modalVisible: false,
      isLoading: false,
      form: {}
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo', 'getTeamData', 'getDirList']),
    isCanAddResult() {
      if (this.getUserInfo.roleType == 3 || this.getTeamData.type == 2) { // 当事人和案件协同者没有生成案件结果的权限
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    getDirList() {
      this._getlistFileByCase()
    },
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    this._getlistFileByCase()
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      this.$set(this.form, 'method', this.getCaseInfo.method || '')
    },
    addResult() {
      this.resolveResultModal = true
    },
    showFile() {
      this.$emit('showFile')
      this._getlistFileByCase()
    },
    _getlistFileByCase() {
      if (!this.getCaseInfo.id) {
        return
      }
      listFileByCase({ caseId: this.getCaseInfo.id }).then(res => {
        if (res.state === 100) {
          this.fileList = res.infoList
          this.fileUrl = res.infoList && res.infoList.length > 0 ? res.infoList.map(item => {
            return item.path
          }) : []
        }
      })
    },
    preview(item) {
      this.$refs.preview.show(item.path)
    },
    submit() {
      const params = {
        caseId: this.getCaseInfo.id,
        method: this.form.method
      }
      if (!params.method) {
        this.$message.error('请输入解纷方案')
        return
      }
      this.isLoading = true
      updateMethod(params).then(res => {
        this.isLoading = false
        if (res.state === 100) {
          this.$message.success(res.message)
          this.$store.dispatch('GetCaseInfo')
          this.modalVisible = false
        }
      })
    },
    addMethod() {
      this.modalVisible = true
    },
    cancel() {
      this.modalVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  min-height: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 14px;
  border-bottom: 1px solid rgba(218,219,230,0.5);
}
.file-wrapper {
  padding-left: 10px;
  margin-top: 10px;
  .file-item {
    font-size: 14px;
    margin-bottom: 8px;
    color: #000;
    line-height: 1.3;
    position: relative;
    padding-left: 10px;
    cursor: pointer;
  }
}
.title-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .add-evi {
    img {
      width: 17px;
      height: 18px;
      margin-right: 5px;
    }
    display: flex;
    align-items: center;
    padding: 0px 20px;
    height: 35px;
    background: rgba(0,151,254,0.15);
    color: #1b85cf;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
  }
}
</style>
