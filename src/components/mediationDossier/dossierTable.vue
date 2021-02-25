<template>
  <div>
    <el-checkbox-group v-model="multipleSelection">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <!-- <el-table-column
                        label="序号"
                        align="center"
                        header-align="center"
                        width="70">
                    <template slot-scope="scope">
                        <el-dropdown trigger="click" placement="bottom-start">
                            <span class="el-dropdown-link">
                                <el-checkbox :label="scope.$index + 1"></el-checkbox>
                            </span>
                            <el-dropdown-menu slot="dropdown" class="table-dropdown">
                                <el-dropdown-item icon="el-icon-edit" @click.native="setAction(scope)">
                                    编辑
                                </el-dropdown-item>
                                <el-dropdown-item icon="el-icon-download">
                                    下载宗卷
                                </el-dropdown-item>
                                <el-dropdown-item icon="el-icon-circle-check">
                                    选择全部
                                </el-dropdown-item>
                                <el-dropdown-item icon="el-icon-circle-close">
                                    全部不选
                                </el-dropdown-item>
                                <el-dropdown-item icon="el-icon-delete">
                                    删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column> -->
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="70"
        />
        <el-table-column
          prop="archiveNo"
          label="卷号"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="175"
        >
          <template slot-scope="scope">
            <span class="row-hover" @click="setAction(scope)">{{ scope.row.archiveNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="卷名"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="175"
        >
          <template slot-scope="scope">
            <span class="row-hover" @click="setAction(scope)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="卷宗类型"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="year"
          label="年度"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="70"
        />
        <el-table-column
          prop="mediater"
          label="解纷员"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="mediateTerm"
          label="解纷日期"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="passengerTransportation"
          label="受理机构"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="120"
        />
        <el-table-column
          prop="createDate"
          label="立卷日期"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="creatName"
          label="立卷人"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="depositTerm"
          label="保管期限"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="80"
        />
        <el-table-column
          prop="remain"
          label="备注"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          show-overflow-tooltip
          width="150"
        >
          <template slot-scope="scope">
            <div class="btn-box">
              <el-tooltip effect="dark" content="下载" placement="top" :hide-after="1500">
                <img src="@/assets/img/mediationRecord/icon3.png" alt="" @click="plaintiffDown(scope.row)">
              </el-tooltip>
              <!-- <el-tooltip effect="dark" content="删除" placement="top" :hide-after='1500'>
                                <img @click="del(scope.row.id)" src="@/assets/img/mediationRecord/icon4.png" alt="">
                            </el-tooltip> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
    <div class="page-wrapper">
      <el-pagination
        background
        :page-size="5"
        :pager-count="5"
        :current-page.sync="pageNum"
        layout="prev, pager, next"
        :page-count="totalSize?totalSize:1"
        @current-change="currentPage"
      />
    </div>
  </div>
</template>

<script>
import { downZip } from '@/api/dossier/dossier.js'
export default {
  name: 'DossierTable',
  props: ['tableData', 'totalSize'],
  data() {
    return {
      multipleSelection: [], // 选中的数据
      pageNum: 1 // 页码
    }
  },
  methods: {
    setPageNum(res) {
      this.pageNum = res
    },
    // 选择页码
    currentPage(res) {
      this.$emit('searchdossier', res)
      console.log(res, '选择页码')
    },
    // 目录
    setAction(res) {
      console.log(res)
      this.$emit('setAction', 1, res.row)
    },
    plaintiffDown(item) {
      // 必须同源才能下载
      console.log(item)
      this.$Message.loading({
        content: '文件打包中，请稍后...',
        duration: 0
      })
      downZip({
        tableIds: item.id
      }).then(res => {
        this.$Message.destroy()
        if (res.tarList && res.tarList.length) {
          const item = res.tarList[0]
          const alink = document.createElement('a')
          alink.href = item
          const aryss = item.split('.')
          const xar = aryss[aryss.length - 2].split('/')
          const type = aryss[aryss.length - 1]
          const name = xar[xar.length - 1]
          alink.download = name + '.' + type // 图片名
          console.log(alink)
          alink.click()
        } else {
          this.$message.error('暂无文件')
        }
      })
      // if(!urls && !urls.length) return
      // for(let i in urls){
      //     let item = urls[i];
      //     let alink = document.createElement("a");
      //     alink.href = item;
      //     let aryss = item.split(".");
      //     let xar = aryss[aryss.length-2].split("/");
      //     let type = aryss[aryss.length-1];
      //     let name = xar[xar.length-1];
      //     alink.download = name + "." + type; //图片名
      //     console.log(alink)
      //     alink.click();
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
    .row-hover{
        cursor: pointer;
    }
    .page-wrapper{
        text-align: right;
    }
    .btn-box {
        span {
            margin-left: 10px;
            cursor: pointer;
        }
        img {
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
        }
    }
</style>
