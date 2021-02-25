<template>
  <div class="participant-wrapper">
    <span class="name">参与人:</span>
    <span
      v-if="participantData && participantData.length >0"
      class="content"
    >
      <div
        v-for="(item, index) in participantData"
        :key="index"
        style="display: inline-block;"
      >
        <div
          class="circle-text role1"
        >
          <span>{{ item[0] }}</span>
        </div>
      </div>
    </span>
    <div class="time">时间：{{ time }}</div>
  </div>
</template>

<script>
import { userInfo } from '@/api/case/index.js'
import { formatDate } from '@/utils/format'
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    groupUserData: null,
    caseId: null
  },
  data() {
    return {
      participantData: [],
      time: formatDate(new Date().getTime(), 'YYYY-MM-DD H:m')
    }
  },
  computed: {
    ...mapGetters(['getCaseId'])
  },
  watch: {
    groupUserData: {
      async handler() {
        console.log('---获取组群信息--')
        console.log(this.groupUserData)
        console.log(this.getCaseId)
        if (!this.getCaseId) {
          return
        }
        this.participantData = []
        if (this.groupUserData && this.groupUserData.length > 0) {
          this.participantData = []
          this.participantData = await Promise.all(this.groupUserData.map(async item => {
            let obj = {}
            await userInfo({ adminId: item.id, caseId: this.getCaseId }).then(res => {
              obj = res.result.name
            })
            return obj
          }))
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.participant-wrapper {
  height: 36px;
  line-height: 36px;
  margin-top: 30px;
  .name {
    line-height: 36px;
    font-size: 15px;
    color: #192a46;
    margin-right: 10px;
    vertical-align: top;
  }
  .content {
    p,
    span {
      display: block;
      font-size: 10px;
      // transform: scale(0.8);
    }
    .circle-text {
      width: 36px;
      height: 36px;
      display: inline-block;
      vertical-align: bottom;
      margin-right: 5px;
      text-align: center;
      &.role1 {
        background-color: $themeColor;
      }
      &.role2 {
        background-color: $themeColor;
      }
      &.role3 {
        background-color: #ffdd00;
      }
      &.role4 {
        background-color: #73d500;
      }
      p {
        line-height: 12px;
        &:first-child {
          padding-top: 6px;
        }
      }
    }
  }
  .add {
    display: inline-flex;
    color: #192a46;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    box-shadow: -8px 12px 18px rgba(25, 42, 70, 0.13);
    margin-left: 50px;
    i {
      font-weight: bold;
    }
  }
  .time {
    float: right;
    font-size: 13px;
    font-weight: 400;
    color: #828d99;
  }
}
</style>
