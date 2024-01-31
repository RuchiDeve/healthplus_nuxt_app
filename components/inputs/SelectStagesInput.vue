<template>
  <vs-select block v-if="$store.state.stages.length"
             placeholder="Select a stage..."
             :disabled="loading" v-model="selectedStageId">
    <vs-option
      label="Select a stage..."
      :value="-1">
      Select a stage...
    </vs-option>
    <vs-option
      :key="index"
      :label="stage.name"
      v-for="(stage, index) in $store.state.stages"
      :value="stage.id">
      {{ stage.name }}
    </vs-option>
  </vs-select>
</template>

<script>
export default {
  name: "SelectStagesInput",
  data(){
    return {
      loading: false,
      selectedStageId: -1,
    }
  },
  props: {
    value: {
      required: false,
      default: null
    }
  },
  methods: {
    async loadStages(){
      this.loading = true;
      await this.$store.dispatch('fetchStages');
      this.loading = false;
    }
  },
  async mounted() {
    await this.loadStages();
    if (this.value !== null){
      this.selectedStageId = this.value.id;
    }
  },
  computed: {
    selectedStage(){
      if (this.selectedStageId === -1) return null;
      return this.$store.state.stages.find((stage) => stage.id === this.selectedStageId);
    }
  },
  watch: {
    selectedStageId(_, __){
      this.$emit('input', this.selectedStage)
    },
    value(val, __){
      if (val === null){
        this.selectedStageId = -1;
      }
    }
  }
}
</script>

<style scoped>

</style>
