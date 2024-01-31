<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Stage Requirement Schedules</h4>
        <div>
          <vs-input icon-after block type="search" v-model="search" @input="getStageRequirementSchedules">
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
                <b>{{ stageRequirementSchedule.id ? "Edit" : "Add" }}</b> Stage
                Requirement Schedule
              </h4>
            </template>

            <div class="con-form mt-3">
              <div class="form-group mb-5">
                <vs-select
                  block
                  label="Country"
                  placeholder="Select country"
                  v-model="stageRequirementSchedule.country_id"
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
                  v-model="stageRequirementSchedule.stage_id"
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
                  type="number"
                  label="Direct Purchase Bonus"
                  v-model="stageRequirementSchedule.bonus_on_direct_purchase"
                ></vs-input>
              </div>
              <div class="form-group mb-5">
                <vs-input
                  block
                  type="number"
                  label="Subsequent Direct Purchase Bonus (2nd CPT and above)"
                  v-model="stageRequirementSchedule.subsequent_bonus_on_direct_purchase"
                ></vs-input>
              </div>
              <div class="form-group mb-5">
                <vs-input
                  block
                  type="number"
                  label="Referral Upgrade Bonus (2nd - 5th CPT)"
                  v-model="stageRequirementSchedule.referral_upgrade_bonus_on_direct_purchase"
                ></vs-input>
              </div>
              <div class="form-group mb-5">
                <vs-input
                  block
                  type="number"
                  label="Entry Points (1 Leg)"
                  v-model="stageRequirementSchedule.required_points_for_entry_by1leg"
                ></vs-input>
              </div>
              <div class="form-group mb-5">
                <vs-input
                  block
                  type="number"
                  label="Entry Points (2 Legs)"
                  v-model="stageRequirementSchedule.required_points_for_entry_by2legs"
                ></vs-input>
              </div>
              <div class="form-group mb-5">
                <vs-input
                  block
                  type="number"
                  label="Entry Points (3 Legs)"
                  v-model="stageRequirementSchedule.required_points_for_entry_by3legs"
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
              <th>First Direct Purchase Bonus</th>
              <th>Subsequent Bonus</th>
              <th>Referral Upgrade Bonus</th>
              <th>Entry Points (1 Leg)</th>
              <th>Entry Points (2 Legs)</th>
              <th>Entry Points (3 Legs)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in stageRequirementSchedules.data"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.country.name }}</td>
              <td>{{ item.stage.name }}</td>
              <td>{{ item.bonus_on_direct_purchase | money }}</td>
              <td>{{ item.subsequent_bonus_on_direct_purchase | money }}</td>
              <td>{{ item.referral_upgrade_bonus_on_direct_purchase | money }}</td>
              <td>{{ item.required_points_for_entry_by1leg | number }}</td>
              <td>{{ item.required_points_for_entry_by2legs | number }}</td>
              <td>{{ item.required_points_for_entry_by3legs | number }}</td>
              <td>
                <div class="d-flex">
                  <vs-button
                    warn
                    @click="editStageRequirementSchedule(item)"
                    size="small"
                  >
                    <i class="bx bxs-edit"></i>
                    Edit
                  </vs-button>
                  <!-- <vs-button v-show="!role.reserved" danger @click="deleteRole(role)" size="small">
                  <i class="bx bxs-trash"></i>
                  Delete
                </vs-button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="stageRequirementSchedules.totalPages">
          <vs-pagination
            v-model="stageRequirementSchedules.page"
            :length="stageRequirementSchedules.totalPages"
            @input="getStageRequirementSchedules"
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
  name: "StageRequirementSchedules",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  data() {
    return {
      stageRequirementSchedules: {
        data: [],
        page: 1,
        totalPages: 1,
      },
      resourceModal: {
        show: false,
        loading: false,
      },
      stageRequirementSchedule: {
        id: null,
        stage_id: null,
        country_id: null,
        bonus_on_direct_purchase: null,
        subsequent_bonus_on_direct_purchase: null,
        referral_upgrade_bonus_on_direct_purchase: null,
        required_points_for_entry_by1leg: null,
        required_points_for_entry_by2legs: null,
        required_points_for_entry_by3legs: null,
      },
      countries: [],
      stages: [],
      search: "",
    };
  },
  async fetch() {
    await this.getStageRequirementSchedules();
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
    getStageRequirementSchedules: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.stageRequirementSchedules.page,
          "filter[search]": this.search,
        };
        const response =
          await this.$repositories.stageRequirementSchedules.index(params);
        this.stageRequirementSchedules.data = response.data;
        this.stageRequirementSchedules.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
    async save() {
      this.resourceModal.loading = true;

      try {
        // const response = await this.$axios.post('security/roles/save', _.clone(this.role));
        if (this.stageRequirementSchedule.id === null) {
          const response = await this.$repositories.stageRequirementSchedules.create(_.clone(this.stageRequirementSchedule));
        }else{
          const response = await this.$repositories.stageRequirementSchedules.update(this.stageRequirementSchedule.id, _.clone(this.stageRequirementSchedule));
        }

        this.$vs.notification({
          title: "Success",
          text: "Stage requirement schedule was saved.",
          color: "success",
          position: "top-center",
        });

        if (this.stageRequirementSchedule.id === null) {
          this.stageRequirementSchedules.push(response.data);
        } else {
          let index = this.stageRequirementSchedules.findIndex(
            (item) => item.id === response.data.id
          );

          if(index >= 0){
            this.stageRequirementSchedules[index] = response.data;
          }
        }
      } catch (e) {}

      this.resourceModal.loading = false;
      this.resourceModal.show = false;
    },
    reset() {
      this.stageRequirementSchedule = {
        id: null,
        stage_id: null,
        country_id: null,
        bonus_on_direct_purchase: null,
        subsequent_bonus_on_direct_purchase: null,
        required_points_for_entry_by1leg: null,
        required_points_for_entry_by2legs: null,
        required_points_for_entry_by3legs: null,
      };
    },
    newRole() {
      this.reset();
      this.resourceModal.show = true;
    },
    editStageRequirementSchedule(stageRequirementSchedule) {
      this.stageRequirementSchedule = stageRequirementSchedule;
      this.resourceModal.show = true;
    },
    // async deleteRole(role){
    //   if (!confirm('Are you sure?')) return;

    //   await this.$doTask(async () => {
    //     await this.$axios.post('security/roles/delete', {
    //       id: role.id,
    //     });

    //     this.roles = _.filter(this.roles, (r) => {
    //       return role.id !== r.id;
    //     });

    //   }, 'Deleting...');
    // },

    async getAvailableUsers(search) {
      let response = await this.$axios.get("/security/users/staffs", {
        params: {
          page: this.availableUsers.page,
          search,
        },
      });
      this.availableUsers.data = response.data.data;
      this.availableUsers.totalPages = response.data.last_page;
    },
  },
};
</script>

<style scoped></style>
