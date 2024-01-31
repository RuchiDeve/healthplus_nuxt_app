import createRepository from '~/api/repository'

export default (ctx: any, inject: any) => {
  const repositoryWithAxios = createRepository(ctx.$axios)

  const repositories = {
    stageRequirementSchedules: repositoryWithAxios('stage-requirement-schedules'),
    directDownlines: repositoryWithAxios('direct-downlines'),
    memberProductRequests: repositoryWithAxios('member-product-requests'),
    stockistProductRequests: repositoryWithAxios('stockist-product-requests'),
    branchProductRequests: repositoryWithAxios('branch-product-requests'),
    productPromotions: repositoryWithAxios('product-promotions'),
    productPromotionBonuses: repositoryWithAxios('product-promotion-bonuses'),
    products: repositoryWithAxios('products'),
    companyReps: repositoryWithAxios('company-reps'),
    companyRepBonuses: repositoryWithAxios('company-rep-bonuses'),
    members: repositoryWithAxios('members'),
    companyRepMember: repositoryWithAxios('company-reps/member'),
    incentiveRequirementSchedules: repositoryWithAxios('incentive-requirement-schedules'),
    matchingBonuses: repositoryWithAxios('matching-bonuses'),
    matchingBonusPayments: repositoryWithAxios('matching-bonus-payments'),
    pendingTotalMatchingBonusPayments: repositoryWithAxios('matching-bonus-payments/pending-total'),
    paidTotalCompanyRepBonus: repositoryWithAxios('company-rep-bonuses/paid-total'),
    //Add more here...
  }
  inject('repositories', repositories)
}
