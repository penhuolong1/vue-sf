<template>
  <div class="court-item">
    <div class="avator">
      <img src="@/assets/img/court.png" alt="">
    </div>
    <div class="court-item1">
      <div class="name"><i v-if="active" class="el-icon-success" />{{ item.name }}</div>
      <div class="tel p"><span>联系方式：{{ item.linkMan }} {{ item.phone | phone }}</span><a @click.stop="showDetail">详情<i class="el-icon-arrow-right" /></a></div>
      <div class="num p">解纷员数量：{{ item.mediater }} </div>
      <div class="address p">地址：{{ item.address }}</div>
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
          <p>{{ item.name }}</p>
          <p>联系方式：{{ item.linkMan }} {{ item.phone | phone }}</p>
          <p>地址：{{ item.address }}</p>
          <p>解纷员数量：{{ item.mediater }} </p>
          <p>组织简介：{{ item.introduction }} </p>
        </div>
        <div class="content-right">
          <div class="avator">
            <img src="@/assets/img/court.png" alt="">
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

  },
  methods: {
    showDetail() {
      this.detailVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.court-item {
  .court-item1 {
    width: 280px;
    margin: 0 auto;
  }
  .el-icon-success {
    color: #007AFF;
    margin-right: 10px;
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
      width: 70px;
    }
  }
  .name {
    font-size: 22px;
    padding: 0 5px;
    font-weight: 400;
    text-align: left;
    color: #212121;
    font-weight: bold;
    line-height: 1.1;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
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
    display: flex;
    justify-items: center;
    align-items: center;
    img {
      width: 150px;
    }
  }
  p {
    font-size: 15px;
    color: #757575;
    line-height: 2;
  }
}
</style>
