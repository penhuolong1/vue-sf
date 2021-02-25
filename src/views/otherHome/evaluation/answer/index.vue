<template>
  <div>
    <div class="wrapper">
      <eviInfo></eviInfo>
      <step :type="getEviInfo.area" :step="num"/>
      <topic :courtId="getEviInfo.courtId"/>
    </div>
  </div>
</template>

<script>
import eviInfo from '../components/eviInfo'
import topic from '../components/topic'
import step from '../components/step'
import {mapGetters} from 'vuex'
export default {
  components: {
    step,
    topic,
    eviInfo
  },
  props: {

  },
  data() {
    return {
      num: 0,
      type: '',
      courtId: ''
    }
  },
  computed: {
    ...mapGetters(['getOpInfo', 'getUserInfo', 'getEviInfo']),
    typeNum() {
      return this.$route.query.type
    }
  },
  watch: {
    typeNum() {
      this.num = Number(this.$route.query.type)
    }
  },
  created() {
    console.log(this.getEviInfo)
    this.num = Number(this.$route.query.type)
    this.$store.dispatch('GetOpInfo')
  },
  mounted() {

  },
  methods: {
    getType() {

    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 10px;
  margin-top: 10px;
}
</style>
