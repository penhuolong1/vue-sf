<template>
  <div class="content">
    <div>调字号模板设置: </div>
    <div v-if="setFlag" class="setBox">
      <div class="inputBox">当前调字号：{{ disputeNo }}<span v-if="userRole===1" class="textColor" @click="show"><Icon type="md-create" class="kongge" />修改</span></div>
    </div>
    <div v-if="!setFlag" class="setBox">
      <div class="inputBox">
        <el-radio v-model="radio" :label="1">
          <el-input v-model="inputYear" class="inputYear" />
          <el-input v-model="input" class="inputItem" placeholder="请输入内容" />001号
          （例：（2020）诉非001号）
        </el-radio>
      </div>
      <div class="inputBox">
        <el-radio v-model="radio" :label="2">
          <el-input v-model="input" class="inputItem" placeholder="请输入内容" />
          <el-input v-model="inputYear" class="inputYear" />001号
          （例：诉非（2020）001号）
        </el-radio>
      </div>
      <el-button type="primary" class="btn" @click="save">确定</el-button>
    </div>
    <el-dialog
      title="调字号模板设置"
      :visible.sync="dialogVisible"
      append-to-body
      width="50%"
      :before-close="handleClose"
    >
      <div>
        <div class="setBox">
          <div class="inputBox">
            <el-radio v-model="radio" :label="1">
              <el-input v-model="inputYear" class="inputYear" />
              <el-input v-model="input" class="inputItem" placeholder="请输入内容" />001号
              （例：（2020）诉非001号）
            </el-radio>
          </div>
          <div class="inputBox">
            <el-radio v-model="radio" :label="2">
              <el-input v-model="input" class="inputItem" placeholder="请输入内容" />
              <el-input v-model="inputYear" class="inputYear" />001号
              （例：诉非（2020）001号）
            </el-radio>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDisputeNo, updateDisputeNo } from '@/api/otherHome/account'

export default {

  props: {

  },
  data() {
    return {
      setFlag: false,
      disputeNo: '',
      dialogVisible: false, // 修改调字号模态框
      input: '',
      radio: 1,
      inputYear: '(2021)',
      userRole: null
    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      this.userRole = this.$store.getters.getUserRole
      this.getDispute()
      const date = new Date()
      this.inputYear1 = '(' + date.getFullYear() + ')'
    },
    getDispute() {
      getDisputeNo().then(res => {
        if (res.state === 100) {
          if (res.disputeNo != null) {
            this.disputeNo = res.disputeNo
            this.setFlag = true
          } else {
            this.setFlag = false
          }
        }
      })
    },
    // 保存修改
    save() {
      if (this.inputYear.length < 6) {
        this.$message.error('请输入正确年份格式')
        return
      } else {
        const params = {
          part: this.input,
          preStr: this.inputYear,
          indexType: this.radio
        }
        updateDisputeNo(params).then(res => {
          if (res.state === 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.getDispute()
            this.setFlag = true
            this.dialogVisible = false
          }
          console.log(res)
        })
      }
    },
    // 修改弹窗
    show() {
      this.dialogVisible = true
    },
    // 关闭模态框
    handleClose() {
      this.dialogVisible = false
    }

  }
}
</script>

<style scoped lang = "scss">
.content{
    padding: 20px;
}
.textColor{
    color:#007AFF;
    margin-left: 10px;
    cursor: pointer;
}
.setBox{
        padding-top:20px;
        position: relative;
    }
    .inputBox{
        padding: 0 20px 20px;
        .inputItem{
            width: auto;
            margin-right: 10px;
        }
        .inputYear{
            width: 100px;
            margin-right: 10px;
        }
    }
.btn{
  position: absolute;
  right: 30%;
}
</style>
