<template>
  <div class="mediation-org-wrapper">
    <myHeader :title="'解纷组织'" @selectMenu="selectMenu" />
    <div class="input-wrapper">
      <el-input
        v-model="input3"
        placeholder="请选择解纷组织"
        width="300px"
      >
        <i slot="suffix" class="el-input__icon el-icon-caret-bottom" @click="select" />
      </el-input>
    </div>
    <div class="content-wrapper">
      <div class="img-wrapper">
        <img src="@/assets/img/med-org.png">
      </div>
      <courtList v-show="showSelect" ref="courtList" @closeList="closeList" @showList="showList" />
    </div>
  </div>
</template>

<script>
import myHeader from './header.vue'
import courtList from './courtList'
import { mapGetters } from 'vuex'
export default {
  components: {
    myHeader,
    courtList
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
    ...mapGetters(['getRegisterCourt']),
    court() {
      return this.$store.state.litigant.courtData
    }
  },
  watch: {
    court: {
      handler() {
        this.input3 = this.court.name
        this.showSelect = false
      },
      deeper: true
    },
    getRegisterCourt() {
      this.showSelect = true
    }
  },
  created() {
    this.input3 = this.court.name
    if (this.getRegisterCourt) {
      this.showSelect = true
    }
  },
  mounted() {

  },
  methods: {
    select() {
      this.$refs.courtList.getTopThreeCourt()
      this.showSelect = !this.showSelect
    },
    closeList() {
      this.showSelect = false
    },
    showList() {
      this.showSelect = true
    },
    selectMenu(index) {
      if (index == 1) {
        // if (!this.$store.state.litigant.registerCourt.id) {
        //   this.$message.error('请先选择受理单位')
        //   return
        // }
        this.$router.push({ name: 'selectCourt' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
