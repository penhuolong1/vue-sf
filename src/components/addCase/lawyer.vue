<template>
  <el-dialog
    title="代理人编辑"
    :visible.sync="centerDialogVisible"
    width="35%"
    :close-on-click-modal="false"
    append-to-body
    center
  >
    <el-form ref="form" :model="form" :rules="lawyerRules" label-position="right" label-width="120px">
      <el-form-item label="代理人姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="代理人类型" prop="agentType">
        <el-select v-model="form.agentType" style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in lawyerType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="agentIdentiCard" required>
        <el-input v-model="form.agentIdentiCard" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="民族">
        <el-input v-model="form.nation" type="text" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.years" type="number" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item v-show="form.agentType === 1" label="律师证件号" prop="lawyerNum">
        <el-input v-model="form.lawyerNum" placeholder="请输入证件号" />
      </el-form-item>
      <el-form-item label="身份证正面上传" prop="frontImage" style="width: 100%;">
        <uploadFile ref="frontImage" img-type="frontImage" :is-upload="form.backImage" @getUrl="getUrl" />
      </el-form-item>
      <el-form-item label="身份证背面上传" prop="backImage" style="width: 100%;">
        <uploadFile ref="backImage" img-type="backImage" :is-upload="form.backImage" @getUrl="getUrl" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button v-if="!isChange" type="primary" :loading="isLoading" @click="submit">确 定</el-button>
      <el-button v-if="isChange" type="primary" :loading="isLoading" @click="changeLawyer">修 改</el-button>
    </span>
  </el-dialog>
</template>

<script>
import rules from '@/utils/rules'
import uploadFile from '@/components/addCase/uploadFile'
import { addLawyer, addOrUpdateLawyer } from '@/api/litigant/litigant'
export default {
  name: 'VueName',
  components: {
    uploadFile
  },
  mixins: [rules],
  props: {
    litigantId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      centerDialogVisible: false,
      lawyerType: [
        { value: 1, label: '律师' },
        { value: 2, label: '法律工作者' },
        { value: 3, label: '单位工作人员' },
        { value: 4, label: '近亲属' },
        { value: 5, label: '公民' }
      ],
      form: {
        litigantId: '',
        name: '',
        agentType: '',
        agentIdentiCard: '',
        address: '',
        lawyerNum: '',
        frontImage: '',
        backImage: ''
      },
      fileList: [],
      isChange: false
    }
  },
  computed: {

  },
  watch: {
    centerDialogVisible(cur, old) {
      !cur && this.$refs['form'].resetFields()
      !cur && this.$refs.frontImage.clearFiles() && this.$refs.backImage.clearFiles()
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.form = {
        litigantId: '',
        name: '',
        agentType: '',
        agentIdentiCard: '',
        address: '',
        lawyerNum: '',
        frontImage: '',
        backImage: ''
      } // 清除表单方法存在问题,暂时用重新清除表单字段方式解决
      this.isChange = false
      this.centerDialogVisible = true
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.isLoading = true
        this.form.litigantId = this.litigantId
        addLawyer(this.form).then(({ state, message }) => {
          if (state === 100) {
            this.$emit('done')
            this.$message.success(message)
            this.centerDialogVisible = false
          }
        }).finally(() => {
          this.isLoading = false
        })
      })
    },
    changeLawyer() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.isLoading = true
        addOrUpdateLawyer(this.form).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.centerDialogVisible = false
          }
        }).finally(() => {
          this.isLoading = false
        })
      })
    },
    getUrl(e, imgType) {
      imgType === 'frontImage' ? this.form.frontImage = e : this.form.backImage = e
    },
    change(item, litigantId) {
      this.centerDialogVisible = true
      this.isChange = true
      this.form = {
        ...item,
        litigantId: litigantId,
        lawyerId: item.id,
        name: item.agentName
      }
    }
  }
}
</script>

<style scoped lang = "scss">

</style>
