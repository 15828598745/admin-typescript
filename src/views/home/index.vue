<template>
  <div>
    <el-button v-waves type="primary" @click="test">
      测试
    </el-button>
    <big-file-upload />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { loginOut } from "../../api/app";
import bigFileUpload from '../../components/Upload/bigFileUpload.vue';

@Component({
  name: "App",
  components: {
    bigFileUpload
  }
})
export default class extends Vue {
  test() {
    loginOut();
  }
}
</script>

<style lang="scss" scoped>
#input {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 8em;
  max-width: 80%;
  background: none;
  border: none;
  outline: none;
  color: #abc;
  font-size: 3em;
  text-align: center;
  z-index: 999;
  transform: translateX(-50%);
  user-select: none;
}
</style>
