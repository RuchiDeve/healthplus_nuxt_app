<template>
  <div class="row" v-if="member">
    <div class="col-12 noprint">
      <div class="card card-body bg-transparent">
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <div class="mr-2">
              <vs-avatar
                class="d-inline-block"
                :warn="member.is_pending"
                :danger="member.is_inactive"
                :dark="member.is_mute"
                :success="member.is_active"
                size="55"
                circle
              >
                <template #text v-if="!member.avatar">
                  {{ member.full_name }}
                </template>

                <img
                  :src="$backendFiles(member.avatar)"
                  v-if="member.avatar"
                  alt=""
                  style="height: 100%"
                />
              </vs-avatar>
            </div>
            <div>
              <h4 class="display-4 mb-0">
                {{ member.full_name }}
              </h4>
              <p class="mt-0 pt-0 font-weight-semibold">
                <span class="badge badge-dark">
                  {{ member.user.username }}
                </span>

                <span
                  v-if="member.is_inactive"
                  class="mdi mdi-18px mdi-cancel text-danger"
                ></span>
                <span
                  v-else-if="member.is_pending"
                  class="mdi mdi-18px mdi-bell-alert text-warning"
                ></span>
                <span
                  v-else-if="member.is_active"
                  class="mdi mdi-18px mdi-check-circle text-success"
                ></span>
                <span
                  v-else-if="member.is_mute"
                  class="mdi mdi-18px mdi-account-off text-muted"
                ></span>

                <span v-if="member.is_mute" class="text-gray">Muted</span>
                <span v-else-if="member.is_active" class="text-success"
                  >Active</span
                >
                <span v-else-if="member.is_pending" class="text-warning"
                  >Pending</span
                >
                <span v-else-if="member.is_inactive" class="text-danger"
                  >Inactive</span
                >
              </p>
            </div>
          </div>
          <div class="float-right" v-if="!$root.authMember">
            <vs-button icon dark border @click="$router.back()">
              <i class="bx bxs-chevrons-left"></i>
              Back
            </vs-button>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 noprint">
      <div class="row member-stats">
        <div class="col-12 grid-margin">
          <div class="row d-flex no-wrap flex-nowrap" style="overflow-x: auto">
            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div
                  class="card-body"
                  style="padding-top: 20px; padding-bottom: 20px"
                >
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-pin text-primary icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text no-wrap mb-0">Current Stage</p>
                      <div class="fluid-container">
                        <h3 class="card-title no-wrap mb-0 text-primary">
                          {{ member.stage.name }}
                        </h3>
                        <p class="font-weight-bold">
                          QL: {{ member.total_legs | number }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-shopping text-success icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Orders</p>
                      <div class="fluid-container">
                        <h3 class="card-title mb-0 no-wrap text-success">
                          {{ (member.orders_count || 0) | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-contactless-payment text-warning icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Pending MB Wallet</p>
                      <div class="fluid-container">
                        <h3 class="card-title mb-0 no-wrap text-warning">
                          {{ (member.pending_total_matching_bonuses || 0) | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i
                        class="mdi mdi-check-box-multiple-outline text-complete icon-lg"
                      ></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Points</p>
                      <div class="fluid-container">
                        <h3 class="card-title no-wrap mb-0 text-complete">
                          {{ member.points_sum_point | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-nature-people text-success icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Down-Lines</p>
                      <div class="fluid-container">
                        <h3 class="card-title mb-0 no-wrap text-success">
                          {{ member.total_down_lines | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-cash-refund text-info icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Withdrawals</p>
                      <div class="fluid-container">
                        <h3 class="card-title mb-0 no-wrap text-info">
                          {{ member.withdrawal_requests_count | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-cash-refund text-teal icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text no-wrap mb-0">Transaction Pin</p>
                      <div class="fluid-container">
                        <h3 class="mb-0 no-wrap text-teal">
                          {{ member.wallet_pin.trim() }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 noprint">
      <div class="row">
        <div class="col-md-7">
          <member-cash-flow-chart :height="223"></member-cash-flow-chart>
        </div>
        <div class="col-md-5">
          <div class="row">
            <div class="col-12 grid-margin">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title mb-0 text-success">Available Wallet</h4>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-inline-block pt-3">
                      <div class="d-flex">
                        <p class="mb-2 ml-1">
                          {{ member.domain.country.currency.symbol }}
                        </p>
                        <h2 class="mb-0">
                          {{ member.available_wallet_balance | number }}
                        </h2>
                      </div>
                      <small class="text-gray">
                        Amount available to you for withdrawal. This figure is
                        updated for every confirmed withdrawal.
                      </small>
                    </div>
                    <div class="d-inline-block">
                      <div class="bg-success px-4 py-2 rounded">
                        <i class="mdi mdi-wallet text-white icon-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 grid-margin">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title mb-0 text-warning">Deposit Wallet</h4>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-inline-block pt-3">
                      <div class="d-flex">
                        <p class="mb-2 ml-1">
                          {{ member.domain.country.currency.symbol }}
                        </p>
                        <h2 class="mb-0">
                          {{ member.deposit_wallet_balance | number }}
                        </h2>
                      </div>
                      <small class="text-gray"
                        >This cannot be withdrawn but can be used during
                        payment.</small
                      >
                    </div>
                    <div class="d-inline-block">
                      <div class="bg-warning px-4 py-2 rounded">
                        <i class="mdi mdi-wallet text-white icon-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 profile-page" ref="details" style="min-height: 400px">
      <div class="card card-body">
        <div class="profile-body pt-0">
          <ul
            class="nav tab-switch no-wrap flex-nowrap mb-3 noprint"
            style="overflow-x: auto"
            role="tablist"
          >
            <li class="nav-item mr-3" v-if="!$root.authMember">
              <vs-button icon dark @click="showAdminModal = true">
                <i class="ti-settings"></i>
              </vs-button>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                id="user-profile-info-tab"
                data-toggle="pill"
                href="#user-profile-info"
                role="tab"
                aria-controls="user-profile-info"
                aria-selected="true"
                >Profile</a
              >
            </li>
            <li class="nav-item" @click="loadOrders">
              <a
                class="nav-link"
                id="user-profile-orders-tab"
                data-toggle="pill"
                href="#user-profile-orders"
                role="tab"
                aria-controls="user-profile-orders"
                aria-selected="false"
                >Orders</a
              >
            </li>
            <li class="nav-item" @click="loadWithdrawals">
              <a
                class="nav-link"
                id="user-profile-withdrawals-tab"
                data-toggle="pill"
                href="#user-profile-withdrawals"
                role="tab"
                aria-controls="user-profile-withdrawals"
                aria-selected="false"
                >Withdrawals</a
              >
            </li>
            <li class="nav-item" @click="loadDeposits">
              <a
                class="nav-link"
                id="user-profile-deposits-tab"
                data-toggle="pill"
                href="#user-profile-deposits"
                role="tab"
                aria-controls="user-profile-deposits"
                aria-selected="false"
                >Deposits</a
              >
            </li>
            <li class="nav-item" @click="loadTransactions">
              <a
                class="nav-link"
                id="user-profile-transactions-tab"
                data-toggle="pill"
                href="#user-profile-transactions"
                role="tab"
                aria-controls="user-profile-transactions"
                aria-selected="false"
                >Transactions</a
              >
            </li>
            <li class="nav-item" @click="loadStageHistoryList">
              <a
                class="nav-link"
                id="user-profile-stage-history-tab"
                data-toggle="pill"
                href="#user-profile-stage-history"
                role="tab"
                aria-controls="user-profile-stage-history"
                aria-selected="false"
                >Stage History</a
              >
            </li>
            <li class="nav-item" @click="loadDownLines">
              <a
                class="nav-link"
                id="user-profile-downlines-tab"
                data-toggle="pill"
                href="#user-profile-downlines"
                role="tab"
                aria-controls="user-profile-downlines"
                aria-selected="false"
                >Down-Lines</a
              >
            </li>
            <li class="nav-item" @click="loadGenealogy">
              <a
                class="nav-link"
                id="user-profile-genealogy-tab"
                data-toggle="pill"
                href="#user-profile-genealogy"
                role="tab"
                aria-controls="user-profile-genealogy"
                aria-selected="false"
                >Genealogy</a
              >
            </li>
            <li class="nav-item" @click="loadIncentives">
              <a
                class="nav-link"
                id="user-profile-incentives-tab"
                data-toggle="pill"
                href="#user-profile-incentives"
                role="tab"
                aria-controls="user-profile-incentives"
                aria-selected="false"
                >Incentives</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="product-promotion-list-tab"
                data-toggle="pill"
                href="#product-promotion-list"
                role="tab"
                aria-controls="product-promotion-list"
                aria-selected="false"
              >
                Product Promotions
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="product-promotion-bonuses-tab"
                data-toggle="pill"
                href="#product-promotion-bonuses"
                role="tab"
                aria-controls="product-promotion-bonuses"
                aria-selected="false"
              >
                Product Promotion Bonuses
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="matching-bonuses-tab"
                data-toggle="pill"
                href="#matching-bonuses"
                role="tab"
                aria-controls="matching-bonuses"
                aria-selected="false"
              >
                Matching Bonuses
              </a>
            </li>
            <li class="nav-item" v-if="member.is_company_rep">
              <a
                class="nav-link"
                id="company-rep-bonuses-tab"
                data-toggle="pill"
                href="#company-rep-bonuses"
                role="tab"
                aria-controls="company-rep-bonuses"
                aria-selected="false"
              >
                Company Rep Bonuses
              </a>
            </li>
          </ul>

          <div class="tab-content tab-body">
            <div
              :class="[
                [
                  'user-profile-info',
                  'profile-pic',
                  'register-date',
                  'profile',
                  'bank-details',
                  'nok',
                  'membership',
                  'id-card',
                ].includes(printSection)
                  ? 'tab-pane fade pr-3 active show'
                  : 'tab-pane fade pr-3 active show noprint',
              ]"
              class=""
              id="user-profile-info"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="row d-flex">
                <div
                  class="col-md-auto col-sm-12 grid-margin grid-margin-md-0 d-sm-flex justify-content-start flex-column"
                >
                  <vs-avatar
                    :class="[
                      ['profile-pic'].includes(printSection)
                        ? 'position-relative member-profile-photo'
                        : 'position-relative member-profile-photo noprint',
                    ]"
                    :warn="member.pending"
                    :danger="member.inActive"
                    :dark="member.muted"
                    square
                    :success="member.active"
                    size="200"
                  >
                    <template #text v-if="!member.avatar">
                      {{ member.full_name }}
                    </template>

                    <img
                      :src="$backendFiles(member.avatar)"
                      v-if="member.avatar"
                      alt=""
                    />

                    <div class="position-absolute change-photo-btn" style="">
                      <vs-button
                        primary
                        size="small"
                        @click="profilePhotoModal.show = true"
                      >
                        <i class="bx bxs-image-add"></i>
                        edit photo
                      </vs-button>
                    </div>
                  </vs-avatar>

                  <vs-dialog
                    blur
                    v-model="profilePhotoModal.show"
                    @close="profilePhotoModal.show = false"
                  >
                    <template #header>
                      <h4 class="not-margin">Edit <b>Photo</b></h4>
                    </template>

                    <div class="con-form mt-3">
                      <div class="form-group">
                        <image-upload-input
                          v-model="profilePhotoModal.image"
                        ></image-upload-input>
                      </div>
                    </div>

                    <template #footer>
                      <div class="footer-dialog" v-if="profilePhotoModal.image">
                        <vs-button
                          @click="uploadPhoto"
                          :loading="profilePhotoModal.loading"
                          :active-disabled="profilePhotoModal.loading"
                          block
                        >
                          Submit
                        </vs-button>
                      </div>
                      <div class="text-danger">
                        Photo should be jpg, png, or jpeg with a max size of 1MB.
                      </div>
                    </template>
                  </vs-dialog>

                  <div
                    :class="[
                      ['register-date'].includes(printSection)
                        ? 'bg-light'
                        : 'bg-light noprint',
                    ]"
                  >
                    <p class="pb-0 mb-0">Registered on:</p>
                    <h5 class="p-0 m-0">
                      <a href="#" class="text-dark">
                        <span v-if="member.registered_at">{{
                          member.registered_at | date
                        }}</span>
                        <span v-else>-</span>
                      </a>
                    </h5>
                  </div>
                </div>
                <div class="col">
                  <div
                    :class="[
                      ['profile'].includes(printSection)
                        ? 'bg-light'
                        : 'bg-light noprint',
                    ]"
                  >
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Profile / KYC</h4>

                        <div class="row">
                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">First Name:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                id="first_name"
                                class="kyc first-name text-dark"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/profile'"
                                data-title="Enter: First Name"
                                :class="{
                                  'as-editable':
                                    ($root.authMember && member.inActive) ||
                                    !$root.authMember,
                                }"
                              >
                                {{ member.first_name }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Last Name:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                id="last_name"
                                class="kyc first-name text-dark"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/profile'"
                                :class="{
                                  'as-editable':
                                    ($root.authMember && member.inActive) ||
                                    !$root.authMember,
                                }"
                                data-title="Enter: Last Name"
                              >
                                {{ member.last_name }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Phone:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                id="phone"
                                class="kyc text-dark phone"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/profile'"
                                :class="{
                                  'as-editable':
                                    ($root.authMember && member.inActive) ||
                                    !$root.authMember,
                                }"
                                data-title="Enter: Phone"
                              >
                                {{ member.phone }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-5 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Branch/Country</p>
                            <h5 class="p-0 m-0" style="white-space: nowrap">
                              <span>
                                {{ member.branch.name }}
                              </span>
                              /
                              <span class="font-weight-semibold">
                                {{ member.domain.country.name }}
                              </span>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    :class="[
                      ['bank-details'].includes(printSection) ? '' : 'noprint',
                    ]"
                    v-if="member.bank_details"
                  >
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Bank Details</h4>

                        <div class="row flex-wrap">
                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Bank Name:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="bank_name"
                                :class="[
                                  ($root.authMember && member.is_inactive) ||
                                  !$root.authMember
                                    ? 'as-editable bank-details bank-name text-dark'
                                    : 'bank-details bank-name text-dark',
                                ]"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="
                                  API_URL + '/members/update/bank-details'
                                "
                                data-title="Enter: Bank Name."
                              >
                                {{ member.bank_details.bank_name }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Account Number:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="bank_account_number"
                                :class="[
                                  ($root.authMember && member.is_inactive) ||
                                  !$root.authMember
                                    ? 'as-editable bank-details ac-number text-dark'
                                    : 'bank-details ac-number text-dark',
                                ]"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="
                                  API_URL + '/members/update/bank-details'
                                "
                                data-title="Enter: Account Number"
                              >
                                {{ member.bank_details.bank_account_number }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Account Holder Name:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="account_holder_name"
                                class="text-dark bank-details account-holder-name"
                                :class="[
                                  ($root.authMember && member.is_inactive) ||
                                  !$root.authMember
                                    ? 'as-editable bank-details account-holder-name text-dark'
                                    : 'bank-details account-holder-name text-dark',
                                ]"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="
                                  API_URL + '/members/update/bank-details'
                                "
                                data-title="Enter: Account Holder Name"
                              >
                                {{ member.bank_details.account_holder_name }}
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    :class="[
                      ['nok'].includes(printSection)
                        ? 'bg-light'
                        : 'bg-light noprint',
                    ]"
                    v-if="member.next_of_kin"
                  >
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Next of Kin</h4>

                        <div class="row flex-wrap">
                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Name:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="name"
                                class="as-editable text-dark nok"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/nok'"
                                data-title="Enter: Next of Kin Name."
                              >
                                {{ member.next_of_kin.name }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Phone:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="phone"
                                class="as-editable text-dark nok"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/nok'"
                                data-title="Enter: Next of Kin Phone."
                              >
                                {{ member.next_of_kin.phone }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Email:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="email"
                                class="as-editable text-dark nok"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/nok'"
                                data-title="Enter: Next of Kin Email."
                              >
                                {{ member.next_of_kin.email }}
                              </a>
                            </h5>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Address:</p>
                            <h5 class="p-0 m-0">
                              <a
                                href="#"
                                data-name="address"
                                class="as-editable text-dark nok"
                                data-type="text"
                                :data-pk="member.id"
                                :data-url="API_URL + '/members/update/nok'"
                                data-title="Enter: Next of Kin Address."
                              >
                                {{ member.next_of_kin.address }}
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    :class="[
                      ['membership'].includes(printSection) ? '' : 'noprint',
                    ]"
                  >
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Membership</h4>

                        <div class="row flex-wrap">
                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Up Line:</p>
                            <member-info-card
                              :this-member="member.up_line_member"
                            ></member-info-card>
                            <change-upline-button
                              v-show="!$root.authMember"
                              :this-member="member"
                            ></change-upline-button>
                          </div>

                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <p class="pb-0 mb-0">Sponsor:</p>
                            <member-info-card
                              :this-member="member.sponsor_member"
                            ></member-info-card>
                            <change-sponsor-button
                              v-show="!$root.authMember || member.is_inactive"
                              :this-member="member"
                            ></change-sponsor-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-light">
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Referral Link</h4>

                        <div class="row flex-wrap">
                          <div
                            class="col-sm-6 col-md grid-margin grid-margin-md-0"
                          >
                            <h5 class="p-0 m-0">
                              <button
                                class="btn btn-link"
                                v-if="member.is_active"
                                title="Copy to clipboard"
                                @click="copyToClipboard"
                              >
                                {{ referralLink }}

                                <i class="fa fa-clipboard"></i>
                              </button>
                              <p class="text-danger" v-else>
                                Activate your account to get your referral link
                              </p>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    :class="[
                      ['id-card'].includes(printSection)
                        ? 'bg-light'
                        : 'bg-light noprint',
                    ]"
                  >
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title noprint">Id Card</h4>

                        <div class="row" v-if="member.avatar">
                          <div class="col-12 grid-margin grid-margin-md-0">
                            <div class="row mb-2">
                              <div class="col-12 noprint">Front</div>
                              <div class="col-12">
                                <div
                                  class="card"
                                  style="height: 480px; width: 640px"
                                >
                                  <div class="card-body">
                                    <img
                                      src="images/dlt-logo.jpeg"
                                      class="img-lg rounded-circle"
                                      alt=""
                                    />
                                    <span
                                      class="card-title display-4 font-weight-bold"
                                      >DLT Health Plus. Member E-Card</span
                                    >

                                    <div class="row">
                                      <div class="col-4">
                                        <div class="card-text py-3">
                                          <img
                                            :src="$backendFiles(member.avatar)"
                                            class="thumbnail"
                                            style="width: 200px; height: 200px"
                                          />
                                        </div>
                                      </div>
                                      <div class="col-7 ml-3">
                                        <p class="card-text display-4 mt-4">
                                          <strong>Name: </strong>
                                          {{ member.full_name }}
                                        </p>
                                        <p class="card-text display-4">
                                          <strong>Username: </strong>
                                          {{ member.user.username }}
                                        </p>
                                        <p class="card-text display-4">
                                          <strong>Id No: </strong>
                                          {{ member.user.id }}
                                        </p>
                                        <p class="card-text display-4">
                                          <strong>Referral Link: </strong>
                                          {{ referralLink }}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 py-3 noprint">
                                <button
                                  class="btn btn-primary"
                                  @click="printId"
                                >
                                  Print
                                </button>
                              </div>
                            </div>
                          </div>

                          <div class="col-12 grid-margin grid-margin-md-0">
                            <div class="row mt-2">
                              <div class="col-12 noprint">Back</div>
                              <div class="col-12">
                                <div
                                  class="card text-center"
                                  style="height: 480px; width: 640px"
                                >
                                  <div class="card-body">
                                    <h4 class="card-title">
                                      If found please return to Divine leverage
                                      Team Ltd, 120 Airport Road, opp. FCMB,
                                      Warri, Delta State or any DLT office close
                                      to you.
                                    </h4>
                                    <h4 class="card-title">
                                      Phone: 08100700614, 09020676823
                                    </h4>
                                    <h4 class="card-title" style="text-transform: none">
                                      Website: {{website}}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 py-3 noprint">
                                <button
                                  class="btn btn-primary"
                                  @click="printId"
                                >
                                  Print
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="row flex-wrap" v-else>
                          <div class="col-sm-12 grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0 text-danger">
                              Upload a profile picture to view your id card
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-orders"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title mb-0">Orders</h4>
                  <p class="text-small text-muted">
                    Track / View list of all your orders.
                  </p>
                </div>
                <div class="align-self-center">
                  <vs-button
                    primary
                    square
                    :disabled="member.pending_orders_count > 0"
                    @click="placeNewOrder"
                  >
                    <i class="mdi mdi-plus"></i>
                    Place New Order
                  </vs-button>
                </div>
              </div>

              <orders-list :orders="orders.data"></orders-list>

              <div class="pt-4" v-if="orders.totalPages">
                <vs-pagination
                  v-model="orders.page"
                  :length="orders.totalPages"
                />
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-withdrawals"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title mb-0">Withdrawals</h4>
                  <p class="text-small text-muted">
                    Track / View list of all your withdrawals.
                  </p>
                </div>
                <div v-if="member.pending_withdrawal_requests_count === 0">
                  <new-withdrawal
                    :username="member.user.username"
                    class="align-items-center"
                  ></new-withdrawal>
                </div>
              </div>

              <div
                class="table-responsive"
                style="height: 450px; overflow-y: auto"
              >
                <table class="table table-hover table-condensed">
                  <thead>
                    <tr>
                      <th style="width: 5px"></th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Paid On</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(withdrawal, index) in withdrawals.data"
                      :key="index"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ withdrawal.amount | number }}</td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'badge-warning': !withdrawal.paid,
                            'badge-success': withdrawal.paid,
                          }"
                        >
                          {{ withdrawal.paid ? "PAID" : "PENDING" }}
                        </span>
                      </td>
                      <td>
                        {{
                          (withdrawal.paid_at || withdrawal.created_at) | date
                        }}
                      </td>
                      <td>{{ withdrawal.created_at | date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pt-4" v-if="withdrawals.totalPages">
                <vs-pagination
                  v-model="withdrawals.page"
                  :length="withdrawals.totalPages"
                />
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-deposits"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title mb-0">Deposits</h4>
                  <p class="text-small text-muted">
                    Track / View list of all your deposits.
                  </p>
                </div>
                <div v-if="member.pending_deposits_count === 0">
                  <new-deposits
                    :username="member.user.username"
                    class="align-items-center"
                  ></new-deposits>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-hover table-condensed">
                  <thead>
                    <tr>
                      <th style="width: 5px"></th>
                      <th>Ref.</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(deposit, index) in deposits" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ deposit.reference_number }}</td>
                      <td class="font-weight-bold">
                        {{ deposit.amount | number }}
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'badge-warning': !deposit.confirmed,
                            'badge-success': deposit.confirmed,
                          }"
                        >
                          {{ deposit.confirmed ? "CONFIRMED" : "PENDING" }}
                        </span>
                      </td>
                      <td>{{ deposit.deposited_on | date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-transactions"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <transactions-data-list
                description="View all your transactions"
                :transactions="transactions.data"
              >
              </transactions-data-list>

              <div class="pt-4" v-if="transactions.totalPages">
                <vs-pagination
                  v-model="transactions.page"
                  :length="transactions.totalPages"
                />
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-stage-history"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title mb-0">Stage History</h4>
                  <p class="text-small text-muted">
                    Track / View list of all your stages.
                  </p>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-hover table-condensed">
                  <thead>
                    <tr>
                      <th style="width: 5px"></th>
                      <th>Stage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(stageHistory, index) in stageHistoryList"
                      :key="index"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ stageHistory.stage.name }}</td>
                      <td>{{ stageHistory.created_at | date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-downlines"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title mb-0">Down-lines</h4>
                  <p class="text-muted">
                    Track / View list of members under you
                  </p>
                </div>
                <div class="d-flex justify-content-around align-items-center">
                  <div class="mr-2">
                    <vs-input
                      v-model="downLines.search"
                      type="search"
                      placeholder="Search by username..."
                    />
                  </div>
                  <div class="mr-2">
                    <select-stages-input
                      v-model="downLines.selectedStage"
                    ></select-stages-input>
                  </div>
                  <vs-button
                    danger
                    class="align-self-center"
                    v-show="downLines.search || downLines.selectedStage"
                    circle
                    size="small"
                    icon
                    @click="
                      () => {
                        (downLines.search = ''),
                          (downLines.selectedStage = null);
                      }
                    "
                  >
                    <i class="bx bxs-x-square"></i>
                  </vs-button>
                </div>
              </div>

              <div
                class="table-responsive table-invoice"
                style="height: 450px; overflow-y: auto"
              >
                <table class="table table-condensed table-hover">
                  <thead class="">
                    <tr>
                      <th style="width: 5px"></th>
                      <th>Name</th>
                      <th>Stage</th>
                      <th>Up-Line</th>
                      <th>Sponsor</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(member, index) in downLines.data"
                      :key="index"
                      :class="{ 'text-warning': member.status === 'inactive' }"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        <span class="font-weight-semibold">{{
                          member.full_name
                        }}</span>
                        <br />
                        <span class="text-muted">{{
                          member.user.username
                        }}</span>
                      </td>
                      <td>{{ member.stage.name }}</td>
                      <td>
                        <span>{{ member.up_line_member.full_name }}</span>
                        <br />
                        <span class="text-muted">{{
                          member.up_line_member.user.username
                        }}</span>
                      </td>
                      <td>
                        <span>{{ member.sponsor_member.full_name }}</span>
                        <br />
                        <span class="text-muted">{{
                          member.sponsor_member.user.username
                        }}</span>
                      </td>
                      <td>
                        <vs-button dark @click="orderForMember(member)">
                          <i class="mdi mdi-shopping"></i>
                          Buy for me
                        </vs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pt-4" v-if="downLines.totalPages">
                <vs-pagination
                  v-model="downLines.page"
                  :length="downLines.totalPages"
                />
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-genealogy"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
              ref="user-profile-genealogy"
            >
              <div class="">
                <div class="row">
                  <div class="col-md-5">
                    <h4 class="card-title mb-0">Genealogy</h4>
                    <p class="text-muted">View members in your genealogy</p>
                  </div>
                  <div class="col-md-5 noprint">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <i class="fa fa-search"></i>
                        </div>
                      </div>
                      <input
                        v-model="genealogySearch"
                        type="text"
                        class="form-control"
                        placeholder="Username"
                        @input="loadGenealogy"
                      />
                    </div>
                  </div>
                  <div class="col-md-2">
                    <button
                      class="btn btn-primary mb-2 noprint"
                      @click="printGenealogyTable"
                      title="Print Genealogy"
                    >
                      <i class="fa fa-print"></i>
                    </button>
                    <NuxtLink
                      :to="treeLink"
                      class="btn btn-secondary mb-2 noprint"
                      title="View Tree"
                    >
                      <i class="fa fa-tree"></i>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <div
                class="table-responsive table-invoice genealogy-table print-table"
                style="height: 450px; overflow-y: auto"
              >
                <table
                  ref="genealogyTable"
                  class="table table-condensed table-hover"
                >
                  <thead class="">
                    <tr>
                      <th style="width: 5px"></th>
                      <th>Name</th>
                      <th>Stage</th>
                      <th>Branch / Country</th>
                      <th>Phone</th>
                      <th>Up-Line</th>
                      <th>Sponsor</th>
                      <th>Shop code</th>
                      <th>C-CPts</th>
                      <th>P-C-CPts</th>
                      <th>Current<br />C-CPts</th>
                      <th>Current<br />P-C-CPts</th>
                      <th>Date of Upgrade</th>
                      <th>Reg. Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="genealogy.member && genealogy.page === 1">
                      <td>0</td>
                      <td>
                        <span class="font-weight-semibold">
                          {{ genealogy.member.full_name }}
                        </span>
                        <br />
                        <span>{{ genealogy.member.user.username }}</span>
                      </td>
                      <td>
                        {{ genealogy.member.stage.name }}
                      </td>
                      <td>
                        <div v-if="member.branch != null">
                          {{ genealogy.member.branch.name }} /
                          <small>{{
                            genealogy.member.branch.country.name
                          }}</small>
                        </div>
                      </td>
                      <td>{{ genealogy.member.phone }}</td>
                      <td>
                        <div v-if="genealogy.member.up_line_member">
                          <span>
                            {{ genealogy.member.up_line_member.full_name }}
                          </span>
                          <br />
                          (<span class="text-small">{{
                            genealogy.member.up_line_member.user.username
                          }}</span
                          >)
                        </div>
                      </td>
                      <td>
                        <div v-if="genealogy.member.sponsor_member">
                          <span>
                            {{ genealogy.member.sponsor_member.full_name }}
                          </span>
                          <br />
                          (<span class="text-small">{{
                            genealogy.member.sponsor_member.user.username
                          }}</span
                          >)
                        </div>
                      </td>
                      <td>{{ genealogy.member.shop_code }}</td>
                      <td>
                        {{
                          parseInt(genealogy.member.points_sum_point) | number
                        }}
                      </td>
                      <td>
                        {{
                          parseInt(genealogy.member.direct_points_sum_point)
                            | number
                        }}
                      </td>
                      <td>
                        {{
                          parseInt(
                            genealogy.member.points_in_current_month_sum_point
                          ) | number
                        }}
                      </td>
                      <td>
                        {{
                          member.direct_points_in_current_month_sum_point
                            | number
                        }}
                      </td>
                      <td>{{ genealogy.member.date_of_upgrade | date }}</td>
                      <td>{{ genealogy.member.registered_at | date }}</td>
                      <td></td>
                    </tr>
                    <tr
                      :class="{
                        'text-warning': member.status !== 'active',
                        'text-muted': member.is_mute,
                      }"
                      v-for="(member, index) in genealogyRecords"
                      :key="index"
                      style="cursor: pointer"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        <span class="font-weight-semibold">
                          {{ member.full_name }}
                        </span>
                        <br />
                        <span>{{ member.user.username }}</span>
                      </td>
                      <td>
                        {{ member.stage.name }}
                      </td>
                      <td>
                        <div v-if="member.branch != null">
                          {{ member.branch.name }} /
                          <small>{{
                            genealogy.member.branch.country.name
                          }}</small>
                        </div>
                      </td>
                      <td>{{ member.phone }}</td>
                      <td>
                        <div v-if="member.up_line_member">
                          <span>
                            {{ member.up_line_member.full_name }}
                          </span>
                          <br />
                          (<span class="text-small">{{
                            member.up_line_member.user.username
                          }}</span
                          >)
                        </div>
                      </td>
                      <td>
                        <div v-if="member.sponsor_member">
                          <span>
                            {{ member.sponsor_member.full_name }}
                          </span>
                          <br />
                          (<span class="text-small">{{
                            member.sponsor_member.user.username
                          }}</span
                          >)
                        </div>
                      </td>
                      <td>{{ member.shop_code }}</td>
                      <td>{{ parseInt(member.points_sum_point) | number }}</td>
                      <td>
                        {{ parseInt(member.direct_points_sum_point) | number }}
                      </td>
                      <td>
                        {{
                          parseInt(member.points_in_current_month_sum_point)
                            | number
                        }}
                      </td>
                      <td>
                        {{
                          member.direct_points_in_current_month_sum_point
                            | number
                        }}
                      </td>
                      <td>{{ member.date_of_upgrade | date }}</td>
                      <td>{{ member.registered_at | date }}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pt-4" v-if="genealogy.totalPages">
                <vs-pagination
                  v-model="genealogy.page"
                  :length="genealogy.totalPages"
                />
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="user-profile-incentives"
              role="tabpanel"
              aria-labelledby="user-profile-info-tab"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title mb-0">Incentives</h4>
                  <p class="text-small text-muted">
                    View list of all your incentives.
                  </p>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-hover table-condensed">
                  <thead>
                    <tr>
                      <th style="width: 5px"></th>
                      <th>Incentive</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(incentive, index) in incentives" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>
                        {{ incentive.incentive_requirement_schedule.name }}
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'badge-warning': !incentive.issued,
                            'badge-success': incentive.issued,
                          }"
                        >
                          {{ incentive.issued ? "ISSUED" : "PENDING" }}
                        </span>
                      </td>
                      <td>
                        <span class="" v-if="incentive.issued">
                          {{ incentive.issued_at | date }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="product-promotion-list"
              role="tabpanel"
              aria-labelledby="product-promotion-list-tab"
            >
              <product-promotions active-only></product-promotions>
            </div>

            <div
              class="tab-pane fade pr-3"
              id="product-promotion-bonuses"
              role="tabpanel"
              aria-labelledby="product-promotion-bonuses-tab"
            >
              <product-promotion-bonuses
                :member="member"
              ></product-promotion-bonuses>
            </div>
            <div
              class="tab-pane fade pr-3"
              id="matching-bonuses"
              role="tabpanel"
              aria-labelledby="matching-bonuses-tab"
            >
              <matching-bonus-payments
                :member="member"
              ></matching-bonus-payments>
            </div>
            <div
              class="tab-pane fade pr-3"
              id="company-rep-bonuses"
              role="tabpanel"
              aria-labelledby="company-rep-bonuses-tab"
              v-if="member.is_company_rep"
            >
              <company-rep-bonuses :member="member"></company-rep-bonuses>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vs-dialog dark v-model="showAdminModal" @close="showAdminModal = false">
      <template #header>
        <h4 class="not-margin text-center">
          <small class="text-small text-muted">{{ member.full_name }}</small>
          <br />
          <b>Admin Manager</b>
        </h4>
      </template>

      <div class="">
        <ul class="nav nav-tabs tab-basic" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link active"
              id="admin-settings-tab"
              data-toggle="tab"
              href="#admin-settings"
              role="tab"
              aria-controls="admin-settings"
              aria-selected="true"
              >Admin Settings</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="profile-tab"
              data-toggle="tab"
              href="#change-username"
              role="tab"
              aria-controls="change-username"
              aria-selected="false"
            >
              Account Settings
            </a>
          </li>
        </ul>
        <div class="tab-content tab-content-basic">
          <div
            class="tab-pane fade show active"
            id="admin-settings"
            role="tabpanel"
            aria-labelledby="admin-settings-tab"
          >
            <div class="mb-2">
              <vs-button block warn @click="resetPassword">
                Reset Password
              </vs-button>
            </div>

            <div class="mb-2" v-show="member.is_mute">
              <vs-button block @click="unMuteMember">
                <i class="bx bxs-check-circle"></i>
                Un-Mute Member
              </vs-button>
            </div>

            <div class="mb-2" v-show="!member.is_mute">
              <vs-button block dark @click="muteMember">
                <i class="bx bxs-volume-mute"></i>
                Mute Member
              </vs-button>
            </div>

            <hr class="my-4" />

            <div class="">
              <vs-button block danger @click="deleteMember">
                <i class="bx bxs-trash"></i>
                Delete Member
              </vs-button>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="change-username"
            role="tabpanel"
            aria-labelledby="change-username-tab"
          >
            <change-security-credentials
              :user="member.user"
            ></change-security-credentials>
          </div>
        </div>
      </div>
    </vs-dialog>
  </div>
</template>

<script>
import OrdersList from "@/components/OrdersList";
import TransactionsDataList from "@/components/TransactionsDataList";
import SelectStagesInput from "@/components/inputs/SelectStagesInput";
import _ from "lodash";
import ImageUploadInput from "@/components/inputs/ImageUploadInput";
import MemberInfoCard from "@/components/MemberInfoCard";
import MemberCashFlowChart from "@/components/charts/MemberCashFlowChart";
import NewWithdrawal from "@/components/NewWithdrawal";
import NewDeposits from "@/components/NewDeposits";
import ChangeSecurityCredentials from "@/components/security/ChangeSecurityCredentials";
import ChangeSponsorButton from "~/components/change-sponsor-button";
import ChangeUplineButton from "~/components/change-upline-button";
import ProductPromotionBonuses from "@/components/ProductPromotionBonuses";
import ProductPromotions from "@/components/ProductPromotions";
import CompanyRepBonuses from "@/components/CompanyRepBonuses";
import MatchingBonusPayments from "@/components/MatchingBonusPayments";

export default {
  name: "MemberDetails",
  components: {
    ChangeUplineButton,
    ChangeSponsorButton,
    ChangeSecurityCredentials,
    NewDeposits,
    NewWithdrawal,
    MemberCashFlowChart,
    MemberInfoCard,
    ImageUploadInput,
    SelectStagesInput,
    TransactionsDataList,
    OrdersList,
    ProductPromotionBonuses,
    CompanyRepBonuses,
    ProductPromotions,
    MatchingBonusPayments,
  },
  layout: "app",
  data() {
    return {
      genealogySearch: "",
      showAdminModal: false,
      printSection: "",
      profilePhotoModal: {
        show: false,
        image: null,
        loading: false,
      },
      orders: {
        data: [],
        pagination: null,
        totalPages: null,
        page: 1,
      },
      withdrawals: {
        data: [],
        pagination: null,
        page: 1,
        totalPages: null,
      },
      deposits: [],
      stageHistoryList: [],
      incentives: [],
      transactions: {
        data: [],
        pagination: null,
        page: 1,
        totalPages: null,
      },
      downLines: {
        data: [],
        pagination: null,
        page: 1,
        totalPages: null,
        search: "",
        selectedStage: null,
      },
      genealogy: {
        data: [],
        pagination: null,
        page: 1,
        totalPages: null,
        member: null,
      },
    };
  },
  props: {
    defaultMember: {
      required: false,
      type: Object,
    },
  },
  async fetch() {
    // console.log(this)
    await this.getMemberDetails();
  },
  methods: {
    printGenealogyTable() {
      console.log("compo", this);
      window.print();
    },
    onPrint(event) {
      if (event.matches) {
        this.$refs.genealogyTable.classList.add("print-table");
      } else {
        this.$refs.genealogyTable.classList.remove("print-table");
      }
    },
    async printId() {
      await this.setPrintSection("id-card");
      window.print();
    },
    async printGenealogyTable() {
      await this.setPrintSection("user-profile-genealogy");
      window.print();
    },
    setPrintSection(section) {
      this.printSection = section;
    },
    async uploadPhoto() {
      await this.$doTask(async () => {
        const formData = this.$payloadToFormData({
          id: this.member.id,
          image: this.profilePhotoModal.image,
        });

        await this.$axios.post("profile-pics", formData);
        window.location.reload();
        // await this.getMemberDetails();

        // await this.$store.commit("members/setMemberDetails", response.data);
      }, "Updating photo...");

      this.profilePhotoModal.show = false;
    },
    async getMemberDetails() {
      if (this.defaultMember) {
        await this.$store.commit(
          "members/setMemberDetails",
          this.defaultMember
        );
        return;
      }

      await this.$doTask(async () => {
        const username = this.$nuxt.context.params.username;
        await this.$store.dispatch("members/fetchMemberDetails", username);
      }, "Loading member details...");
    },
    async loadOrders() {
      await this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.$get(
            "members/" + username + "/orders",
            {
              params: {
                page: this.orders.page,
              },
            }
          );

          this.orders.data = response.data;
          this.orders.totalPages = response.data.last_page;
        },
        "Load member orders",
        this.$refs["details"]
      );
    },
    async loadWithdrawals() {
      await this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.$get(
            "members/" + username + "/withdrawals",
            {
              params: {
                page: this.withdrawals.page,
              },
            }
          );

          this.withdrawals.data = response.data;
          this.withdrawals.totalPages = response.last_page;
        },
        "Load member Withdrawals",
        this.$refs["details"]
      );
    },
    async loadDeposits() {
      await this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.$get(
            "members/" + username + "/deposits"
          );

          this.deposits = response.data;
        },
        "Load member deposits",
        this.$refs["details"]
      );
    },
    async loadTransactions() {
      await this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.$get(
            "members/" + username + "/transactions",
            {
              params: {
                page: this.transactions.page,
              },
            }
          );

          this.transactions.data = response.data;
          this.transactions.totalPages = response.total;
        },
        "Load member transactions",
        this.$refs["details"]
      );
    },
    async loadStageHistoryList() {
      await this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.get(
            "members/" + username + "/stage-history"
          );

          this.stageHistoryList = response.data;
        },
        "Load member stage history...",
        this.$refs["details"]
      );
    },
    async loadDownLines() {
      await this.$doTask(
        async () => {
          const username = this.username;

          const search =
            this.downLines.search.length > 0 ? this.downLines.search : null;

          let response = await this.$axios.get(
            "members/" + username + "/down-lines",
            {
              params: {
                page: this.downLines.page,
                search: search,
                stageId: this.downLines.selectedStage?.id,
              },
            }
          );

          this.downLines.data = response.data.data;
          this.downLines.totalPages = response.data.last_page;
        },
        "Load member downlines...",
        this.$refs["details"]
      );
    },
    loadGenealogy: _.debounce(async function () {
      this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.$get(
            "members/" + username + "/genealogy",
            {
              params: {
                page: this.genealogy.page,
                search: this.genealogySearch
              },
            }
          );

          this.genealogy.member = response.member;
          this.genealogy.data = response.genealogy.data;
          this.genealogy.totalPages = response.genealogy.last_page;
        },
        "Load member genealogy...",
        this.$refs["user-profile-genealogy"]
      );
    }, 500),
    async loadIncentives() {
      await this.$doTask(
        async () => {
          const username = this.username;

          let response = await this.$axios.$get(
            "members/" + username + "/incentives"
          );

          this.incentives = response.data;
        },
        "Load member incentives",
        this.$refs["details"]
      );
    },
    placeNewOrder() {
      this.$router.push({
        name: "orders-new",
        params: {
          defaultCountry: this.member.domain.country,
          buyerMember: this.member,
        },
      });
    },
    orderForMember(member) {
      this.$router.push({
        name: "orders-new",
        params: {
          defaultCountry: this.member.domain.country,
          buyerMember: member,
          payerMember: this.member,
        },
      });
    },
    async resetPassword() {
      if (!confirm("Are you sure?")) return;

      let response;

      await this.$doTask(async () => {
        const username = this.username;
        response = await this.$axios.post(
          "members/" + username + "/reset-password"
        );
        this.$vs.notification({
          position: "top-center",
          color: "success",
          text: "Member password has been reset.",
        });
      }, "Resetting member password...");
    },
    async deleteMember() {
      if (!confirm("Are you sure? This action is IRREVERSIBLE!!!")) return;
      await this.$doTask(async () => {
        const username = this.username;
        let response = await this.$axios.post(
          "members/" + username + "/delete"
        );
        if (response.status === 200) {
          this.$vs.notification({
            color: "info",
            text: "Member deleted",
            position: "top-center",
          });
        }
        this.$router.push("/members");
      }, "Deleting member...");
    },
    async muteMember() {
      if (!confirm("Are you sure?")) return;
      await this.$doTask(async () => {
        const username = this.username;
        let response = await this.$axios.post("members/" + username + "/mute");
        if (response.data) {
          this.$store.commit("members/setMemberDetails", response.data);
        }
      }, "Muting member...");
    },
    async unMuteMember() {
      if (!confirm("Are you sure?")) return;
      await this.$doTask(async () => {
        const username = this.username;
        let response = await this.$axios.post(
          "members/" + username + "/unmute"
        );
        if (response.data) {
          this.$store.commit("members/setMemberDetails", response.data);
        }
      }, "Un-muting member...");
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.referralLink);
        this.$vs.notification({
          color: "success",
          text: "Copied to clipboard!",
          position: "top-center",
        });
      } catch ($e) {
        this.$vs.notification({
          color: "danger",
          text: "Could not copy",
          position: "top-center",
        });
      }
    },
  },
  computed: {
    website(){
      return "www.divineleverage.org";
    },
    member() {
      return this.$store.state.members.memberDetails;
    },
    username() {
      return this.$nuxt.context.params.username || this.member.user.username;
    },
    API_URL() {
      return this.$config.apiRoot;
    },

    referralLink() {
      let origin = window.location.origin;
      return `${origin}/signup?ref=${this.member.user.username}`;
    },

    genealogyRecords() {
      let search = this.genealogySearch;
      // if (search !== "") {
      //   return this.genealogy.data.filter((item) => {
      //     return item.user.username
      //       .toLowerCase()
      //       .includes(search.toLowerCase());
      //   });
      // }

      return this.genealogy.data;
    },
    treeLink() {
      return `/genealogy/${this.username}`;
    },
  },
  mounted() {
    window.matchMedia("print").addEventListener("change", this.onPrint);
    this.$initXEditable();
  },
  watch: {
    "transactions.page": function (page, __) {
      this.loadTransactions();
    },
    "withdrawals.page": function (page, __) {
      this.loadWithdrawals();
    },
    "orders.page": function (page, __) {
      this.loadOrders();
    },
    "downLines.page": function (page, __) {
      this.loadDownLines();
    },
    "downLines.selectedStage": function (stage, __) {
      this.loadDownLines();
    },
    "downLines.search": _.debounce(function (search, __) {
      this.loadDownLines();
    }, 1000),
    "genealogy.page": function (page, __) {
      this.loadGenealogy();
    },
  },
};
</script>

<style scoped lang="scss">
.member-profile-photo {
  .change-photo-btn {
    visibility: hidden;
  }

  &:hover {
    .change-photo-btn {
      visibility: visible;
    }
  }
}
</style>
<style>
@media print {
  .genealogy-table {
    width: 100%;
  }
  /* Style for the table when it's printed */
  table {
    /* Remove table borders */
    border: none;
    /* Set font size for table cells */
    font-size: 12px;
  }
  /* Style for table headers when printed */
  table th {
    /* Remove background color */
    background-color: transparent;
    /* Remove top and bottom borders */
    border-top: none;
    border-bottom: none;
  }
  /* Style for table cells when printed */
  table td {
    /* Remove left and right borders */
    border-left: none;
    border-right: none;
  }
  #sidebar,
  .nav,
  #intro,
  #stats,
  #info {
    display: none !important;
  }
}
</style>
<style>
@media print {
  .noprint {
    display: none !important;
  }
}
</style>
