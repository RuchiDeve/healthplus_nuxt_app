<template>

  <div class="row">
    <div class="col-12">
      <div class="card card-body">
        <div class="row" ref="members-list-section">
          <div class="col-12">
            <div class="d-flex mb-3 justify-content-between">
              <div>
                <h5 class="card-title mb-0">
                  Members
                  <span class="font-weight-bold" v-show="total_records">({{total_records}})</span>
                </h5>
                <p>{{caption}}</p>
              </div>
              <div>
                <vs-select color="dark" v-model="filter">
                  <vs-option label="All Members" value="all">
                    All
                  </vs-option>
                  <vs-option label="Inactive" value="inactive">
                    Inactive
                  </vs-option>
                  <vs-option label="Pending" value="pending">
                    Pending
                  </vs-option>
                  <vs-option label="Active" value="active ">
                    Active
                  </vs-option>

                  <vs-option label="Registered Today" value="registeredToday">
                    Registered Today
                  </vs-option>
                </vs-select>
              </div>
            </div>
            <div class="table-responsive" style="height: 350px; overflow-y: auto">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Names</th>
                  <th>Up-Line</th>
                  <th>Sponsor</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr :class="{'text-danger': member.status === 'inactive',
                'text-warning': member.status === 'pending',
                'text-muted': member.status === 'muted'}"
                  v-for="(member, index) in members" :key="index">
                  <td>{{index + 1}}</td>
                  <td>
                    <vs-avatar circle dark size="40">
                      <template #text v-if="!member.avatar">
                        {{ member.full_name }}
                      </template>

                      <img :src="$backendFiles(member.avatar)" v-if="member.avatar" alt="">
                    </vs-avatar>
                  </td>
                  <td>
                    <span class="font-weight-semibold">{{member.full_name}}</span>
                    <br>
                    <span>{{member.user.username}}</span>
                  </td>
                  <td>
                    <div v-if="member.sponsor_member">
                      {{member.sponsor_member.full_name}} / <br>
                      {{member.sponsor_member.user.username}}
                    </div>
                  </td>
                  <td>
                    <div v-if="member.up_line_member">
                      {{member.up_line_member.full_name}} / <br>
                      {{member.up_line_member.user.username}}
                    </div>
                  </td>
                  <td>
                    <vs-button blank @click="$router.push('/members/' + member.user.username + '/details')">
                      <i class="bx bx-show"></i>
                      view dashboard
                    </vs-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-4 d-flex" v-if="totalPages">
              <vs-pagination only-arrows v-model="page" :length="totalPages" />
              <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }}</b> of {{totalPages}}
                  </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: "MembersInfo",
  data(){
    return {
      page: 1,
      members: [],
      totalPages: null,
      total_records: 0,
      pagination: null,
      filter: 'all',
      caption: ''
    }
  },
  methods:{
    async getMembersList(){
      await this.$doTask(async ()=>{
        this.totalPages = 0;
        let filterValue = this.filter === "all" ? "" : this.filter.trim();

        const response = await this.$axios.$get('members', {
          params : {
            page: this.page,
            filter: filterValue === "all" ? "" : filterValue.trim(),
          }
        });

        this.members = response.data;
        this.totalPages = response.last_page;
        this.total_records = response.total;

      }, 'Fetching members...', this.$refs['members-list-section']);
    },
    generateCaption(){
      switch (this.filter){
        case 'active ':
          this.caption = "Showing ACTIVE members";
          break;
        case 'in_active':
          this.caption = "Showing IN-ACTIVE members only";
          break;
        case 'pending':
          this.caption = "Showing PENDING members only";
          break;
        case 'registered-today':
          this.caption = "Showing all members registered today";
          break;
       default:
          this.caption = "Showing ALL members";
          break;
      }
    }
  },
  async mounted() {
    this.generateCaption();
    this.getMembersList();
  },
  watch:{
    page: async function (_, __){
      await this.$store.commit('members/setPageNumbers', this.page);

      await this.getMembersList();
    },
    filter(filter, __){
      this.generateCaption();
      this.getMembersList();
    }
  }
}
</script>

<style scoped>

</style>
