<template>
  <el-dialog
    :close-on-click-modal="false"
    width="500px"
    title="化解结果"
    append-to-body
    :visible.sync="modalVisible"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form">
      <el-form-item v-if="receiveType==1" label="化解结果" prop="litigantId">
        <el-select v-model="form.result" style="width: 300px;" placeholder="请选择化解结果">
          <!-- <el-option v-for="(item,index) in mediateResult" :key="index" :label="item.label" :value="item.id" /> -->
          <el-option-group
            v-for="(item, index) in mediateResult"
            :key="index"
            :label="item.label"
          >
            <el-option
              v-for="(item1, index1) in item.children"
              :key="index1"
              :label="item1.label"
              :value="item1.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item v-if="receiveType==1" label="结案日期" prop="provideDate">
        <!-- <el-input v-model="form.provideDate" /> -->
        <el-date-picker
          v-model="form.caseEndDate"
          style="width: 300px;"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item v-if="!isRtcRoom && isSuccessType" label="解纷方案">
        <!-- <el-input v-model="form.provideDate" /> -->
        <el-input v-model="form.method" style="width: 300px;" type="textarea" />
      </el-form-item>
      <el-form-item v-if="receiveType==1 && form.result == '其他'" label="其他事由">
        <!-- <el-input v-model="form.provideDate" /> -->
        <el-input v-model="form.otherMark" style="width: 300px;" type="textarea" />
      </el-form-item>
      <el-form-item v-if="receiveType==2" label="退回理由">
        <!-- <el-input v-model="form.provideDate" /> -->
        <el-input v-model="disOpinion" style="width: 300px;" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  endCase,
  updateResult
} from '@/api/case/index.js'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    isRtcRoom: { // 是否是从调解室那边调用该组件的
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      receiveType: 1,
      caseId: '',
      form: {},
      isLoading: false,
      modalVisible: false,
      disOpinion: '',
      successTypes: ['当事人达成和解', '当事人撤诉'],
      mediateResult: [
        {
          label: '化解成功',
          children: [
            {
              id: '当事人达成和解',
              label: '当事人达成和解'
            },
            {
              id: '当事人撤诉',
              label: '当事人撤诉'
            }
          ]
        },
        {
          label: '化解失败',
          children: [
            {
              id: '联系不到当事人',
              label: '联系不到当事人'
            },
            {
              id: '当事人撤回调解请求',
              label: '当事人撤回调解请求'
            },
            {
              id: '当事人明确表示不接受调解',
              label: '当事人明确表示不接受调解'
            },
            {
              id: '双方分歧较大且难以达成调解协议',
              label: '双方分歧较大且难以达成调解协议'
            },
            {
              id: '其他',
              label: '其他(请备注说明)'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    isSuccessType() {
      return this.successTypes.indexOf(this.form.result) != -1
    }
  },
  watch: {
    dialogFormVisible() {
      this.modalVisible = this.dialogFormVisible
    },
    getCaseInfo: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      this.form = {
        method: this.getCaseInfo.method
      }
    },
    // 重置数据
    reset() {
      this.receiveType = 1
      this.form = {}
      this.disOpinion = ''
    },
    submit() {
      const params = {
        caseId: this.getCaseInfo.id,
        endTime: formatDate(
          new Date(this.form.caseEndDate).getTime(),
          'YYYY-MM-DD H:m:s'
        ),
        endType: this.form.result,
        method: this.form.method
      }
      if (!params.endTime) {
        this.$message({
          showClose: true,
          message: '请先选择结案日期',
          type: 'error'
        })
        return
      }

      if (!params.endType && params.endType !== 0) {
        this.$message({
          showClose: true,
          message: '请先选择化解结果',
          type: 'error'
        })
        return
      }
      if (this.isSuccessType) {
        if (!params.method) {
          this.$message({
            showClose: true,
            message: '请输入解纷方案',
            type: 'error'
          })
          return
        }
      }
      if (params.endType == '其他') {
        params.otherMark = this.form.otherMark
        if (!params.otherMark) {
          this.$message({
            showClose: true,
            message: '请先输入其他事项',
            type: 'error'
          })
          return
        }
      }
      this.isLoading = true
      let flag = false
      if (this.isRtcRoom) { // 是否在调解室中产生化解结果
        this.$confirm('化解结果生成后该案件将不能再进行调解,是否生成?')
          .then(_ => {
            if (this.getCaseInfo.process < 6) { // 有化解结果的时候调修改接口
              endCase(params).then(res => {
                this.isLoading = false
                if (res.state === 100) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                  })
                  this.$store.dispatch('GetCaseInfo')
                  this.reset()
                  this.cancel()
                }
              })
            } else {
              updateResult(params).then(res => {
                this.isLoading = false
                if (res.state === 100) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                  })
                  this.$store.dispatch('GetCaseInfo')
                  this.reset()
                  this.cancel()
                }
              })
            }
          }).catch(() => {
            flag = false
          })
      } else {
        flag = true
      }
      if (!flag) {
        return
      }
      if (this.getCaseInfo.process < 6) { // 有化解结果的时候调修改接口
        endCase(params).then(res => {
          this.isLoading = false
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.$store.dispatch('GetCaseInfo')
            this.reset()
            this.cancel()
          }
        })
      } else {
        updateResult(params).then(res => {
          this.isLoading = false
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.$store.dispatch('GetCaseInfo')
            this.reset()
            this.cancel()
          }
        })
      }
    },
    // 取消
    cancel() {
      this.$emit('update:dialogFormVisible', false)
    },
    closeDialog() {
      this.$emit('update:dialogFormVisible', false)
    },
    getReceiveType(index) {
      this.receiveType = index
    }
  }
}
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
