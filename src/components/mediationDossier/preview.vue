<template>
  <div>
    <iframe :src="bookUrl" />
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: ['bookUrl'],
  data() {
    return {

    }
  },
  methods: {
    // 初始化
    init() {
      return new Promise((resolve, reject) => {
        if (this.coverData.caseId) {
          resolve(true)
        } else {
          resolve(true)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    iframe {
        width: 100%;
        height: 600px;
    }
</style>
