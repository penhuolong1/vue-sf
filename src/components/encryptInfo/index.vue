<template>
  <el-input
    v-model="input1"
    :disabled="isdisabled"
    :placeholder="placeholder"
    @input="getInput"
  >
    <template v-if="isdisabled" slot="append">
      <i
        class="el-icon-view"
        @click="click1"
      /></template>
  </el-input>
</template>

<script>
import { getEncryptInfo, getEncryptInfoLawyer, getEncryptInfoMed } from '@/api/case/index'

export default {
  components: {

  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: { // 类型
      type: String,
      default: ''
    },
    id: { // 当事人id
      type: String,
      default: ''
    },
    litigantType: { // 1 当事人 2 代理人 3 机构相关人员
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      input1: '',
      input2: '',
      isdisabled: true,
      isGet: false // 是否转换了密文
    }
  },
  watch: {
    value() {
      this.input1 = this.value
    },
    id() {
      if (!this.id) {
        this.isdisabled = false
      } else {
        this.isdisabled = true
      }
    }
  },
  created() {
    this.input1 = this.value
  },
  mounted() {
    if (!this.id) {
      this.isdisabled = false
    }
  },
  methods: {
    init(id) {
      if (!this.id || !this.input1) {
        this.isdisabled = false
      } else {
        this.isdisabled = true
      }
      this._getEncryptInfo(id)
    },
    click1(e) {
      this.isdisabled = false
      this.input1 = this.input2
      this.$emit('input', this.input1)
    },
    getInput(e) {
      this.$emit('input', e)
    },
    _getEncryptInfo(id) {
      if (!this.input1) {
        return
      }
      if (this.litigantType == 1) { // 当事人
        const params = {
          litigantId: id || this.id,
          type: this.type
        }
        getEncryptInfo(params).then(res => {
          if (res.state === 100) {
            this.input2 = res[this.type]
          }
        })
      }
      if (this.litigantType == 2) { // 代理人
        const params = {
          lawyerId: id || this.id,
          type: this.type
        }
        getEncryptInfoLawyer(params).then(res => {
          if (res.state === 100) {
            this.input2 = res[this.type]
          }
        })
      }
      if (this.litigantType == 3) { // 机构相关人员
        const params = {
          id: id || this.id,
          type: this.type
        }
        getEncryptInfoMed(params).then(res => {
          if (res.state === 100) {
            this.input2 = res.phone
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-icon-view {
  cursor: pointer;
}
</style>
