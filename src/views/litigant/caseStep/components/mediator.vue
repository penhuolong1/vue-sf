<template>
  <div class="receiving-unit-wrapper">
    <myHeader :title="'解纷员'" @selectMenu="selectMenu" />
    <div class="input-wrapper">
      <el-input
        v-model="input3"
        placeholder="请选择解纷员"
        width="300px"
      >
        <i slot="suffix" class="el-input__icon el-icon-caret-bottom" @click="select" />
      </el-input>
    </div>
    <div class="content-wrapper">
      <div class="img-wrapper">
        <img src="@/assets/img/mediator.png">
      </div>
      <mediatorList v-show="showSelect" ref="mediatorList" @closeList="closeList" @showList="showList" />
    </div>
  </div>
</template>

<script>
import myHeader from './header.vue'
import mediatorList from './mediatorList'
import { mapGetters } from 'vuex'
export default {
  components: {
    myHeader,
    mediatorList
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
    ...mapGetters(['getCourtData']),
    mediator() {
      return this.$store.state.litigant.mediator
    }
  },
  watch: {
    mediator: {
      handler() {
        this.input3 = this.mediator.name
      },
      deep: true
    },
    getCourtData() {
      this.showSelect = true
    }
  },
  created() {
    this.input3 = this.mediator.name
    if (this.getCourtData.id) {
      this.showSelect = true
    }
  },
  mounted() {

  },
  methods: {
    select() {
      // if (!this.$store.state.litigant.courtData.id) {
      //   this.$message.error('请先选择组织解纷')
      //   return
      // }
      this.showSelect = true
      this.$refs.mediatorList.getTopThreeCourt()
    },
    closeList() {
      this.showSelect = !this.showSelect
    },
    showList() {
      this.showSelect = true
    },
    // 选择自主选择推荐
    selectMenu(index) {
      if (index == 1) {
        this.$router.push({ name: 'selectMediator' })
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
