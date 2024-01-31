<template>

  <div class="container-scroller">
    <Header></Header>

    <div class="container-fluid page-body-wrapper">
      <Sidebar></Sidebar>

      <!-- partial -->
      <div class="main-panel">
        <div class="content-wrapper">

          <Nuxt />

        </div>
        <!-- content-wrapper ends -->
        <!-- partial:../../partials/_footer.html -->
        <footer class="footer">
          <div class="container-fluid clearfix">
                        <span class="text-muted d-block text-center text-sm-left d-sm-inline-block">
                            Copyright ©
                            {{new Date().getFullYear()}}
                            <a href="http://www.divineleverage.org/"
                               target="_blank">{{$nuxt.$options.head.title}}</a>. All rights reserved.</span>
            <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
                Together, we build our worth!
            </span>
          </div>
        </footer>
        <!-- partial -->
      </div>
      <!-- main-panel ends -->
    </div>
    <!-- page-body-wrapper ends -->


  </div>

</template>

<script>
export default {
  name: "app",
  mounted() {
    (function($) {
      'use strict';
      $(function() {
        $('[data-toggle="offcanvas"]').on("click", function() {
          $('.sidebar-offcanvas').toggleClass('active')
        });
      });
    })(jQuery);
  }
}
</script>

<style lang="scss">

.vue-form-wizard {
  h4.wizard-title {
    font-weight: 600 !important;
  }

  h3.step-title {
    color: #E77E23;
  }
}

</style>


<style lang="scss">

* {
  /* Works on Firefox */
  scrollbar-color: #161616 lightgray;
  scrollbar-width: none;
  scrollbar-height: none;

  &:hover{
    scrollbar-width: 8px;
    scrollbar-height: 8px;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      display: unset;
    }
  }
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  display: none;
}

*::-webkit-scrollbar-track {
  background: lightgrey;
}

*::-webkit-scrollbar-thumb {
  background-color: #161616;
  border-radius: 20px;
}

</style>
