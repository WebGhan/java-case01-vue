<template>
  <div class="g-app-container-flex">
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="text" name="name">
      <input type="file" name="image">
      <button type="submit">提交</button>
    </form>

    <AvatarUpload v-model="iamgeUrl" />
  </div>
</template>

<script>
import { AvatarUpload } from '@/components'

export default {
  name: 'FileUpload',
  components: {
    AvatarUpload
  },
  data() {
    return {
      iamgeUrl: 'https://java-case.oss-cn-chengdu.aliyuncs.com/450dc02c-76a6-4b30-aeb6-66f75b38aeab.png'
    }
  }
}
</script>
