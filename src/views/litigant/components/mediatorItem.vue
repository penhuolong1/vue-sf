<template>
  <div class="court-item">
    <div class="avator">
      <img :src="item.icon">
    </div>
    <div class="media-wrapper">
      <div class="name"><i v-if="active" class="el-icon-success" />{{ item.name }}</div>
      <div class="tel p"><span>解纷数量:{{ item.caseNum }}</span><a @click.stop="showDetail">详情<i class="el-icon-arrow-right" /></a></div>
      <div class="address p">专业领域：{{ item.scope }}</div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="'详情'"
      append-to-body
      width="700px"
      :visible.sync="detailVisible"
    >
      <div class="detail-content">
        <div class="content-left">
          <p><span class="label-width">{{ item.name }}</span><span class="label-width">解纷数量：{{ item.caseNum }}</span></p>
          <p><span class="label-width">联系方式: {{ item.phone | phone }}</span><span class="label-width">成功率: {{ item.casePercent }}%</span></p>
          <p>专业领域: {{ item.scope }}</p>
          <p>简介：{{ item.introduction }}</p>
        </div>
        <div class="content-right">
          <div class="avator">
            <img :src="item.icon">
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    item: {
      type: Object,
      default: null
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailVisible: false
    }
  },
  created() {

  },
  mounted() {
    console.log(this.active)
  },
  methods: {
    showDetail() {
      this.detailVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.label-width {
  display: inline-block;
  width: 200px;
}
.court-item {
  .el-icon-success {
    color: #007AFF;
    margin-right: 10px;
  }
  .media-wrapper {
    width: 250px;
    margin: 0 auto;
  }
  padding: 20px 60px;
  text-align: center;
  position: relative;
  cursor: pointer;
  .avator {
    display: inline-block;
    width: 100px;
    height: 100px;
    background-color: #f5f5f5;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
  .name {
    font-size: 22px;
    font-weight: 400;
    text-align: left;
    color: #212121;
    line-height: 1.1;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
  }
  .address {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .p {
    text-align: left;
    color: #757575;
    font-size: 14px;
    line-height: 1.5;
  }
  .tel {
    display: flex;
    justify-content: space-between;
    a {
      margin-left: 10px;
    }
  }
}
.detail-content {
  display: flex;
  .content-right {
    width: 150px;
  }
  .content-left {
    flex: 1;
    padding-right: 10px;
  }
  .avator {
    width: 150px;
    height: 180px;
    background-color: #bdbdbd;
    display: inline-block;
    img {
      width: 150px;
      height: 180px;
    }
  }
  p {
    font-size: 15px;
    color: #757575;
    line-height: 2;
  }
}
</style>
