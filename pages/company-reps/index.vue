<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-12 col-lg-6">
          <h4 class="display-4">Company Reps</h4>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row">
            <div class="col-12 col-lg-6">
              <vs-input
                icon-after
                block
                type="search"
                v-model="search"
                @input="getCompanyReps"
              >
                <template #icon>
                  <i class="bx bx-search"></i>
                </template>
              </vs-input>
            </div>
            <div class="col-12 col-lg-6">
              <button class="btn btn-primary" @click="createResource">
                <i class="bx bxs-plus-circle"></i>
                Add Company Rep
              </button>
              <vs-dialog
                blur
                :loading="resourceModal.loading"
                v-model="resourceModal.show"
                @close="resourceModal.show = false"
              >
                <template #header>
                  <h4 class="not-margin">
                    <b>{{ form.id ? "Edit" : "Add" }}</b> Company Rep
                  </h4>
                </template>

                <div class="con-form mt-3">
                  <div class="form-group mb-5">
                    <vs-input
                      block
                      type="search"
                      label="Enter member username"
                      v-model="username"
                      @input="findMember"
                    ></vs-input>

                    <member-info-card
                      :this-member="member"
                      v-if="member !== null"
                    ></member-info-card>
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
              <th>Member</th>
              <th>Code</th>
              <th>Amount per CPT</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in companyReps" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.member.user.username }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.amount_per_cpt | money }}</td>
              <td :class="item.active ? 'text-success' : 'text-danger'">
                {{ item.active ? "Active" : "Inactive" }}
              </td>
              <td>
                <div class="d-flex">
                  <vs-button warn @click="editResource(item, item.member.user.username)" size="small">
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
            @input="getCompanyReps"
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
import { async } from "q";

export default {
  name: "CompanyReps",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  data() {
    return {
      companyReps: [],
      page: 1,
      totalPages: 1,
      resourceModal: {
        show: false,
        loading: false,
      },
      form: {
        id: "",
        member_id: "",
        amount_per_cpt: 0,
        active: 0,
      },
      username: "",
      member: null,
      members: [],
      search: "",
    };
  },
  async fetch() {
    await this.getCompanyReps();
    await this.getMembers();
  },
  methods: {
    async getMembers() {
      await this.$doTask(async () => {
        const response = await this.$repositories.members.index();
        this.members = response.data;
      }, "Loading...");
    },
    findMember: _.debounce(async function () {
      await this.$doTask(async () => {
        if (this.username !== "") {
          let params = {
            "filter[username]": this.username
          }
          const response = await this.$repositories
            .companyRepMember
            .index(params);
          if (response.length > 0) {
            this.member = response[0];
            this.form.member_id = this.member.id;
          } else {
            this.$vs.notification({
              title: "No member with that username!",
              position: "top-right",
              color: "danger",
            });
          }
        } else {
          this.$vs.notification({
            title: "Enter member username!",
            position: "top-right",
            color: "danger",
          });
        }
      }, "Loading...");
    }, 500),
    getCompanyReps: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[search]": this.search,
        };
        const response = await this.$repositories.companyReps.index(params);
        this.companyReps = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
    async save() {
      this.resourceModal.loading = true;

      try {
        if (this.form.id === '') {
          const response = await this.$repositories.companyReps.create(
            _.clone(this.form)
          );
          this.getCompanyReps();
        } else {
          const response = await this.$repositories.companyReps.update(
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
          text: "Company rep was saved.",
          color: "success",
          position: "top-center",
        });
      } catch (e) {}

      this.resourceModal.loading = false;
      this.resourceModal.show = false;
    },
    reset() {
      this.username = ''
      this.member = null
      this.form = {
        id: "",
        member_id: "",
        amount_per_cpt: 0,
        active: 0,
      };
    },
    createResource() {
      this.reset();
      this.resourceModal.show = true;
    },
    editResource(resource, username) {
      this.form = resource;
      this.member = null;
      this.username = username;
      this.resourceModal.show = true;
    },
    async deactivate(resource) {
      let params = {
        active: false,
      };

      const response = await this.$repositories.companyReps.update(
        resource.id,
        params
      );
      this.getCompanyReps();
    },
    async activate(resource) {
      let params = {
        active: true,
      };

      const response = await this.$repositories.companyReps.update(
        resource.id,
        params
      );
      this.getCompanyReps();
    },
  },
};
</script>

<style scoped></style>
