<template>
  <el-col :span="6">
    <div class="card">
      <div v-for="item in value" :key="item.index" class="box">
        <div class="item">
          <span class="itemLeft">{{ item.name }}</span>
          <span class="itemRight" style="">{{ item.num }}件</span>
        </div>
      </div>

    </div></el-col>
</template>

<script>
import { searchCaseInfo } from '@/api/otherHome/otherHome'
export default {
  name: 'CaseNum',
  props: {
    role: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      value: [
        {
          name: '收案',
          num: 15
        },
        {
          name: '分流',
          num: 25
        },
        {
          name: '受理',
          num: 26
        },
        {
          name: '化解',
          num: 15
        },
        {
          name: '司法确认',
          num: 15
        },
        {
          name: '结案',
          num: 15
        }
      ]

    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      console.log(this.role)

      searchCaseInfo().then(res => {
        // console.log(res)
        if (res.state == 100) {
          if (this.role === 0 || this.role == 6) {
            this.value = [
              {
                name: '收案',
                num: res.data.shou
              },
              {
                name: '分流',
                num: res.data.liu
              },
              {
                name: '受理',
                num: res.data.sou
              },
              {
                name: '化解',
                num: res.data.hua
              },
              {
                name: '司法确认',
                num: res.data.que
              },
              {
                name: '结案',
                num: res.data.jie
              }]
          } else {
            this.value = [
              {
                name: '收案',
                num: res.data.shou
              },
              {
                name: '受理',
                num: res.data.sou
              },
              {
                name: '化解',
                num: res.data.hua
              },
              {
                name: '司法确认',
                num: res.data.que
              },
              {
                name: '结案',
                num: res.data.jie
              }]
          }
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height: 480px;
    background: #ffffff;
    border-radius: 10px;
    /* box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16); */
    box-shadow: 0px 0px 13px 0px rgba(54, 184, 163, 0.15);
    .box{
        height: 16%;
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: column;
        justify-content:center;
        .item{
        background: #f5fbfe;
        width: 95%;
        margin: auto;
        height: 35px;
        line-height: 35px;
        border-radius: 10px;
        padding: 0 10px;
        }
    }
  }
  .itemLeft{
      color:black;
      font-weight: 700;
  }
  .itemRight{
      float: right;
      color:#1895dd
  }

</style>
