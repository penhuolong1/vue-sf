<template>
  <div>
    <iframe v-if="flag" :src="callPhone" frameborder="0" width="700" height="260" />
    <div style="font-size:12px;color:cadetblue">厦门号码前面加9，其他地区号码前加90</div>
    <div>
      <Row style="margin:10px 0 0 0">
        <span style="text-align:left;line-height:32px;float:left ">
          是否接通：
        </span>
        <span style="text-align:left;line-height:36px;padding-left:5px;float:left ">
          <RadioGroup v-model="isAnswer">
            <Radio label="接听" />
            <Radio label="未接通" />
          </RadioGroup>
        </span>
      </Row>
      <Row v-show="isAnswer == '未接通'" style="margin:10px 0 0 0">
        <span push="1" style="text-align:left;line-height:32px;float:left ">
          未接通原因：
        </span>
        <span push="1" style="text-align:left;line-height:32px;padding-left:5px;float:left ">
          <RadioGroup v-model="noAnswerReason">
            <Radio label="空号" />
            <Radio label="未接" />
            <Radio label="停机" />
            <Radio label="关机" />
          </RadioGroup>
        </span>
      </Row>
      <Row style="margin:10px 0 0 0">
        <span push="1" style="text-align:left;line-height:32px;float:left">
          备注信息：
        </span>
        <span push="1" style="text-align:left;line-height:32px;padding-left:5px;float:left;width:300px;">
          <Input v-model="Phoneremark" style="float:left;width:100%" placeholder="请输入备注信息" />
        </span>
      </Row>
    </div>
  </div>
</template>
<script>
import { getEncryptInfo, getEncryptInfoLawyer } from '@/api/case/'
export default {
  props: {
    phoneNums: {
      type: Number,
      default: null
    },
    phoneUid: {
      type: String,
      default: null
    },
    phoneType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      callPhone: '',
      flag: false,
      isAnswer: '', // 是否接通
      noAnswerReason: '', // 未接通原因
      Phoneremark: '' // 电话备注
    }
  },
  watch: {
    isAnswer: 'onchange', // 是否接通
    noAnswerReason: 'onchange', // 未接通原因
    Phoneremark: 'onchange', // 电话备注
    phoneUid() {
      this.init()
    },
    phoneType() {
      this.init()
    }
  },
  created() {
    console.log('create')
    this.init()
  },
  methods: {
    init(phone) {
      console.log(this.phoneUid)
      let phone1 = phone || this.phoneNums
      const phoneUid = phone || this.phoneUid
      console.log(this.phoneType)
      if (this.phoneType === 1) {
        const params = {
          litigantId: this.phoneUid,
          type: 'litigantPhone'
        }
        console.log(params)
        getEncryptInfo(params).then(res => {
          console.log(res)
          if (res.state === 100) {
            phone1 = parseInt(res.litigantPhone)
          }
          this.flag = true
          this.callPhone = process.env.VUE_APP_BASE_publicPath + 'testconnect.htm?phone=' + phone1 + '&litigantId=' + phoneUid
        })
      } else {
        const params = {
          lawyerId: this.phoneUid,
          type: 'agentMobile'
        }
        getEncryptInfoLawyer(params).then(res => {
          console.log(res)
          if (res.state === 100) {
            phone1 = parseInt(res.agentMobile)
          }
          this.flag = true
          this.callPhone = process.env.VUE_APP_BASE_publicPath + 'testconnect.htm?phone=' + phone1 + '&litigantId=' + phoneUid
        })
      }
    },
    onchange() {
      // 使用$emit想父组件进行传值
      this.$emit('onChange', {
        isAnswer: this.isAnswer,
        noAnswerReason: this.noAnswerReason,
        Phoneremark: this.Phoneremark
      })
    }
  }

}
</script>
