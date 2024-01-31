<template>
  <div class="card card-body" ref="sponsorship-bonuses">
    <h5 class="card-subtitle">Sponsorship Bonuses</h5>

    <div class="table-responsive" style="height: 350px; overflow-y: auto">
      <table class="table table-condensed table-hover">
        <thead>
        <tr>
          <th>#</th>
          <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(bonus, index) in sponsorsBonuses" :key="index">
          <td>Sponsor - {{bonus.serial_number}}</td>
          <td>
            <a href="#" data-name="bonus"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="bonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/sponsors-bonuses/update'"
               data-title="Bonus:">
              {{bonus.bonus | number}}
            </a>
          </td>

        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "SponsorshipBonusesList",
  props: {
    country: Object
  },
  data: () => ({
    sponsorsBonuses: []
  }),
  methods: {
    async getSponsorsBonuses(){
      this.sponsorsBonuses = this.country.sponsor_bonuses;
    }

  },
  mounted() {
    this.getSponsorsBonuses();
    this.$initXEditable();
  },
  watch: {
  },
  computed: {
    API_URL(){
      return this.$config.apiRoot;
    }
  }
}
</script>

<style scoped>

</style>
