<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-2 mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Partners</h3>
          <vs-button size="large" active
                    @click="newPartner" >
            <i class="mdi mdi-plus-circle"></i>
            Add New Partner
          </vs-button>

          <vs-dialog blur not-padding auto-width :loading="partnerModal.loading"
                     v-model="partnerModal.show"
                     @close="partnerModal.show = false">
            <partner-form
              :default-partner="partnerModal.selectedPartner"
              @loading="loading => partnerModal.loading = loading"
            @saved="onPartnerSaved($event)"></partner-form>
          </vs-dialog>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-body" ref="partners-list" style="min-height: 300px">
            <div class="d-flex grid-margin" v-if="totalPages > 0">
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
                <tr v-for="(partner, index) in partners" :key="partner.id">
                  <td>{{index + 1}}</td>
                  <td>{{partner.fullName}}</td>
                  <td>{{partner.phone}}</td>
                  <td>{{partner.user.email}}</td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <vs-button size="small" warn
                                 @click="editPartner(partner)">
                        <i class="mdi mdi-content-save-edit"></i>
                        edit
                      </vs-button>
                      <vs-button size="small" dark
                                 @click="$router.push('/partners/' + partner.id + '/details')">
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
        <div class="col-12 mt-4" v-if="totalPages > 0">
          <vs-pagination v-model="page" :length="totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PartnerForm from "@/components/PartnerForm";
export default {
  name: "index",
  components: {PartnerForm},
  layout: "app",
  data: () => ({
    partners: [],
    pagination: null,
    page: 1,
    totalPages: null,
    partnerModal: {
      show: false,
      loading: false,
      selectedPartner: null,
    }
  }),
  methods: {
    newPartner(){
      this.partnerModal.selectedPartner = null;
      this.partnerModal.show = true;
    },
    editPartner(partner){
      this.partnerModal.selectedPartner = partner;
      this.partnerModal.show = true;
    },
    async loadPartners(){
      await this.$doTask(async () => {

        let response = await this.$axios.get('/partners', {
          params: {
            page: this.page
          }
        });

        this.partners = response.data.content;
        this.pagination = response.data.pagination;
        this.totalPages = response.data.totalPages;
      }, 'Fetching partners...', this.$refs['partners-list']);
    },
    onPartnerSaved(partner){
      this.partnerModal.show = false;
      this.partnerModal.loading = false;
      this.loadPartners();
    }
  },
  watch: {
    page(_, __){
      this.loadPartners();
    }
  },
  mounted() {
    this.loadPartners();
  }
}
</script>

<style scoped>

</style>
