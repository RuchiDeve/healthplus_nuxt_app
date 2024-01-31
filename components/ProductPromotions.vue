<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-5 mb-3">
        <div class="col-12 col-lg-6">
          <h4 class="display-4">Product Promotions</h4>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row">
            <div class="col-12 col-md-6">
              <vs-input
                icon-after
                block
                placeholder="Search"
                type="search"
                v-model="search"
                @input="getProductPromotions"
              >
                <template #icon>
                  <i class="bx bx-search"></i>
                </template>
              </vs-input>
            </div>
            <div class="col-12 col-md-6" v-if="!activeOnly">
              <vs-button @click="createResource">
                <i class="bx bxs-plus-circle"></i>
                Add Product Promotion
              </vs-button>
              <vs-dialog
                blur
                :loading="resourceModal.loading"
                v-model="resourceModal.show"
                @close="resourceModal.show = false"
              >
                <template #header>
                  <h4 class="not-margin">
                    <b>{{ form.id ? "Edit" : "Add" }}</b> Product Promotion
                  </h4>
                </template>

                <div class="con-form mt-3">
                  <div class="form-group mb-5">
                    <vs-select
                      block
                      label="Product"
                      placeholder="Select product"
                      v-model="form.product_id"
                    >
                      <vs-option
                        v-for="product in products"
                        :key="product.name"
                        :label="product.name"
                        :value="product.id"
                      >
                        {{ product.name }}
                      </vs-option>
                    </vs-select>
                  </div>
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="date"
                      label="Starts at"
                      v-model="form.starts_at"
                    ></vs-input>
                  </div>
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="date"
                      label="Ends at"
                      v-model="form.ends_at"
                    ></vs-input>
                  </div>
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="number"
                      label="Amount per CPT"
                      v-model="form.amount_per_cpt"
                    ></vs-input>
                  </div>
                </div>

                <template #footer>
                  <div class="footer-dialog">
                    <vs-button
                      @click="save"
                      :loading="resourceModal.loading"
                      :active-disabled="resourceModal.loading"
                      block
                    >
                      Submit
                    </vs-button>
                  </div>
                </template>
              </vs-dialog>
            </div>
          </div>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Amount per CPT</th>
              <th>Duration</th>
              <th>Days Left</th>
              <th>Status</th>
              <th v-if="admin">Qualifiers</th>
              <th v-if="admin"></th>
            </tr>
          </thead>
          <tbody>
            <vs-dialog
              blur
              :loading="qualifiersModal.loading"
              v-model="qualifiersModal.show"
              @close="qualifiersModal.show = false"
            >
              <product-promotion-qualifiers
                :qualifiers="qualifiers"
              ></product-promotion-qualifiers>
            </vs-dialog>
            <tr v-for="(item, index) in productPromotions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product.name }}</td>
              <td>{{ item.amount_per_cpt | money }}</td>
              <td>{{ item.starts_at | date }} to {{ item.last_day | date }}</td>
              <td>{{ item.days_left }} days</td>
              <td :class="item.status ? 'text-success' : 'text-danger'">
                {{ item.status ? "Active" : "Inactive" }}
              </td>
              <td v-if="admin">
                <vs-button transparent @click="viewQualifiers(item)">
                  {{ item.product_promotion_bonuses.length }}
                </vs-button>
              </td>
              <td v-if="admin">
                <div class="d-flex">
                  <vs-button
                    warn
                    v-if="item.status"
                    @click="editResource(item)"
                    size="small"
                  >
                    <i class="bx bxs-edit"></i>
                    Edit
                  </vs-button>
                  <vs-button
                    v-if="item.status"
                    danger
                    @click="deactivate(item)"
                    size="small"
                  >
                    <i class="bx bxs-off"></i>
                    Deactivate
                  </vs-button>
                </div>
              </td>
            </tr>
            <tr v-if="productPromotions.length === 0">
              <td colspan="7" class="text-center">
                No <span v-if="activeOnly">active</span> promo found
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="totalPages">
          <vs-pagination
            v-model="page"
            :length="totalPages"
            @input="getProductPromotions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductPromotionQualifiers from "@/components/ProductPromotionQualifiers";

export default {
  name: "ProductPromotions",
  props: {
    activeOnly: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProductPromotionQualifiers,
  },
  data() {
    return {
      qualifiers: [],
      products: [],
      productPromotions: [],
      page: 1,
      totalPages: 1,
      resourceModal: {
        show: false,
        loading: false,
      },
      qualifiersModal: {
        show: false,
        loading: false,
      },
      form: {
        id: "",
        product_id: "",
        starts_at: "",
        ends_at: "",
        amount_per_cpt: "",
      },
      search: "",
    };
  },
  mounted() {
    this.getProducts();
    this.getProductPromotions();
  },
  methods: {
    async getProducts() {
      await this.$doTask(async () => {
        this.products = await this.$repositories.products.index();
      }, "Loading...");
    },
    viewQualifiers(item) {
      this.qualifiersModal.loading = true;
      this.qualifiers = item.product_promotion_bonuses;
      this.qualifiersModal.loading = false;
      this.qualifiersModal.show = true;
    },
    getProductPromotions: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[search]": this.search,
        };

        if (this.activeOnly) {
          params["filter[status]"] = true;
        }

        const response = await this.$repositories.productPromotions.index(
          params
        );
        this.productPromotions = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
    async save() {
      this.resourceModal.loading = true;

      try {
        if (this.form.id === "") {
          const response = await this.$repositories.productPromotions.create(
            _.clone(this.form)
          );
          this.productPromotions.push(response);
        } else {
          const response = await this.$repositories.productPromotions.update(
            this.form.id,
            _.clone(this.form)
          );
          if (this.activeOnly) {
            this.getProductPromotions();
          } else {
            let index = this.productPromotions.findIndex(
              (item) => item.id === response.id
            );
            if (index >= 0) {
              this.productPromotions[index] = { ...response };
            }
          }
        }

        this.$vs.notification({
          title: "Success",
          text: "Product promotion was saved.",
          color: "success",
          position: "top-center",
        });
      } catch (e) {}

      this.resourceModal.loading = false;
      this.resourceModal.show = false;
    },
    async deactivate(item) {
      try {
        let params = {
          deactivate: true,
        };

        const response = await this.$repositories.productPromotions.update(
          item.id,
          params
        );

        this.getProductPromotions();

        this.$vs.notification({
          title: "Success",
          text: "Product promotion was deactivated.",
          color: "success",
          position: "top-center",
        });
      } catch (e) {}
    },
    reset() {
      this.form = {
        id: "",
        product_id: "",
        starts_at: "",
        ends_at: "",
        amount_per_cpt: "",
      };
    },
    editResource(resource) {
      this.form = { ...resource };
      this.form.ends_at = resource.last_day;
      this.resourceModal.show = true;
    },
    createResource() {
      this.reset();
      this.resourceModal.show = true;
    },
  },
};
</script>

<style scoped></style>
