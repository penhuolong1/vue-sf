<template>
  <!-- 详情使用的查看手机号详情 -->
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
import { editAuthority, medEditAuthority } from '@/api/team/team.js'
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
      input1: null
    }
  },
  watch: {
    courtId() {
      this.isView = false
    },
    mediaterId() {
      this.isView = false
    },
    phone() {
      this.input1 = this.phone
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
  },
  mounted() {
    this.input1 = this.phone
  },
  methods: {
    // 判断是否可以查看完整手机号
    async lookPhone() {
      let flag = false
      if (this.type === 0) {
        if (this.getUserInfo.courtId === 1) { // 诉非可以查看所有的手机号码
          // this.isView = true
        } else {
          if (this.getUserInfo.courtUid == this.courtId) { // 如果是分流中心只有诉非可以查看所有手机号码
          } else {
            this.error()
            flag = true
          }
        }
      }
      if (this.type === 1 || this.type === 2) { // 联动单位
        await editAuthority({ courtId: this.courtId }).then(({ authorityType, state }) => {
          if (state === 100) {
            if (authorityType === 0) {
              this.error()
              // return
              flag = true
            }
          }
        })
      }
      if (this.type === 20) {
        await medEditAuthority({ mediaterId: this.mediaterId }).then(({ authorityType, state }) => {
          if (state === 100) {
            if (authorityType === 0) {
              this.error()
              // return
              flag = true
            }
          }
        })
      }
      if (flag) {
        return
      }
      const params = {
        id: this.id,
        type: this.encryptType
      }
      getEncryptInfoMed(params).then(({ state, phone }) => {
        if (state === 100) {
          this.input1 = phone
        }
      })
    },
    error() {
      this.$message.error('您没有权限查看该手机号码')
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
