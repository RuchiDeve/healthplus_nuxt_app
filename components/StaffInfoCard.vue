<template>

  <div class="card" v-if="thisStaff">
    <div class="card-body p-2 d-flex align-items-center">
      <vs-avatar square size="40" dark>
        <template #text v-if="!thisStaff.avatar">
          {{ thisStaff.full_name }}
        </template>

        <img :src="thisStaff.avatar" v-if="thisStaff.avatar" alt="">
      </vs-avatar>
      <div class="ml-2 d-flex flex-column">
        <h6 class="card-text mb-0">{{thisStaff.full_name}}</h6>
        <small class=" text-small">{{thisStaff.user.username}}</small>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "StaffInfoCard",
  props: {
    thisStaff: {
      required: true,
    }
  },
}
</script>

<style scoped>

</style>
