<template>
  <div class="">
    <div class="header">
      <span
        v-for="item in itemArr"
        :key="item.index"
        :class="{isChoice:nowChoice === item.index}"
        @click="getNotice(item.index)"
      >{{ item.name }}</span>
    </div>
    <div class="body">
      <information v-if="nowChoice === 0" ref="information" :father-moth="fatherMoth" :form1="form" />
      <security v-if="nowChoice === 1" ref="security" :father-moth="fatherMoth" :form2="form2" :form1="form" />
      <case-set v-if="nowChoice === 2" />
    </div>
  </div>
</template>

<script>
import information from '@/components/otherHome/account/information'
import security from '@/components/otherHome/account/security'
import caseSet from '@/components/otherHome/account/caseSet'
import { getAdminInfo } from '@/api/otherHome/account'
import { SERVICEURL, BASEIMGURL } from '@/utils/constVal.js'
export default {
  name: 'Account',
  components: {
    information,
    security,
    caseSet
  },
  data() {
    return {
      itemArr: [
        { name: '账号信息', index: 0 },
        { name: '安全中心', index: 1 },
        { name: '案件设置', index: 2 }
      ],
      nowChoice: 0,
      form: {
        name: '',
        telephone: '',
        role: '',
        emial: '',
        courtInfoList: [],
        url: ''
      },
      form2: {
        emailSet: '',
        phoneSet: '',
        pwdSet: ''
      }
    }
  },
  computed: {

  },
  mounted() {
    this.$emit('update:nowChoice', '账号管理')
    this.fatherMoth()
  },
  methods: {
    getNotice(index) {
      this.nowChoice = index
      this.$nextTick(() => {

      })
    },
    fatherMoth() {
      getAdminInfo().then(res => {
        if (res.state == 100) {
          this.form.name = res.name
          this.form.role = res.role
          this.form.courtInfoList = res.courtInfoList
          this.form.telephone = res.phone
          this.form.emial = res.email
          this.form2.emailSet = res.emailSet
          this.form2.phoneSet = res.phoneSet
          this.form2.pwdSet = res.pwdSet
          if (res.icon.indexOf('olcourt.cn') == -1) {
            this.form.url = `${BASEIMGURL}/${res.icon}`
          } else {
            this.form.url = res.icon
          }
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
.header {
    height: 60px;
    border-bottom: 5px solid #f2f5fa;
    span{
      width: 100px;
      height: 60px;
      line-height: 60px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
  }
  .isChoice {
    border-bottom: 5px solid #007AFF;
  }
  .body{
    width: 100%;
  }
</style>
