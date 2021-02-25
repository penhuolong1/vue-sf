<template>
  <div>
    <iframe v-if="type == 2 && level == 1" :src="`${pubilcPath}html/table_city.html?zCourtId=${courtId}`" class="iframe" />
    <iframe v-if="type == 2 && level == 2" :src="`${pubilcPath}html/table_area.html?zCourtId=${courtId}`" class="iframe" />
    <iframe v-if="type == 1" :src="`${pubilcPath}html/list.html?fCourtId=${courtId}&page=table_city`" class="iframe" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      pubilcPath: process.env.VUE_APP_BASE_publicPath,
      type: 2, // 1为复评 2为自评
      courtId: null,
      level: 1 // 1 市及 2 区级 3 街道及
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    this.$emit('update:nowChoice', '工作考评')
    this.type = this.$route.query.type
    this.courtId = this.getUserInfo.courtUid
    this.level = this.getUserInfo.courtLevel
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.iframe {
  width: 100%;
  min-height: 800px;
}
</style>
