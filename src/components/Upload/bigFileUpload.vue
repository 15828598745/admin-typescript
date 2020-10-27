<template>
  <div class="upload-box">
    <el-upload ref="upload" class="upload-demo" action="./" :on-change="changed" :file-list="fileList" :auto-upload="false" :limit="1">
      <el-button slot="trigger" size="small" type="primary" :loading="loading">
        {{ loading ? "上传中..." : "选取文件" }}
      </el-button>
      <div slot="tip" class="el-upload__tip">
        {{ url }}
      </div>
      <el-progress v-if="loading" :percentage="percentage" :status="status" />
    </el-upload>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { uploadChunk, mergeChunks } from "../../api/app";
import axios from "axios";
import { EErrCode } from "../../utils/errCode";
import MD5 from "spark-md5";

@Component({
  name: "BigFileUpload"
})
export default class extends Vue {
  /* eslint-disable */
  private fileList = [];
  private status = "success" || "exception";
  private percentage = 0;
  private chunkSize = 2 * 1024 * 1024;
  private maxSize = 500 * 1024 * 1024;
  private loading = false;
  private url = "";
  // @Prop({ required: true }) private value!: boolean;

  changed(file: any, fileList: any[]) {
    let raw: File = file.raw;
    if (raw.size > this.maxSize) {
      this.reset();
      this.$message.error("文件大小不能超过500M");
      return;
    }
    this.handelFile(raw);
  }

  async handelFile(file: File) {
    this.loading = true;
    let blockCount = Math.ceil(file.size / this.chunkSize);
    // axiosPromise数组
    const axiosPromiseArray = [];
    const hash = await this.hashFile(file);
    let wc = 0;
    for (let i = 0; i < blockCount; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(file.size, start + this.chunkSize);
      // 构建表单
      const form = new FormData();
      form.append("file", this.blobSlice(file, start, end));
      form.append("name", file.name);
      form.append("total", blockCount.toString());
      form.append("index", i.toString());
      form.append("size", file.size.toString());
      form.append("hash", hash + "");
      let chunkRet = await uploadChunk(form);
      if (chunkRet.code !== EErrCode.OK) {
        this.reset();
        this.$message.error("上传文件失败");
        break;
      } else {
        this.percentage = ((i + 1) / blockCount) * 100;
      }
    }
    // 合并chunks
    const data = {
      size: file.size,
      name: file.name,
      total: blockCount,
      hash
    };
    let ret = await mergeChunks(data);
    if (ret.code !== EErrCode.OK) {
      this.reset();
      this.status = "exception";
      this.$message.error("上传失败");
      return;
    }
    this.reset();
    this.status = "success";
    this.$message.success("上传成功");
    this.url = ret.msg.url;
  }

  blobSlice(blob: Blob | any, startByte: number, endByte: number) {
    if (blob.slice) {
      return blob.slice(startByte, endByte);
    }
    // 兼容firefox
    if (blob.mozSlice) {
      return blob.mozSlice(startByte, endByte);
    }
    // 兼容webkit
    if (blob.webkitSlice) {
      return blob.webkitSlice(startByte, endByte);
    }
    return null;
  }

  hashFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const chunks = Math.ceil(file.size / this.chunkSize);
      let currentChunk = 0;
      const spark = new MD5.ArrayBuffer();
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        spark.append(e.target.result);
        currentChunk += 1;
        if (currentChunk < chunks) {
          this.loadNext(file, currentChunk, fileReader);
        } else {
          const result = spark.end();
          const sparkMd5 = new MD5();
          sparkMd5.append(result);
          sparkMd5.append(file.name);
          const hexHash = sparkMd5.end();
          resolve(hexHash);
        }
      };
      fileReader.onerror = () => {
        console.warn("文件读取失败！");
      };
      this.loadNext(file, currentChunk, fileReader);
    }).catch(err => {
      console.log(err);
    });
  }

  loadNext(file: File, currentChunk: number, fileReader: FileReader) {
    const start = currentChunk * this.chunkSize;
    const end =
      start + this.chunkSize >= file.size ? file.size : start + this.chunkSize;
    fileReader.readAsArrayBuffer(this.blobSlice(file, start, end));
  }

  reset() {
    this.fileList = [];
    this.loading = false;
    this.percentage = 0;
    this.url = "";
  }
}
</script>

<style lang="scss">
.upload-box {
  width: 100%;
  max-width: 200px;
}
</style>
