<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Roles</h4>
        <div>
          <button class="btn btn-primary" @click="newRole">
            <i class="bx bxs-plus-circle"></i>
            Add Role
          </button>
          <vs-dialog blur :loading="roleModal.loading" v-model="roleModal.show"
                     @close="roleModal.show = false">
            <template #header>
              <h4 class="not-margin">
                <b>{{role.id ? 'Edit' : 'Add'}}</b> Role
              </h4>
            </template>

            <div class="con-form mt-3">
              <div class="form-group mb-1">
                <vs-input block label="Name" v-model="role.name"></vs-input>
              </div>

            </div>

            <template #footer>
              <div class="footer-dialog">
                <vs-button @click="save" :loading="roleModal.loading"
                           :active-disabled="roleModal.loading" block>
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
            <th>Role</th>
            <th>Total Permissions</th>
            <th>Total Assignees</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(role, index) in roles.data" :key="index">
            <td>{{index + 1}}</td>
            <td>{{role.label}}</td>
            <td>{{role.permissions_count | number}}</td>
            <td>{{role.total_users | number}}</td>
            <td>
              <div class="d-flex">
                <vs-button primary @click="managePermissions(role)" size="small">
                  <i class="bx bxs-checkbox-checked"></i>
                  Permissions
                </vs-button>
                <vs-button dark @click="manageStaffsPermissions(role)" size="small">
                  <i class="bx bxs-checkbox-checked"></i>
                  Assigned Staffs
                </vs-button>
                <vs-button warn v-show="!role.reserved" @click="editRole(role)" size="small">
                  <i class="bx bxs-edit"></i>
                  Edit
                </vs-button>
                <vs-button v-show="!role.reserved" danger @click="deleteRole(role)" size="small">
                  <i class="bx bxs-trash"></i>
                  Delete
                </vs-button>
                <vs-dialog blur :loading="permissionsModal.loading" v-model="permissionsModal.show"
                           auto-width scroll
                           @close="closePermissionModal">
                  <template #header>
                    <h4 class="not-margin">
                      Manage <span class="font-weight-bold"
                                   v-if="selectedRole.role">{{selectedRole.role.label}}</span>
                      Permissions
                    </h4>
                  </template>

                  <div class="con-form mt-3"
                       style="min-height: 100px; min-width: 500px;" ref="all-permissions">
                    <div class="card card-body p-2">
                      <div class="" v-for="(permissions, tag) in allPermissions" :key="tag">
                        <h5>{{tag}}</h5>
                        <div class="d-flex">
                          <div class="d-flex align-items-center"
                               v-for="(permission, index) in permissions" :key="permission.name">
                            <vs-checkbox :val="permission.name" v-model="permissionsModal.selectedPermissions">
                              {{permission.label}}
                            </vs-checkbox>
                          </div>
                        </div>
                      </div>

                    </div>


                  </div>

                  <template #footer>
                    <div class="footer-dialog">
                      <vs-button @click="updatePermissions" :loading="permissionsModal.loading"
                                 success
                                 :active-disabled="permissionsModal.loading" block>
                        Save Permissions
                      </vs-button>
                    </div>
                  </template>

                </vs-dialog>

                <vs-dialog blur :loading="roleStaffsModal.loading" v-model="roleStaffsModal.show"
                           overflow-hidden full-screen auto-width
                           @close="closeStaffPermissionsModal">
                  <template #header>
                    <h4 class="not-margin">
                      Manage <span class="font-weight-bold"
                                   v-if="selectedRole.role">{{selectedRole.role.label}}</span>
                      Assignees
                    </h4>
                  </template>

                  <div class="con-form mt-3" >
                    <div class="row">
                      <div class="col-sm-4">
                        <div class="card card-body">
                          <h5 class="card-title">Assigned Users</h5>
                          <p class="text-warning" v-show="!selectedRole.users.data.length">No users assigned here</p>
                          <div class=""
                               v-for="(user, index) in selectedRole.users.data" :key="user.id">
                            <vs-checkbox :val="user.id" v-model="roleStaffsModal.selectedStaffUsers">
                              {{user.username}}
                            </vs-checkbox>
                          </div>

                        </div>

                        <div class="pt-4" v-if="selectedRole.users.totalPages">
                          <vs-pagination v-model="selectedRole.users.page" :length="selectedRole.users.totalPages" />
                        </div>
                      </div>

                      <div class="col-sm-8">
                        <div class="card card-body">
                          <h5 class="card-title">Available Users</h5>
                          <p class="text-warning" v-show="!availableUsers.data.length">No users available here</p>
                          <div style="max-height: 310px; overflow-y: auto;">
                            <div class="" v-for="(user, index) in availableUsers.data" :key="user.id">
                              <vs-checkbox :val="user.id" v-model="roleStaffsModal.selectedStaffUsers">
                                {{user.username}}
                              </vs-checkbox>
                            </div>
                          </div>

                        </div>

                        <div class="pt-4" v-if="availableUsers.totalPages">
                          <vs-pagination v-model="availableUsers.page" :length="availableUsers.totalPages" />
                        </div>
                      </div>
                    </div>

                  </div>

                  <template #footer>
                    <div class="footer-dialog">
                      <vs-button @click="updateRoleAssignees" :loading="roleStaffsModal.loading"
                                 success
                                 :active-disabled="roleStaffsModal.loading" block>
                        Submit
                      </vs-button>
                    </div>
                  </template>

                </vs-dialog>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="roles.totalPages">
          <vs-pagination v-model="roles.page" :length="roles.totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helpers from "@/utils/helpers";
