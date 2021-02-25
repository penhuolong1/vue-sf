<template>
  <div class="wrapper">
    <ul>
      <li v-for="(item, index) in litigants" :key="index" @click="detail(item.id, item.type)"><a>{{ item.name }}</a></li>
    </ul>
    <litigantInfo ref="litigantInfo" />
    <laywerInfo ref="laywerInfo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import litigantInfo from '@/components/litigant/litigantInfo.vue'
import laywerInfo from '@/components/litigant/laywerInfo.vue'
export default {
  components: {
    litigantInfo,
    laywerInfo
  },
  props: {

  },
  data() {
    return {
      litigants: {},
      form: {},
      laywerInfo: {},
      litigantDialog: false,
      laywerDialog: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      if (!this.getCaseInfo.id) {
        return
      }
      const caseInfo = { ...this.getCaseInfo }
      if (caseInfo.litigants && caseInfo.litigants.length > 0) {
        this.litigants = []
        caseInfo.litigants.forEach(item => {
          if (item.enable) {
            if (item.lawyer && item.lawyer.length > 0) {
              this.litigants = [...this.litigants, ...item.lawyer.forEach(item1 => {
                if (item1.enable) {
                  const obj = {
                    id: item1.id,
                    name: `代理人:${item1.agentName}`,
                    type: 2
                  }
                  this.litigants.push(obj)
                }
              })]
            }
            const obj = {
              id: item.id,
              name: `${item.litigationStatus.name}:${item.litigantName}`,
              type: 1
            }
            this.litigants.push(obj)
          }
        })
        console.log('--------1233333--')
        console.log(this.litigants)
      }
    },
    detail(id, type) {
      if (type == 1) { // 1为当事人
        this.$refs.litigantInfo.show(id)
      } else { // 2为代理人
        this.$refs.laywerInfo.show(id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
