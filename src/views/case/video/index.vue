<template>
  <div class="base-info-wrapper">
    <record />
    <video1 />
  </div>
</template>

<script>
import record from './record'
import video1 from './video1'
export default {
  components: {
    record,
    video1
  }

}
</script>

<style scoped lang="scss">
.base-info-wrapper {
  width: 80%;
  margin: 0 auto;
  height: auto;
}
</style>