import {Permissions} from "@/utils/permissions";
import _ from "lodash";

export default {
  name: "roles",
  layout: "app",
  middleware(){
    Helpers.authorize(Permissions.ViewRoles)
  },
  data(){
    return {
      roles: {
        data: [],
        page: 1,
        totalPages: 1,
      },
      roleModal: {
        show: false,
        loading: false,
      },
      role: {
        id: null,
        name: null,
      },
      permissionsModal: {
        show: false,
        loading: false,
        selectedPermissions: []
      },
      roleStaffsModal: {
        show: false,
        loading: false,
        selectedStaffUsers: [],
      },
      selectedRole: {
        role: null,
        permissions: [],
        users: {
          data: [],
          page: 1,
          totalPages: 1
        },
      },
      availableUsers: {
        data: [],
        page: 1,
        totalPages: 1
      }
    }
  },
  async fetch(){
    await this.getRoles();
    await this.getAvailableUsers();
  },
  methods: {
    async getRoles(){
      await this.$doTask(async ()=> {
        const response = await this.$axios.get('security/roles', {
          params: {
            page: this.roles.page,
          }
        });
        this.roles.data = response.data.data;
        this.roles.totalPages = response.data.last_page;
      }, 'Loading...');
    },
    async save(){
      this.roleModal.loading = true;

      try {
        const response = await this.$axios.post('security/roles/save', _.clone(this.role));

        this.$vs.notification({
          title: 'Success',
          text: 'Role was saved.',
          color: 'success',
          position: 'top-center'
        });

        if (!this.role.id)
          this.roles.push(response.data);
      } catch (e){

      }

      this.roleModal.loading = false;
      this.roleModal.show = false;
    },
    reset(){
      this.role = {
        id: null,
        name: null,
      }
    },
    newRole(){
      this.reset();
      this.roleModal.show = true;
    },
    editRole(role){
      this.role = role;
      this.role.name = role.label;
      this.roleModal.show = true;
    },
    async deleteRole(role){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        await this.$axios.post('security/roles/delete', {
          id: role.id,
        });

        this.roles = _.filter(this.roles, (r) => {
          return role.id !== r.id;
        });

      }, 'Deleting...');
    },
    async getRolePermissions(role){
      let response = await this.$axios.get('security/roles/'+role.id+'/permissions');
      this.selectedRole.permissions = response.data;
    },
    async getRoleUsers(role){
      let response = await this.$axios.get('security/roles/'+role.id+'/users');
      this.selectedRole.users.data = response.data;
    },
    async managePermissions(role){
      this.permissionsModal.loading = true;
      this.permissionsModal.show = true;
      this.selectedRole.role = role;
      await this.$store.dispatch('fetchPermissionsList');
      await this.getRolePermissions(role);
      this.loadSelectedPermissions();
      this.permissionsModal.loading = false;
    },
    async manageStaffsPermissions(role){
      this.roleStaffsModal.loading = true;
      this.roleStaffsModal.show = true;
      this.selectedRole.role = role;
      await this.getRoleUsers(role);
      this.loadSelectedRoleUsers();
      this.roleStaffsModal.loading = false;
    },
    loadSelectedPermissions(){
      this.selectedRole.permissions.forEach((permission) => {
        this.permissionsModal.selectedPermissions.push(permission.name);
      })
    },
    loadSelectedRoleUsers(){
      this.selectedRole.users.data.forEach((user) => {
        this.roleStaffsModal.selectedStaffUsers.push(user.id);
      });
    },
    closePermissionModal(){
      this.permissionsModal.selectedPermissions = [];
      this.permissionsModal.show = false;
    },
    closeStaffPermissionsModal(){
      this.roleStaffsModal.selectedStaffUsers = [];
      this.roleStaffsModal.show = false;
    },
    async updatePermissions(){
      this.permissionsModal.loading = true;

      const permissions = [];
      this.permissionsModal.selectedPermissions.forEach(p => {
        permissions.push(p);
      });

      let response = await this.$axios.post('security/roles/update/permissions', {
        permissions: permissions,
        role_id: this.selectedRole.role.id,
      });

      let index = _.findIndex(this.roles.data, r => r.id === response.data.id);
      this.roles.data[index] = response.data;

      this.closePermissionModal();
    },
    async updateRoleAssignees(){
      this.roleStaffsModal.loading = true;

      const users = [];
      this.roleStaffsModal.selectedStaffUsers.forEach(u => {
        users.push(u);
      });

      console.log('users', users);

      let response = await this.$axios.post('security/roles/update/users', {
        'users': users,
        'role_id': this.selectedRole.role.id,
      });

      let index = _.findIndex(this.roles.data, r => r.id === response.data.id);
      this.roles.data[index] = response.data;

      this.closeStaffPermissionsModal();
    },
    async getAvailableUsers(search){
      let response = await this.$axios.get('/security/users/staffs', {
        params: {
          page: this.availableUsers.page,
          search,
        }
      });
      this.availableUsers.data = response.data.data;
      this.availableUsers.totalPages = response.data.last_page;
    }
  },
  computed: {
    allPermissions(){
      return this.$store.state.permissionsList;
    },
    staffUsers(){
      return this.$store.state.staffUsers;
    }
  }
}
</script>

<style scoped>

</style>
