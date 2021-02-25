<template>
  <div class="receiving-unit-wrapper">
    <myHeader :title="'受理单位'" @selectMenu="selectMenu" />
    <div class="input-wrapper">
      <el-input
        v-model="input3"
        placeholder="请选择受理单位"
        width="300px"
      >
        <i slot="suffix" class="el-input__icon el-icon-caret-bottom" @click="select" />
      </el-input>
    </div>
    <div class="content-wrapper">
      <div class="img-wrapper">
        <img src="@/assets/img/receiving-unit.png">
      </div>
      <unitList v-show="showSelect" @closeList="closeList" />
    </div>
  </div>
</template>

<script>
import myHeader from './header.vue'
import unitList from './unitList'
export default {
  components: {
    myHeader,
    unitList
  },
  props: {
  },
  data() {
    return {
      input3: '',
      showSelect: false
    }
  },
  computed: {
    court() {
      return this.$store.state.litigant.registerCourt
    }
  },
  watch: {
    court: {
      handler() {
        this.input3 = this.court.name
      },
      deeper: true
    }
  },
  created() {
    this.input3 = this.court.name
  },
  mounted() {

  },
  methods: {
    select() {
      this.showSelect = !this.showSelect
    },
    closeList() {
      this.showSelect = false
    },
    // 选择自主选择推荐
    selectMenu(index) {
      if (index == 1) {
        this.$router.push({ name: 'selectUnit' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.input-wrapper {
  margin-top: 20px;
  padding: 0 60px;
  .el-input__icon {
    cursor: pointer;
  }
}
.img-wrapper {
  text-align: center;
  padding-top: 50px;
  img {
    max-width: 300px;
  }
}
.content-wrapper {
  position: relative;
  .img-wrapper {
    position: relative;
    z-index: 1;
  }
}
</style>
