<template>
  <div class="form-wrapper">
    <el-row :gutter="20" class="form-item">
      <el-col :span="12">
        <div class="btn-item" :class="{'active': receiveType == 1}" @click="getReceiveType(1)">接收</div>
      </el-col>
      <el-col :span="12">
        <div class="btn-item" :class="{'active': receiveType == 2}" @click="getReceiveType(2)">退回</div>
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 2" :gutter="20" class="form-item">
      <el-col :span="4">
        <label>理由</label>
      </el-col>
      <el-col :span="20">
        <el-input v-model="remark" type="textarea" placeholder="请输入退回理由" />
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1" :gutter="20" class="form-item">
      <el-col :span="6">
        <label>诉讼请求</label>
      </el-col>
      <el-col :span="18">
        <el-input v-model="form.ssqq" type="textarea" placeholder="请输入请求事项" />
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1" :gutter="20" class="form-item">
      <el-col :span="6">
        <label>事实与理由</label>
      </el-col>
      <el-col :span="18">
        <el-input v-model="form.reason" type="textarea" placeholder="请输入事实和理由" />
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1" :gutter="20" class="form-item">
      <el-col :span="6" />
      <el-col :span="18">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in fileList" :key="item.id" :label="item.id">
            <span class="text-downline" @click.prevent="previewUrl(item.path)">{{ item.name }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <div class="form-item footer">
      <el-button
        size="small"
        class="submit"
        icon="el-icon-check"
        :loading="loading"
        @click="submit"
      >确定</el-button>
      <el-button
        size="small"
        class="cancel"
        icon="el-icon-close"
        @click="cancel"
      >取消</el-button>
    </div>
    <preview ref="preview" />
  </div>
</template>

<script>
import { transferInfo, acceptance } from '@/api/case/index'
import { mapGetters } from 'vuex'
import preview from '@/components/preview/index'
export default {
  components: {
    preview
  },
  props: {

  },
  data() {
    return {
      receiveType: 1, // 接收状态 1 接收 2退回
      remark: '',
      caseId: '',
      mediaterData: [],
      selectMediaterid: '',
      loginCourtId: '',
      checkList: [],
      form: {},
      fileList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo'])
  },
  watch: {
    getCaseInfo: {
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  created() {
    this.init()
    this.getTransferInfo()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      this.caseId = this.getCaseInfo.id
    },
    // 改变接收状态
    getReceiveType(index) {
      this.receiveType = index
    },
    // 取消
    cancel() {
      this.receiveType = 1 // 接收状态 1 接收 2退回
      this.getTransferInfo()
    },
    // 提交
    submit() {
      const params = {
        caseId: this.getCaseInfo.id
      }
      if (this.receiveType == 1) { // 同意
        params.ssqq = this.form.ssqq
        params.reason = this.form.reason
        params.state = 'receive'
        if (!params.ssqq) {
          this.$message.error('请输入诉讼请求')
          return
        }
        if (!params.reason) {
          this.$message.error('请输入事实与理由')
          return
        }
        if (this.checkList && this.checkList.length > 0) {
          this.checkList.forEach(item => {
            const obj = this.fileList.find(item1 => item1.id === item)
            if (obj.name == '调解协议书') {
              params.protocolId = obj.id
            }
            if (obj.name == '司法确认申请书') {
              params.applyId = obj.id
            }
          })
        }
      } else if (this.receiveType == 2) {
        params.remark = this.remark
        params.state = 'back'
        if (!params.remark) {
          this.$message.error('请输入退回理由')
          return
        }
      }
      this.loading = true
      acceptance(params).then(async res => {
        if (res.state === 100) {
          this.$message.success(res.message)
          await this.$store.dispatch('GetCaseInfo')
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    // 获取表单相关信息
    getTransferInfo() {
      transferInfo({ caseId: this.getCaseInfo.id }).then(({ data, state }) => {
        if (state === 100) {
          this.form = {
            reason: data.reason || '',
            ssqq: data.ssqq || ''
          }
          this.fileList = data.files
          this.checkList = data.files.map(item => item.id)
        }
      })
    },
    // 预览文件
    previewUrl(url) {
      this.$refs.preview.show(url, [url])
    }
  }
}
</script>

<style scoped lang = "scss">
@import './style.scss';
.text-downline {
  text-decoration: underline;
}
</style>
