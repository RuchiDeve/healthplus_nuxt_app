<template>

  <li class="nav-item">
    <NuxtLink :to="link" class="nav-link">
      <span class="menu-icon mdi mdi-18px" :class="cssClass"></span>
      <span class="menu-title">{{title}}</span>
    </NuxtLink>
  </li>

</template>

<script>
export default {
  name: "SidebarMenuItem",
  props: {
    title: {
      required: true,
      type: String
    },
    link: {
      required: true,
      type: String,
    },
    cssClass: {
      required: false,
      default: 'mdi-menu'
    },

  }
}
</script>

<style scoped>

</style>
