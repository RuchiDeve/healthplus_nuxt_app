<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-2 mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Suppliers</h3>
          <vs-button size="large" active
                    @click="newSupplier" >
            <i class="mdi mdi-plus-circle"></i>
            Add New Supplier
          </vs-button>

          <vs-dialog blur not-padding auto-width :loading="supplierModal.loading"
                     v-model="supplierModal.show"
                     @close="supplierModal.show = false">
            <supplier-form
              :default-supplier="supplierModal.selectedSupplier"
              @loading="loading => supplierModal.loading = loading"
            @saved="onSupplierSaved($event)"></supplier-form>
          </vs-dialog>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-body" ref="suppliers-list" style="min-height: 300px">
            <div class="d-flex grid-margin" v-if="pagination">
              <vs-pagination only-arrows v-model="page" :length="totalPages" />
              <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }}</b>
                  </span>
            </div>
            <div class="table-responsive">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
                  <td>{{index + 1}}</td>
                  <td>{{supplier.fullName}}</td>
                  <td>{{supplier.phone}}</td>
                  <td>{{supplier.user.email}}</td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <vs-button size="small" warn
                                 @click="editSupplier(supplier)">
                        <i class="mdi mdi-content-save-edit"></i>
                        edit
                      </vs-button>
                      <vs-button size="small" dark
                                 @click="$router.push('/suppliers/' + supplier.id + '/details')">
                        <i class="mdi mdi-eye"></i>
                        details
                      </vs-button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-12 mt-4" v-if="totalPages">
          <vs-pagination v-model="page" :length="totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SupplierForm from "@/components/SupplierForm";
export default {
  name: "index",
  components: {SupplierForm},
  layout: "app",
  data: () => ({
    suppliers: [],
    pagination: null,
    page: 1,
    totalPages: null,
    supplierModal: {
      show: false,
      loading: false,
      selectedSupplier: null,
    }
  }),
  methods: {
    newSupplier(){
      this.supplierModal.selectedSupplier = null;
      this.supplierModal.show = true;
    },
    editSupplier(supplier){
      this.supplierModal.selectedSupplier = supplier;
      this.supplierModal.show = true;
    },
    async loadSuppliers(){
      await this.$doTask(async () => {

        let response = await this.$axios.get('/suppliers', {
          params: {
            page: this.page
          }
        });

        this.suppliers = response.data.content;
        this.pagination = response.data.pagination;
        this.totalPages = response.data.totalPages;
      }, 'Fetching suppliers...', this.$refs['suppliers-list']);
    },
    onSupplierSaved(supplier){
      this.supplierModal.show = false;
      this.supplierModal.loading = false;
      this.loadSuppliers();
    }
  },
  watch: {
    page(_, __){
      this.loadSuppliers();
    }
  },
  mounted() {
    this.loadSuppliers();
  }
}
</script>

<style scoped>

</style>
