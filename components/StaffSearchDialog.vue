<template>

  <vs-dialog blur :loading="loading" v-model="active" @close="$emit('closed', false)">
    <template #header>
      <h4 class="not-margin">
        <b>Search</b> staffs...
      </h4>
    </template>

    <div class="con-form mt-3">
      <div class="form-group mb-5">
        <vs-input block label="Username" v-model="queryData.username"></vs-input>
      </div>

      <div class="form-group mb-4">
        <vs-input block label="Name" v-model="queryData.name"></vs-input>
      </div>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button @click="search" block>
          Submit
        </vs-button>
      </div>
    </template>
  </vs-dialog>

</template>

<script>
export default {
  name: "MemberSearchDialog",
  data(){
    return {
      queryData: {
        username: null,
        name: null,
      },
      loading: false,
      active: false,
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    async search(){
      this.$emit('search', this.queryData)
      this.$emit('closed', this.active)
    },
    reset(){
      this.queryData.name = null;
      this.queryData.username = null;
    }
  },
  watch: {
    show(value){
      this.active = value;
    }
  }
}
</script>

<style scoped>

</style>
