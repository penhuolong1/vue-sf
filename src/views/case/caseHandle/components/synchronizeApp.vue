<template>
  <!-- 同步调解平台 -->
  <el-dialog
    :close-on-click-modal="false"
    width="80%"
    title="同步数据"
    append-to-body
    :visible.sync="modalVisible"
  >
    <div class="content">
      <h1 v-if="isCheckMedPlat" class="header">同步人民调解平台</h1>
      <el-form v-if="isCheckMedPlat" ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="人民调解平台账号" prop="appUser">
              <el-input v-model="form.appUser" style="width: 100%;" placeholder="请输入账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人民调解平台密码" prop="appPsw">
              <el-input v-model="form.appPsw" type="password" style="width: 100%;" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="isSuccess" label="调解协议" prop="protocolId">
              <elSelectRadio ref="elSelectRadio1" v-model="form.protocolId" :type="1" style="width: 100%;" :placeholder="'请选择调解协议'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="isSuccess" label="结案结论" prop="description">
              <el-input v-model="form.description" type="textarea" style="width: 100%;" placeholder="请输入事实与理由" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h1 v-if="isCheckJudPlat" class="header">同步司法行政平台</h1>
      <judPlat v-if="isCheckJudPlat" ref="judPlat" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="synchronizeApp">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { caseClosedRMTJ, caseClosedSFXZ, closeCase } from '@/api/case/index'
import elSelectRadio from '@/components/elSelectRadio/index'
import judPlat from './judPlat'
import { mapGetters } from 'vuex'
export default {
  components: {
    elSelectRadio,
    judPlat
  },
  props: {
    isCheckJudPlat: { // 是否同步司法行政平台
      type: Boolean,
      default: false
    },
    isCheckMedPlat: { // 是否同步人民调解平台
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalVisible: false,
      form: {},
      rules: {
        appUser: [{ required: true, message: '请先输入账号', trigger: ['blur'] }],
        appPsw: [{ required: true, message: '请先输入密码', trigger: ['blur'] }],
        protocolId: [{ required: true, message: '请选择调解协议', trigger: ['change', 'blur'] }],
        description: [{ required: true, message: '请输入结案结论', trigger: ['blur'] }]
      },
      form1: {},
      rules1: {},
      endtypes: ['当事人达成和解', '当事人撤诉'],
      isLoading: false,
      isSuccess: false // 化解结果是否成功
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      this.isSuccess = this.endtypes.indexOf(this.getCaseInfo.endType) != -1
      console.log('--------234----------')
      console.log(this.getCaseInfo.endType)
      console.log(this.isSuccess)
    },
    show() {
      this.modalVisible = true
    },
    // 同步司法行政
    judPlat() {
      // this.$refs.judPlat.submit()
      this.$refs.judPlat.$refs.form.validate(valid => {
        console.log(valid)
        if (!valid) {
          return
        }
        const params = {
          ...this.$refs.judPlat.params
        }
        console.log(params)
        this.isLoading = true
        caseClosedSFXZ(params).then(res => {
          this.isLoading = false
          console.log(res)
          if (res.state == 100) {
            this.$message.success(res.message)
            closeCase({ caseId: this.getCaseInfo.id }).then(() => {
              this.$store.dispatch('GetCaseInfo')
            })
            this.modalVisible = false
          }
        })
      })
    },
    // 同步调解平台
    medPlat() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        const params = {
          appPsw: this.form.appPsw,
          appUser: this.form.appUser,
          rmtj: {
            description: this.form.description,
            protocolId: this.form.protocolId
          },
          caseId: this.getCaseInfo.id
        }
        if (!this.getCaseInfo.endType) {
          this.$message.error('请先生成化解结果')
          return
        }
        if (this.endtypes.indexOf(this.getCaseInfo.endType) == -1) {
          params.rmtj.state = 1
        } else {
          params.rmtj.state = 0
        }
        this.$Message.loading({
          content: '正在同步，请稍后...',
          duration: 0
        })
        this.isLoading = true
        caseClosedRMTJ(params).then(res => {
          this.isLoading = false
          this.$Message.destroy()
          if (res.state === 100) {
            this.$message.success(res.message)
            this.form = {}
            closeCase({ caseId: this.getCaseInfo.id }).then(() => {
              this.$store.dispatch('GetCaseInfo')
            })
            this.$refs.elSelectRadio1.reset()
            this.modalVisible = false
          }
        })
      })
    },
    // 同步代码
    synchronizeApp() {
      if (this.isCheckJudPlat && !this.isCheckMedPlat) { // 只同步司法行政的情况
        this.judPlat()
      }
      if (this.isCheckMedPlat && !this.isCheckJudPlat) { // 只同步人民调解平台
        this.medPlat()
      }
      if (this.isCheckMedPlat && this.isCheckJudPlat) { // 同时同步司法行政和人民调解平台
        this.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          this.$refs.judPlat.$refs.form.validate(valid => {
            console.log(valid)
            if (!valid) {
              return
            }
            const params = {
              appPsw: this.form.appPsw,
              appUser: this.form.appUser,
              rmtj: {
                description: this.form.description,
                protocolId: this.form.protocolId
              },
              caseId: this.getCaseInfo.id
            }
            if (!this.getCaseInfo.endType) {
              this.$message.error('请先生成化解结果')
              return
            }
            if (this.endtypes.indexOf(this.getCaseInfo.endtype) == -1) {
              params.rmtj.state = '1'
            } else {
              params.rmtj.state = '0'
            }
            this.$Message.loading({
              content: '正在同步，请稍后...',
              duration: 0
            })
            this.isLoading = true
            caseClosedRMTJ(params).then(res => {
              this.isLoading = false
              this.$Message.destroy()
              if (res.state === 100) {
                const params1 = {
                  ...this.$refs.judPlat.params
                }
                caseClosedSFXZ(params1).then(res => {
                  this.isLoading = false
                  console.log(res)
                  if (res.state == 100) {
                    this.$message.success(res.message)
                    this.form = {}
                    closeCase({ caseId: this.getCaseInfo.id }).then(() => {
                      this.$store.dispatch('GetCaseInfo')
                    })
                    this.$refs.elSelectRadio1.reset()
                    this.modalVisible = false
                  }
                })
              } else {
                this.isLoading = false
              }
            })
          })
        })
      }
    },
    cancel() {
      this.modalVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  padding-right: 12px;
  width: 150px;
  text-align: right;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
}
.content {
  max-height: 500px;
  overflow: auto;
}
</style>
