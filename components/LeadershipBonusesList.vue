<template>
  <div class="card card-body" ref="stage-bonuses-requirements">
    <h5 class="card-subtitle">Leadership Bonuses</h5>

    <div class="table-responsive" style="height: 350px; overflow-y: auto">
      <table class="table table-condensed table-hover">
        <thead>
        <tr>
          <th></th>
          <th>Stage</th>
          <th>Min Legs</th>
          <th>Percent per CPt</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(bonus, index) in leadershipBonuses" :key="index">
          <td>{{index + 1}}</td>
          <td>
            {{bonus.stage.name}}
          </td>
          <td>
            <a href="#" data-name="min_legs"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="bonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/leadership-bonus/update'"
               data-title="Min. Legs:">
              {{bonus.min_legs | number}}
            </a>
          </td>
          <td>
            <a href="#" data-name="percent_per_point"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="bonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/leadership-bonus/update'"
               data-title="Perent per CPts:">
              {{bonus.percent_per_point | number}}
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
  name: "LeadershipBonusesList",
  props: {
    country: Object
  },
  data: () => ({
    leadershipBonuses: []
  }),
  methods: {
    async getLeadershipBonuses(){
      this.leadershipBonuses = this.country.leadership_bonuses;
    }

  },
  mounted() {
    this.getLeadershipBonuses();
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
