<template>
  <div class="card card-body" ref="stage-bonuses-requirements">
    <h5 class="card-subtitle">Stage Bonuses and requirements</h5>

    <div class="table-responsive" style="height: 350px; overflow-y: auto">
      <table class="table table-condensed table-hover">
        <thead>
        <tr>
          <th></th>
          <th>Stage</th>
          <th>Direct Purchase Bonus</th>
          <th>Req. Points on 1-Leg</th>
          <th>Req. Points on 2-Legs</th>
          <th>Req. Points on 3-Legs</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(stageBonus, index) in stageBonuses" :key="index">
          <td>{{index + 1}}</td>
          <td>
            {{stageBonus.stage.name}}
          </td>
          <td>
            <a href="#" data-name="bonus_on_direct_purchase"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="stageBonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/stage-requirements/update'"
               data-title="Direct purchase bonus:">
              {{stageBonus.bonus_on_direct_purchase | number}}
            </a>
          </td>
          <td>
            <a href="#" data-name="required_points_for_entry_by1leg"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="stageBonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/stage-requirements/update'"
               data-title="Required points for 1-Leg:">
              {{stageBonus.required_points_for_entry_by1leg | number}}
            </a>
          </td>
          <td>
            <a href="#" data-name="required_points_for_entry_by2legs"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="stageBonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/stage-requirements/update'"
               data-title="Required points for 2-Legs:">
              {{stageBonus.required_points_for_entry_by2legs | number}}
            </a>
          </td>
          <td>
            <a href="#" data-name="required_points_for_entry_by3legs"
               class="as-editable text-dark"
               data-type="text"
               :data-pk="stageBonus.id"
               :data-url="API_URL + '/countries/' + country.id + '/stage-requirements/update'"
               data-title="Required Points for 3-Legs:">
              {{stageBonus.required_points_for_entry_by3legs | number}}
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
  name: "StageBonusesList",
  props: {
    country: Object
  },
  data: () => ({
    stageBonuses: []
  }),
  methods: {
    async getStageBonuses(){
      this.stageBonuses = this.country.stage_requirements;
    }

  },
  mounted() {
    this.getStageBonuses();
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
