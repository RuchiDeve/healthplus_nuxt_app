<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Incentive Requirement Schedules</h4>
        <div>
          <vs-input icon-after block type="search" v-model="search" @input="getIncentiveRequirementSchedules">
            <template #icon>
              <i class='bx bx-search'></i>
            </template>
          </vs-input>
          <!-- <button class="btn btn-primary" @click="newRole">
            <i class="bx bxs-plus-circle"></i>
            Add Role
          </button> -->
          <vs-dialog
            blur
            :loading="resourceModal.loading"
            v-model="resourceModal.show"
            @close="resourceModal.show = false"
          >
            <template #header>
              <h4 class="not-margin">
                <b>{{ form.id ? "Edit" : "Add" }}</b> Stage
                Requirement Schedule
              </h4>
            </template>

            <div class="con-form mt-3">
              <div class="form-group mb-5">
                <vs-select
                  block
                  label="Country"
                  placeholder="Select country"
                  v-model="form.country_id"
                >
                  <vs-option
                    v-for="country in countries"
                    :key="country.name"
                    :label="country.name"
                    :value="country.id"
                  >
                    {{ country.name }}
                  </vs-option>
                </vs-select>
              </div>
              <div class="form-group mb-5">
                <vs-select
                  block
                  label="Stage"
                  placeholder="Select stage"
                  v-model="form.stage_id"
                >
                  <vs-option
                    v-for="stage in stages"
                    :key="stage.name"
                    :label="stage.name"
                    :value="stage.id"
                  >
                    {{ stage.name }}
                  </vs-option>
                </vs-select>
              </div>
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
                  label="Entry Points (2 Legs)"
                  v-model="form.required_points_for_entry_by2legs"
                ></vs-input>
              </div>
              <div class="form-group mb-5">
                <vs-input
                  block
                  type="number"
                  label="Entry Points (3 Legs)"
                  v-model="form.required_points_for_entry_by3legs"
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
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Stage</th>
              <th>Name</th>
              <th>Entry Points (2 Legs)</th>
              <th>Entry Points (3 Legs)</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in incentiveRequirementSchedules.data"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.country.name }}</td>
              <td>{{ item.stage.name }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.required_points_for_entry_by2legs | number }}</td>
              <td>{{ item.required_points_for_entry_by3legs | number }}</td>
              <td :class="item.active ? 'text-success' : 'text-danger'">
                {{ item.active ? 'Active' : 'Inactive' }}
              </td>
              <td>
                <div class="d-flex">
                  <vs-button
                    warn
                    @click="editForm(item)"
                    size="small"
                  >
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

        <div class="pt-4" v-if="incentiveRequirementSchedules.totalPages">
          <vs-pagination
            v-model="incentiveRequirementSchedules.page"
            :length="incentiveRequirementSchedules.totalPages"
            @input="getIncentiveRequirementSchedules"
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
  name: "IncentiveRequirementSchedules",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  data() {
    return {
      incentiveRequirementSchedules: {
        data: [],
        page: 1,
        totalPages: 1,
      },
      resourceModal: {
        show: false,
        loading: false,
      },
      form: {
        id: null,
        stage_id: null,
        country_id: null,
        name: '',
        required_points_for_entry_by2legs: null,
        required_points_for_entry_by3legs: null,
      },
      countries: [],
      stages: [],
      search: "",
    };
  },
  async fetch() {
    await this.getIncentiveRequirementSchedules();
    await this.getCountries();
    await this.getStages();
  },
  methods: {
    async getCountries() {
      await this.$doTask(async () => {
        const response = await this.$axios.get("countries");
        this.countries = response.data;
      }, "Loading...");
    },
    async getStages() {
      await this.$doTask(async () => {
        const response = await this.$axios.get("stages");
        this.stages = response.data;
      }, "Loading...");
    },
    getIncentiveRequirementSchedules: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.incentiveRequirementSchedules.page,
          "filter[search]": this.search,
        };
        const response =
          await this.$repositories.incentiveRequirementSchedules.index(params);
        this.incentiveRequirementSchedules.data = response.data;
        this.incentiveRequirementSchedules.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
    async save() {
      this.resourceModal.loading = true;

      try {
        // const response = await this.$axios.post('security/roles/save', _.clone(this.role));
        if (this.form.id === null) {
          const response = await this.$repositories.incentiveRequirementSchedules.create(_.clone(this.form));
          this.incentiveRequirementSchedules.push(response.data);
        }else{
          const response = await this.$repositories.incentiveRequirementSchedules.update(this.form.id, _.clone(this.form));
          this.getIncentiveRequirementSchedules()
        }

        this.$vs.notification({
          title: "Success",
          text: "Stage requirement schedule was saved.",
          color: "success",
          position: "top-center",
        });
      } catch (e) {}

      this.resourceModal.loading = false;
      this.resourceModal.show = false;
    },
    async deactivate(resource) {
      if(window.confirm("Do you really want to deactivate this incentive?")){
        let params = {
          active: false,
        };

        const response = await this.$repositories.incentiveRequirementSchedules.update(
          resource.id,
          params
        );
        this.getIncentiveRequirementSchedules();
      }
    },
    async activate(resource) {
      if(window.confirm("Do you really want to activate this incentive?")){
        let params = {
          active: true,
        };

        const response = await this.$repositories.incentiveRequirementSchedules.update(
          resource.id,
          params
        );
        this.getIncentiveRequirementSchedules();
      }
    },
    reset() {
      this.form = {
        id: null,
        stage_id: null,
        country_id: null,
        name: '',
        required_points_for_entry_by2legs: null,
        required_points_for_entry_by3legs: null,
      };
    },
    newRole() {
      this.reset();
      this.resourceModal.show = true;
    },
    editForm(resource) {
      this.form = resource;
      this.resourceModal.show = true;
    },
  },
};
</script>

<style scoped></style>
