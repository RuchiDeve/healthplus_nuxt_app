<template>

  <nav class="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row noprint">
    <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
      <a class="navbar-brand brand-logo"
         style="background-image: url(/images/dlt-logo.jpeg);
               object-fit: contain; height: 100%; background-size: contain;"
         href="/"></a>
      <a class="navbar-brand brand-logo-mini"
         style="background-image: url(/images/dlt-logo.jpeg);
                   height: 100%; object-fit: contain; background-size: contain;"
         href="/"></a>
    </div>
    <div class="navbar-menu-wrapper d-flex align-items-center">
      <ul class="navbar-nav navbar-nav-right">
        <li class="nav-item dropdown d-none d-xl-inline-block">
          <a class="nav-link dropdown-toggle" id="UserDropdown"
             href="#" data-toggle="dropdown" aria-expanded="false">
            <span class="mr-3">Hello, {{$nuxt.$store.state.auth.user.username}}!</span>
            <img class="img-xs rounded-circle" src="http://placehold.it/100x100" alt="Profile image">
          </a>
          <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">

            <a class="dropdown-item text-danger" @click="$store.dispatch('security/logout')">
              Sign Out
            </a>
          </div>
        </li>
      </ul>
      <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
        <span class="icon-menu"></span>
      </button>
    </div>
    <form action="" class="dropdown-item d-none" id="logoutForm" method="post"></form>
  </nav>

</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>

</style>
