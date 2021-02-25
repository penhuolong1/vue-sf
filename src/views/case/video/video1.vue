<template>
  <div style="margin-top:20px">
    <div class="header1-wrapper">
      <span> 解纷录像</span>
    </div>
    <el-table
      v-loading="videoLoading"
      :data="videoList"
      border
      class="tab-wrapper"
      style="width: 100%"
    >
      <el-table-column
        prop="fileName"
        label="录像名称"
      />
      <el-table-column
        prop="time"
        label="上传时间"
      />
      <el-table-column
        prop="distance"
        label="视频时长"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a @click="lookVideo(scope.row.fileUrl)">查看</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right;"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalPage"
      @prev-click="prev"
      @next-click="next"
      @current-change="pager"
    />
    <el-dialog
      title="查看录像"
      :visible.sync="lookVideoVisible"
      width="800px"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <video v-if="lookVideUrl" id="movie" class="video" :src="lookVideUrl" controls />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listVideo } from '@/api/rtcRoom/rtcRoom.js'
import { formatDate } from '@/utils/format.js'

export default {
  data() {
    return {
      lookVideoVisible: false, // 录像展示弹窗
      videoLoading: false, // 录像列表加载
      lookVideUrl: '', // 预览的url
      videoList: [
        // { index: 1,
        //   fileName: '一个录像',
        //   fileUrl: 'http://pili-vod.hlcourt.gov.cn/psegments/z1.hlcourt.592bca75c0ec44f1a1593c1149fd63b6/1596534538-1596534548.mp4'
        // },
        // { index: 2,
        //   fileName: '第二个录像',
        //   fileUrl: 'https://pili-vod.hlcourt.gov.cn/psegments/z1.hlcourt.1611039464770/1611039492-1611044432.mp4'
        // }
      ],
      caseId: null,
      pageNum: 1, // 当前页
      pageSize: 5, // 每页展示多少个
      totalPage: 1 // 总条数
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.caseId = this.getCaseInfo.id
      console.log(this.caseId)
      this.listVideo(this.caseId)
    },
    listVideo(id) {
      this.videoLoading = true
      console.log(id)
      const params = {
        caseId: this.caseId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      listVideo(params).then(res => {
        this.videoLoading = false
        if (res.state === 100) {
          console.log(res)
          this.videoList = res.data.content.map((item, index) => {
            item.index = index + 1
            item.time = formatDate(item.startAtDate)
            item.fileName = item.fileUrl.split('/').pop()
            return item
          })
          this.totalPage = res.data.total
          console.log(this.videoList)
        }
      })
    },
    // 查看录像
    lookVideo(url) {
      console.log(url)
      if (!url.includes('https')) { // 预览的时候把http转陈https不然本地开发的时候会报错预览不了视频
        this.lookVideUrl = url.replace(/http/g, 'https')
      } else {
        this.lookVideUrl = url
      }
      this.lookVideoVisible = true
    },
    // 上一页
    prev() {
      this.pageNum--
      this.listVideo(this.caseId)
    },
    // 下一页
    next() {
      this.pageNum++
      this.listVideo(this.caseId)
    },
    // 第几页
    pager(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.listVideo(this.caseId)
    },
    // 点击关闭
    handleClose() {
      var video = document.getElementById('movie')
      video.pause() // 暂停控制
      this.lookVideoVisible = false
    }
  }

}
</script>
<style scoped lang="scss">
.header1-wrapper {
  height: 35px;
  line-height: 35px;
  span {
    color: #007AFF;
    font-weight: bold;
    font-size: 16px;
  }
}
.tab-wrapper {
    margin-top: 10px;
}
.video {
  width: 750px;
  height: 500px;
}
</style>
