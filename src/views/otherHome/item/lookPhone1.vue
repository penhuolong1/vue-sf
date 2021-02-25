<template>
  <!-- 编辑使用的查看手机号详情 -->
  <div class="wrapper">
    <!-- <span v-if="!isView">{{ phone | phone }}</span> -->
    <span>{{ input1 }}</span>
    <el-tooltip effect="dark" content="点击查看完整手机号" placement="top" :hide-after="1500">
      <i class="el-icon-view" @click="lookPhone" />
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEncryptInfoMed } from '@/api/case'
export default {
  components: {

  },
  props: {
    id: { // 人员id
      type: String,
      default: ''
    },
    encryptType: { // 密文类型 mediater/linkMan
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: null
    },
    type: { // 0 分流中心 1联动单位 2 调解组织 3 调解员
      type: Number,
      default: 0
    },
    courtId: { // 机构id
      type: String,
      default: null
    },
    mediaterId: { // 调解员id
      type: String,
      default: null
    }
  },
  data() {
    return {
      isView: false, // 是否能查看完整手机号码
      input2: null,
      input1: null
    }
  },
  watch: {
    courtId() {
      this.isView = false
    },
    mediaterId() {
      this.isView = false
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
  },
  mounted() {
    this.init()
    this.input1 = this.phone
  },
  methods: {
    // 判断是否可以查看完整手机号
    init() {
      const params = {
        id: this.id,
        type: this.encryptType
      }
      getEncryptInfoMed(params).then(({ state, phone }) => {
        if (state === 100) {
          // this.phone = phone
          this.input2 = phone
          this.$emit('input', phone)
        }
      })
    },
    lookPhone() {
      this.input1 = this.input2
      console.log(this.input2)
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: inline-block;
}
.el-icon-view {
  cursor: pointer;
  margin-left: 5px;
  cursor: pointer;
  padding: 5px;
}
</style>
