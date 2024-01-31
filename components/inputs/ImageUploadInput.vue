<template>

  <div class="d-flex flex-column mx-auto align-items-center">
    <vs-avatar square dark :size="avatarSize">
      <img :src="src" v-show="src" alt="">
    </vs-avatar>
    <div class="d-flex mt-2">
      <button class="btn btn-xs btn-dark"
              @click="$refs.fileInput.click()">
        <i class="mdi mdi-image"></i>
        choose image...
      </button>

      <button class="btn btn-xs btn-warning ml-2"
              v-show="preview" @click="reset">
        <i class="mdi mdi-cancel"></i>
        reset
      </button>

      <input v-show="false"
             accept="image/*"
             ref="fileInput" type="file"
             @change="readImage($event)">
    </div>
  </div>

</template>

<script>
export default {
  name: "ImageUploadInput",
  data(){
    return {
      src: null,
      preview: null,
    }
  },
  props:{
    avatarSize: {
      default: '150',
      required: false,
      type: String
    },
    value: {
      required: false,
    }
  },
  methods:{
    reset(){
      this.preview = this.value;
      this.$refs.fileInput.value = null;
    },
    readImage($event){
      this.$readFileInput($event, this.loadImage);
    },
    loadImage(imgSrc, file){
      this.preview = imgSrc;
      this.$emit('input', file);
    },
  },
  mounted() {
    this.reset();
  },
  watch: {
    preview(src, __){
      this.src = src;
    }
  }
}
</script>

<style scoped>

</style>
