<template>
  <div class="about">
    <p class="about-title">{{ title }}</p>
    <el-select v-model="litigants" class="situation" :multiple="multiple" style="width: 100%;" placeholder="请选择">
      <el-option
        v-for="item in litigantList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '需签署此份文书的参与人'
    },
    booktype: { // 文书类型
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
    litigants() {
      this.$emit('input', this.litigants)
    }
  },
  data() {
    return {
      litigantList: [],
      litigants: []
    }
  },
  created() {
    this.getLitigantList()
    console.log('----action---')
    console.log(this.showAction)
  },
  mounted() {
  },
  methods: {
    getLitigantList() {
      this.litigants = []
      if (!this.getCaseInfo) {
        return
      }
      if (!this.getCaseInfo.litigants || this.getCaseInfo.litigants.length == 0) {
        return
      }
      this.litigantList = []
      this.getCaseInfo.litigants.forEach(item => {
        if (item.enable) {
          switch (this.booktype) {
            case 24: // 撤销申请书只要申请人
              if (item.litigationStatus.id == 4) {
                this.litigantList.push({
                  id: item.id,
                  name: item.litigantName
                })
                if (item.lawyer && item.lawyer.length > 0) {
                  item.lawyer.forEach(item1 => {
                    if (item1.enable) {
                      this.litigantList.push({
                        id: item1.id,
                        name: item1.agentName
                      })
                    }
                  })
                }
              }
              break
            case 7: case 11: // 调解记录只要当事人 不要代理人
              this.litigantList.push({
                id: item.id,
                name: item.litigantName
              })
              break
            case 5: // 授权委托书需要有代理人的当事人
              var lawer1 = []
              if (item.lawyer && item.lawyer.length > 0) {
                lawer1 = item.lawyer.filter(item2 => item2.enable)
                if (lawer1.length > 0) {
                  this.litigantList.push({
                    id: item.id,
                    name: item.litigantName
                  })
                }
              }
              break
            default:
              this.litigantList.push({
                id: item.id,
                name: item.litigantName
              })
              if (item.lawyer && item.lawyer.length > 0) {
                item.lawyer.forEach(item1 => {
                  if (item1.enable) {
                    this.litigantList.push({
                      id: item1.id,
                      name: item1.agentName
                    })
                  }
                })
              }
              break
          }
        }
        console.log(this.litigantList)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.about {
      margin-top: 31px;
      .about-title {
          margin-bottom: 25px;
      }
      .situation {
          padding: 20px 40px;
          line-height: 45px;
          background:rgba(250,250,250,1);
          border:1px solid rgba(240,241,242,1);
      }
      ::v-deep .situation .el-textarea__inner {
          background: rgba(250,250,250,1);
      }
  }
</style>
