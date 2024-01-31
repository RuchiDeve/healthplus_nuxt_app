<template>

  <div class="row" ref="members-list">
    <div class="col-12">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between mt-5 mb-3">
            <h4 class="display-4">Text Messagaes</h4>
            <new-text-message></new-text-message>
          </div>

          <div class="row" style="overflow-x: auto; min-height: 150px;" ref="member-wallet-stat">
            <div class="col-lg-3">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="wrapper">
                      <p class="card-text mb-0 text-center text-info" style="white-space: nowrap">Sms Balance</p>
                      <div class="fluid-container">
                        <h3 class="card-title text-center mb-0">{{0 | number}}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="card card-body">
            <div class="table-responsive">
              <table class="table table-hover table-condensed" style="table-layout: initial">
                <thead class="">
                <tr>
                  <th style="width: 5px;"></th>
                  <th>Recipients</th>
                  <th>Message</th>
                </tr>
                </thead>
                <tbody>
                <tr style="cursor: pointer"
                    v-for="(message, index) in textMessages">
                  <td>{{index + 1}}</td>
                  <td>
                    <span class="font-weight-semibold">{{message.recipients}}</span>
                  </td>
                  <td>
                    <span>{{message.message}}</span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="col-12 mt-4" v-if="textMessages.length">
      <vs-pagination v-model="page" :length="totalPages" />
    </div>
  </div>



</template>

<script>
import _ from 'lodash';
import NewTextMessage from "~/components/NewTextMessage";

export default {
  name: "sms",
  components: {NewTextMessage},
  layout: "app",
  data(){
    return {
      page: 1,
      showSearchDialog: false,
      textMessages: [],
      totalPages: 1,
    }
  },
  methods: {
    async getTextMessages(){
      await this.$doTask(async ()=>{
        const response = await this.$axios.$get('sms', {
          params: {
            page: this.page,
          }
        });
        this.textMessages = response.data;
        this.totalPages = response.last_page;
        console.log('messages', data);
      }, 'Loading text messages...');
    },
  },
  watch: {
    page(){
      this.textMessages();
    }
  },
  mounted() {
    this.getTextMessages();
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>


</style>
