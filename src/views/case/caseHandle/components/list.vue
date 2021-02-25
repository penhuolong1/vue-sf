<template>
  <div class="list-wrapper">
    <item v-for="(item, index) in caseLineData" :key="index" :last="index === caseLineData.length-1" :item="item" />
  </div>
</template>

<script>

import item from './listItem'
export default {
  components: {
    item
  },
  props: {
    caseLineData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {
    console.log(this.caseLineData)
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.list-wrapper {
  margin-top: 20px;
  background-color: rgba(0,0,0,0.02);
  padding: 10px 0px;
}
</style>
