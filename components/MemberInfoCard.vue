<template>

  <div class="card" v-if="thisMember">
    <div class="card-body p-2 d-flex align-items-center">
      <vs-avatar square size="60" dark>
        <template #text v-if="!thisMember.avatar">
          {{ thisMember.full_name }}
        </template>

        <img :src="$backendFiles(thisMember.avatar)" v-if="thisMember.avatar" alt="">
      </vs-avatar>
      <div class="ml-2 d-flex flex-column">
        <h6 class="card-text mb-0">{{thisMember.full_name}}</h6>
        <small class=" text-small">{{thisMember.user.username}}</small>
        <span class="text-small font-weight-bold">{{thisMember.stage.name}}</span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "MemberInfoCard",
  props: {
    thisMember: {
      required: true,
    }
  },
}
</script>

<style scoped>

</style>
