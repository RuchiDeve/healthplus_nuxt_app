<template>

  <div class="row">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12">
          <h3 class="card-title">Expense Data</h3>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12 grid-margin">
          <div class="card card-body">
            <h5 class="card-subtitle mb-3">Expense Spreadsheet</h5>
            <div class="row d-flex justify-content-between">
              <div class="col-lg-5 border-left-lg">
                <div class="row">
                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">CPt:</p>
                    <h5 class="p-0 m-0">
                      {{points | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">PRO:</p>
                    <h5 class="p-0 m-0">
                      {{points * 1110 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Coordinator:</p>
                    <h5 class="p-0 m-0">
                      {{points * 90 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Comm:</p>
                    <h5 class="p-0 m-0">
                      {{points * 120 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Stalk Bonus:</p>
                    <h5 class="p-0 m-0">
                      {{points * 444 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">SP Bonus:</p>
                    <h5 class="p-0 m-0">
                      {{points * 2058 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Leadership Bonus:</p>
                    <h5 class="p-0 m-0">
                      {{points * 360 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Shop Bonus:</p>
                    <h5 class="p-0 m-0">
                      {{points * 660 | number}}
                    </h5>
                  </div>

                </div>
              </div>
              <div class="col-lg-5 border-right-lg">
                <div class="row">

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Dirs:</p>
                    <h5 class="p-0 m-0">
                      {{points * 600 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">MB:</p>
                    <h5 class="p-0 m-0">
                      {{points * 540 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Incentives:</p>
                    <h5 class="p-0 m-0">
                      {{points * 2880 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">PR & Ads:</p>
                    <h5 class="p-0 m-0">
                      {{points * 360 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Royalty:</p>
                    <h5 class="p-0 m-0">
                      {{points * 180 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Payouts:</p>
                    <h5 class="p-0 m-0">
                      {{points * 4980 | number}}
                    </h5>
                  </div>

                  <div class="col-12 grid-margin d-flex justify-content-between">
                    <p class="pb-0 mb-0 font-weight-bolder">Products:</p>
                    <h5 class="p-0 m-0">
                      {{points * 3618 | number}}
                    </h5>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="col-lg-4 grid-margin">
          <div class="card card-body bg-transparent">
            <h5 class="card-subtitle">Income from Registrations</h5>

            <div class="row">
              <div class="col-12 grid-margin d-flex justify-content-between">
                <p class="pb-0 mb-0 font-weight-bolder">Registration Fee:</p>
                <h5 class="p-0 m-0">
                  {{1500 | number}} / CPts
                </h5>
              </div>

              <div class="col-12 grid-margin d-flex justify-content-between">
                <p class="pb-0 mb-0 font-weight-bolder">Registered Members:</p>
                <h5 class="p-0 m-0">
                  {{membersCount | number}}
                </h5>
              </div>

              <div class="col-12 grid-margin d-flex justify-content-between">
                <p class="pb-0 mb-0 font-weight-bolder">Registration Bonus:</p>
                <h5 class="p-0 m-0">
                  {{membersCount * 1500 | number}}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "ExpenseSheet",
  layout: "app",
  data: () => ({
    points: 0,
    membersCount: 0,
  }),
  methods: {
    async getExpenseData(){
      await this.$doTask(async () => {
        let response = await this.$axios.get('app/data/expense-sheet');
        console.log('data', response.data);
        this.membersCount = response.data.totalMembersAfterMigration;
        this.points = response.data.totalPointsAfterMigration;
      }, 'Loading data...');
    }
  },
  mounted() {
    this.getExpenseData();
  }
}
</script>

<style scoped>

</style>
