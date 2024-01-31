<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-12 col-lg-6">
          <h4 class="display-4">Matching Bonuses</h4>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row">
            <div class="col-12 col-lg-6">
              <vs-input
                icon-after
                block
                type="search"
                v-model="search"
                @input="getMatchingBonuses"
              >
                <template #icon>
                  <i class="bx bx-search"></i>
                </template>
              </vs-input>
            </div>
            <div class="col-12 col-lg-6">
              <button class="btn btn-primary" @click="createResource">
                <i class="bx bxs-plus-circle"></i>
                Add Matching Bonus
              </button>
              <vs-dialog
                blur
                :loading="resourceModal.loading"
                v-model="resourceModal.show"
                @close="resourceModal.show = false"
              >
                <template #header>
                  <h4 class="not-margin">
                    <b>{{ form.id ? "Edit" : "Add" }}</b> Matching Bonus
                  </h4>
                </template>

                <div class="con-form mt-3">
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="text"
                      label="Name"
                      v-model="form.name"
                    ></vs-input>
                  </div>
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="number"
                      label="Legs"
                      v-model="form.legs"
                    ></vs-input>
                  </div>
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="number"
                      label="Amount per leg"
                      v-model="form.amount_per_leg"
                    ></vs-input>
                  </div>
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="number"
                      label="Generation"
                      v-model="form.generation"
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
              <th>Name</th>
              <th>Generation</th>
              <th>Legs</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in matchingBonuses" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.generation }}</td>
              <td>{{ item.legs | number }}</td>
              <td>{{ item.amount_per_leg | number }}</td>
              <td :class="item.active ? 'text-success' : 'text-danger'">
                {{ item.active ? "Active" : "Inactive" }}
              </td>
              <td>
                <div class="d-flex">
                  <vs-button warn @click="editResource(item)" size="small">
                    <i class="bx bxs-edit"></i>
                    Edit
                  </vs-button>
                  <vs-button
                    v-if="item.active"
                    danger
                    @click="deactivate(item)"
                    size="small"
                  >
                    <i class="bx bxs-off"></i>
                    Deactivate
                  </vs-button>
                  <vs-button
                    v-else
                    success
                    @click="activate(item)"
                    size="small"
                  >
                    <i class="bx bxs-off"></i>
                    Activate
                  </vs-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="totalPages">
          <vs-pagination
            v-model="page"
            :length="totalPages"
            @input="getMatchingBonuses"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helpers from "@/utils/helpers";
import { Permissions } from "@/utils/permissions";
import _ from "lodash";

export default {
  name: "MatchingBonuses",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  data() {
    return {
      matchingBonuses: [],
      page: 1,
      totalPages: 1,
      resourceModal: {
        show: false,
        loading: false,
      },
      form: {
        id: "",
        name: "",
        generation: 0,
        legs: 0,
        amount_per_leg: 0,
        active: 0,
      },
      username: "",
      search: "",
    };
  },
  async fetch() {
    await this.getMatchingBonuses();
  },
  methods: {
    getMatchingBonuses: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[search]": this.search,
        };
        const response = await this.$repositories.matchingBonuses.index(params);
        this.matchingBonuses = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
    async save() {
      this.resourceModal.loading = true;

      try {
        if (this.form.id === "") {
          const response = await this.$repositories.matchingBonuses.create(
            _.clone(this.form)
          );
          this.getMatchingBonuses();
        } else {
          const response = await this.$repositories.matchingBonuses.update(
            this.form.id,
            _.clone(this.form)
          );
          let index = this.companyReps.findIndex(
            (item) => item.id === response.id
          );

          if (index >= 0) {
            this.companyReps[index] = response;
          }
        }

        this.$vs.notification({
          title: "Success",
          text: "Matching was saved.",
          color: "success",
          position: "top-center",
        });
      } catch (e) {}

      this.resourceModal.loading = false;
      this.resourceModal.show = false;
    },
    reset() {
      this.form = {
        id: "",
        name: "",
        generation: 0,
        legs: 0,
        amount_per_leg: 0,
        active: 0,
      };
    },
    createResource() {
      this.reset();
      this.resourceModal.show = true;
    },
    editResource(resource) {
      this.form = resource;
      this.resourceModal.show = true;
    },
    async deactivate(resource) {
      let params = {
        active: false,
      };

      if(window.confirm("Do you really want to deactivate this matching bonus?")){
        const response = await this.$repositories.matchingBonuses.update(
          resource.id,
          params
        );
        this.getMatchingBonuses();
      }
    },
    async activate(resource) {
      let params = {
        active: true,
      };

      if(window.confirm("Do you really want to activate this matching bonus?")){
        const response = await this.$repositories.matchingBonuses.update(
          resource.id,
          params
        );
        this.getMatchingBonuses();
      }

    },
  },
};
</script>

<style scoped></style>
