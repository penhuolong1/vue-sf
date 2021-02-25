<template>
  <div class="quantity-wrapper">
    <h6>{{ title }}</h6>
    <ul class="num-wrapper">
      <li v-for="(item, index) in number" :key="index">
        <span v-if="item == ','">,</span>
        <span v-else class="number-item">
          <span class="bc-span" />
          <span class="bc-span" />
          {{ item }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: ''
    },
    number: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.quantity-wrapper {
  h6 {
    color: white;
    font-size: 15px;
    margin-bottom: 3px;
  }
  .num-wrapper {
    display: flex;
    li {
      margin-right: 5px;
      font-size: 25px;
      color: white;
      display: inline-block;
      position: relative;
      .number-item {
        display: inline-block;
        width: 30px;
        height: 40px;
        color: #CAEAF1;
        font-size: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        position: relative;
        .bc-span {
          display: block;
          position: absolute;
          height: 19px;
          width: 100%;
          top: 0px;
          left: 0px;
          background-color: #0367A6;
          opacity: 0.7;
          z-index: -1;
          &:last-child {
            bottom: 0px;
            top: auto;
          }
        }
      }
    }
  }
}
</style>
