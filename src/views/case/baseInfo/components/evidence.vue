<template>
  <div class="evidence-wrapper">
    <header1 :title="'证据信息'" :is-add="true" @add="add" />
    <el-table
      :data="tableData"
      border
      class="tab-wrapper"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
      />
      <el-table-column
        prop="litigantMan"
        label="提供者"
      />
      <el-table-column
        prop="evidenceName"
        label="证据名称"
      />
      <el-table-column
        label="提供时间"
      >
        <template slot-scope="scope">
          {{ scope.row.provideDate | time }}
        </template>
      </el-table-column>
      <el-table-column
        label="附件"
      >
        <template slot-scope="scope">
          <div class="down-wrapper">
            <p v-for="item in scope.row.evidenceAttachments" :key="item.id" style="color: #2d8cf0;cursor: pointer;" @click="preview(item.url,scope.row.evidenceAttachments)">{{ item.name }}</p>
            <span class="down-btn" @click="downFiles(scope.row.evidenceAttachments)">
              <i class="el-icon-download" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="getTeamData.type != 2"
        v-permission="[1,2,4,6]"
        label="操作"
      >
        <template slot-scope="scope">
          <div class="opera-btn">
            <img src="@/assets/img/edit.png" @click="edit(scope.row.id)">
            <img src="@/assets/img/del.png" @click="del(scope.row.id)">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <addEvidence ref="addEvidence" :litigant-list="litigantData" :title="dialogTitle" @done="getEvidence" />
    <preview ref="preview" :is-down="true" :file-list="fileUrl" />
  </div>
</template>

<script>
import header1 from './header'
import { evidenceList, delEvi } from '@/api/case/index.js'
import { fileDownload } from '@/api/common/common.js'
import { mapGetters } from 'vuex'
import preview from '@/components/preview/index'
import addEvidence from '@/components/evidence/index'
import {
  SERVICEURL,
  HWYURL
} from '@/utils/constVal.js'
export default {
  components: {
    header1,
    addEvidence,
    preview
  },
  props: {

  },
  data() {
    return {
      tableData: [],
      dialogTitle: '新增证据',
      litigantData: [],
      eviId: null,
      dialogVisible1: false,
      lookUrl: '',
      downUrl: '',
      process: null,
      role: this.$store.state.user.userRole,
      fileUrl: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getTeamData'])
  },
  watch: {
    getCaseInfo() {
      this.process = this.getCaseInfo.process
      this.getEvidence()
      this.getlitigantData()
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 查看证据信息
    getEvidence() {
      evidenceList({ lawCaseId: this.getCaseInfo.id }).then(res => {
        if (res.state === 100) {
          this.tableData = res.evidences
          console.log(this.tableData)
        }
      })
    },
    // 添加证据
    add() {
      this.dialogTitle = '新增证据'
      this.$refs.addEvidence.show()
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 获取提供人数据
    getlitigantData() {
      this.litigantData = []
      const data = JSON.parse(JSON.stringify(this.getCaseInfo))
      if (data.litigants && data.litigants.length >= 0) {
        data.litigants.forEach(item => {
          if (item.enable) {
            const obj = {
              id: item.id,
              litigantName: item.litigantName
            }
            this.litigantData.push(obj)
          }
        })
      }
    },
    // 文件超出个数触发
    handleExceed() {
      this.$message({
        showClose: true,
        message: `文件最多不能超过10个`,
        type: 'error'
      })
    },
    // 删除证据
    del(id) {
      this.$confirm('是否确认删除')
        .then(_ => {
          delEvi({ eviId: id }).then(res => {
            if (res.state === 100) {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'success'
              })
              this.$store.dispatch('GetCaseInfo')
            }
          })
        }).catch(() => {

        })
    },
    // 查看详情
    edit(id) {
      this.dialogTitle = '编辑证据'
      this.$refs.addEvidence.show(id)
    },
    // 下载证据
    download() {
      this.downFile(this.downUrl)
    },
    beforeClose1() {
      this.dialogVisible1 = false
    },
    // 批量下载文件
    downFiles(files) {
      console.log(files)
      if (files && files.length >= 0) {
        files.forEach(item => {
          this.downFile(item.url)
        })
      }
    },
    downFile(url) {
      if (url.indexOf(HWYURL) === -1) {
        url = SERVICEURL + url
      }
      fileDownload(url)
      // const a = document.createElement('a')
      // a.download = ''
      // a.href = url
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
    },
    preview(url, e) {
      this.fileUrl = e.map(item => item.url)
      this.$refs.preview.show(url, this.fileUrl)
    }
  }
}
</script>

<style scoped lang="scss">
.evidence-wrapper {
  margin-top: 10px;
  ::v-deep .el-table td,.el-table th {
    text-align: center;
  }
  ::v-deep .cell {
    text-align: center;
  }
  .tab-wrapper {
    margin-top: 10px;
  }
  .down-btn {
    display: inline-flex;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    background-color: #7FCBFE;
    width: 30px;
    height: 30px;
    color: #fff;
    margin-left: 5px;
  }
  .down-wrapper {
    position: relative;
    padding-right: 50px;
    min-height: 30px;
    .down-btn {
      position: absolute;
      top: 0px;
      right: 0px;
      display: inline-flex;
      border-radius: 5px;
      justify-content: center;
      align-items: center;
      background-color: #7FCBFE;
      width: 30px;
      height: 30px;
      color: #fff;
      margin-left: 5px;
    }
  }
  .opera-btn {
    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
      &:nth-child(1) {
        margin-right: 10px;
      }
    }
  }
}
.look-wrapper {
  width: 100%;
  max-height: 600px;
  overflow: auto;
  text-align: center;
}
.look-wrapper img {
  min-width: 200px;
  max-width: 500px;
}
</style>
