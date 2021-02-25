<template>
  <div class="wrapper">
    <h1 class="title">当事人信息</h1>
    <litigant />
    <h1 class="title">纠纷概况</h1>
    <ul>
      <li v-if="getCaseInfo.id">案件类型：{{ getCaseInfo.applyType || '' }}</li>
    </ul>
    <h1 class="title title-btn">
      <span>证据信息</span>
      <div v-if="getTeamData.type != 2" class="add-evi" @click="addEvi">
        <img src="@/assets/icon/add-evi.png" alt="">
        上传证据
      </div>
    </h1>
    <ul>
      <li v-for="(item, index) in eviList" :key="index" @click="eviDetail(item.id)"><a>{{ item.evidenceName }}</a></li>
    </ul>
    <h1 class="title">解纷组织</h1>
    <ul>
      <li v-if="getCaseInfo.court && getCaseInfo.court.id">{{ getCaseInfo.court.name || '' }}</li>
    </ul>
    <h1 class="title">解纷员</h1>
    <ul>
      <li v-if="getCaseInfo.mediater && getCaseInfo.mediater.id">{{ getCaseInfo.mediater.name || '' }}</li>
    </ul>
    <addEvidence ref="addEvidence" :litigant-list="litigantData" :title="eviTitle" @done="getEvidence" />
  </div>
</template>

<script>
import addEvidence from '@/components/evidence/index'
import litigant from './litigant'
import { evidenceList } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    litigant,
    addEvidence
  },
  props: {

  },
  data() {
    return {
      eviList: [],
      eviTitle: '',
      litigantData: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getTeamData'])
  },
  watch: {
    getCaseInfo() {
      this.getEvidence()
      this.getLitigantList()
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 获取当事人
    getLitigantList() {
      if (!this.getCaseInfo || !this.getCaseInfo.id) {
        return
      }
      if (this.getCaseInfo.litigants && this.getCaseInfo.litigants.length > 0) {
        this.litigantData = this.getCaseInfo.litigants.map(item => {
          return {
            id: item.id,
            enable: item.enable,
            litigantName: item.litigantName
          }
        }).filter(item => {
          return item.enable
        })
      }
    },
    // 查看证据信息
    getEvidence() {
      evidenceList({ lawCaseId: this.getCaseInfo.id }).then(res => {
        if (res.state === 100) {
          this.eviList = res.evidences
        }
      })
    },
    eviDetail(id) {
      this.dialogTitle = '证据详情'
      this.$refs.addEvidence.show(id, false)
    },
    // 上传证据
    addEvi() {
      this.dialogTitle = '添加证据'
      this.$refs.addEvidence.show()
    }
  }
}
</script>

<style scoped lang="scss">
.title-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .add-evi {
    img {
      width: 17px;
      height: 18px;
      margin-right: 5px;
    }
    display: flex;
    align-items: center;
    padding: 0px 20px;
    height: 35px;
    background: rgba(0,151,254,0.15);
    color: #1b85cf;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
  }
}
</style>
