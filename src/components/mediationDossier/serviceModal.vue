<template>
  <!-- 文书送达模态框 -->
  <el-dialog
    title="短信送达"
    :visible.sync="dialogVisible"
    width="500px"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <div class="content">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="案号" prop="caseNo">
          <el-input v-model="form.caseNo" placeholder="请输入案号" />
        </el-form-item>
        <el-form-item label="收件人" prop="litigantIds">
          <el-select ref="select" v-model="form.litigantIds" multiple :multiple-limit="multipleLimit" style="width: 100%;" placeholder="请选择收件人（最多4人）">
            <el-option
              v-for="item in litigantList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送达方式" prop="litigantIds">
          <el-radio v-model="sendType" :label="1">短信送达</el-radio>
          <el-radio v-model="sendType" :label="2">邮箱送达</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :load="loading" @click="submit">确 定</el-button>
    </span>
    <el-dialog
      title="代理人关系"
      :visible.sync="dialogVisible1"
      width="500px"
      :append-to-body="true"
      :before-close="handleClose1"
    >
      <div class="content">
        <el-form label-width="100px">
          <el-form-item label="代理人关系">
            <el-select v-model="relationship" style="width: 100%;" placeholder="请选择">
              <el-option
                v-for="item in relationshipList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" :load="loading" @click="selectrelationship">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { proofOfService } from '@/api/dossier/dossier.js'
import { mapGetters } from 'vuex'
export default {
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      id: [],
      form: {
        litigantIds: []
      },
      rules: {
        litigantIds: [
          { required: true, message: '请选择收件人', trigger: 'change' }
        ],
        caseNo: [
          { required: true, message: '请输入案号', trigger: 'blur' }
        ]
      },
      multipleLimit: 0,
      loading: false,
      sendType: 1,
      litigantList: [],
      relationship: '', // 代理人关系
      laywerId: '', // 代理人id
      laywerIdList: [], // 所选代理人关系列表
      relationshipList: [
        {
          id: '委托诉讼代理人',
          name: '委托诉讼代理人'
        },
        {
          id: '法定代表人',
          name: '法定代表人'
        },
        {
          id: '法定代理人',
          name: '法定代理人'
        },
        {
          id: '同住成年家属',
          name: '同住成年家属'
        },
        {
          id: '法人、组织负责收件人员',
          name: '法人、组织负责收件人员'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
    'form.litigantIds': function(nVal, oVal) {
      console.log(nVal)
      if (nVal.length > oVal.length) { // 添加当事人的时候
        this.isLawyer(nVal, oVal)
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 选择代理人关系
    selectrelationship() {
      if (this.laywerIdList && this.laywerIdList.length > 0) {
        const index = this.laywerIdList.findIndex(item => {
          return item.laywerId == this.laywerId
        })
        if (index >= 0) {
          this.laywerIdList[index].relationship = this.relationship
        } else {
          this.laywerIdList.push({
            laywerId: this.laywerId,
            relationship: this.relationship
          })
        }
      } else {
        this.laywerIdList.push({
          laywerId: this.laywerId,
          relationship: this.relationship
        })
      }
      this.dialogVisible1 = false
      console.log(this.laywerIdList)
    },
    handleClose1() {
      this.dialogVisible1 = false
    },
    // 找出两个数组不一样的数据
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    // 判断是否是代理人
    isLawyer(arr1, arr2) {
      const id = this.getArrDifference(arr1, arr2)
      const type = this.litigantList.find(item => {
        return item.id == id
      }).type
      if (type == 2) { // 如果是代理人让他选择代理人关系
        this.dialogVisible1 = true
        this.laywerId = id[0]
        this.$refs.select.blur()
      }
    },
    init(id) {
      this.multipleLimit = 0
      this.dialogVisible = true
      this.id = id
      this.getLitightList()
    },
    // 获取当事人信息
    getLitightList() {
      this.litigantList = []
      if (!this.getCaseInfo.litigants || this.getCaseInfo.litigants.length == 0) {
        return
      }
      this.getCaseInfo.litigants.forEach(item => {
        if (item.enable) {
          this.litigantList.push({
            name: item.litigantName,
            id: item.id,
            type: 1 // 当事人
          })
          if (item.lawyer && item.lawyer.length > 0) {
            item.lawyer.forEach(item1 => {
              if (item1.enable) {
                this.litigantList.push({
                  name: `${item1.agentName}(代理人)`,
                  id: item1.id,
                  type: 2 // 代理人
                })
              }
            })
          }
        }
      })
      if (this.litigantList.length > 4) {
        this.multipleLimit = 4
      }
    },
    submit() {
      this.$refs.form.validate(validate => {
        if (!validate) {
          return
        }
        let flag = false
        const litigantIds = [...this.form.litigantIds]
        litigantIds.forEach((item, index) => {
          const type = this.litigantList.find(item1 => item1.id == item).type
          if (type == 2) {
            const idx = this.laywerIdList.findIndex(item1 => item1.laywerId == item)
            if (idx == -1) {
              this.$message.error('请给代理人选择对应的关系')
              flag = true
            } else {
              litigantIds[index] = `${item}-${this.laywerIdList[idx].relationship}`
            }
          }
        })
        if (flag) {
          return
        }
        const params = {
          caseNo: this.form.caseNo,
          litigantIds: litigantIds,
          fileIds: this.id,
          sendType: this.sendType
        }
        this.loading = true
        this.$Message.loading({
          content: '正在发送，请稍后...',
          duration: 0
        })
        proofOfService(params).then(res => {
          this.$Message.destroy()
          this.loading = false
          if (res.state === 100) {
            const message = res.errors && res.errors.length > 0 ? res.errors.join(';') : '发送成功'
            this.$message.success(message)
            this.form.litigantIds = []
            this.dialogVisible = false
            this.caseNo = ''
            this.relationship = '' // 代理人关系
            this.laywerId = '' // 代理人id
            this.laywerIdList = []
            this.$store.dispatch('GetListDirType')
          }
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>
