<template>
  <el-col :span="6">
    <div class="card">
      <p>{{ data.name }}</p>
      <span class="count">{{ data.count }}</span>
      <span class="pic-box">
        <img src="../../../assets/icon/card.png" alt="">
      </span>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'VueName',
  props: {
    data: {
      type: Object,
      default: () => ({
        name: '',
        count: ''
      })
    }
  },
  data() {
    return {
      msg: 'Welcome to your vueName'
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang = "scss">
.card{
    width: 100%;
    height: 163px;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 0px 13px 0px rgba(54,184,163,0.15);
    padding: 15px;
    p{
      width: 88px;
      height: 60%;
      opacity: 0.5;
      font-size: 22px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      text-align: left;
      color: #36b8a3;
      line-height: 30px;
    }
    .count {
      display: inline-block;
      width: 80%;
      height: 40%;
      font-size: 40px;
      font-family: Segoe UI, Segoe UI-Regular;
      font-weight: 400;
      color: #00183b;
      line-height: 40px;
    }
    .pic-box {
      width: 20%;
      height: 40%;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      img{
        width: 35px;
        height: 39px;
      }
    }
  }
</style>
