
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
         email: 'Josh@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
         salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:'Josh', num_completed_balances:10},
        {
          email: 'Toro@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:'Toro', num_completed_balances:6}, 
        {
         email: 'Alex@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
         salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:'Alex', num_completed_balances:7},
        {
          email: 'Emily@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:'Emily', num_completed_balances:1},
        {
          email: 'Vicki@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:'Vicki', num_completed_balances:3,
          stripe_connect_account_token:'acct_1Dd2JQFBGuZLGHXA', stripe_customer_id:'cus_E5CjfnLOpLixcm'},
        { 
          email: 'Carson@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739',username:null, num_completed_balances:3, 
          stripe_connect_account_token:'acct_1Dd2G0FgxTx3cXKM', stripe_customer_id:'cus_E5Cfm31AYHLmCN'},
        { 
          email: 'Anne@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:null, num_completed_balances:3},
        {
          email: 'Sandy@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:null, num_completed_balances:3},
        {
          email: 'barack-obama@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:null, num_completed_balances:3},
        {
          email: 'stephen31@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:null, num_completed_balances:3},
        {
          email: 'Charles_Darwin@balance.com', password: '460ba70b046f3768bd9c47458badbeb680c0605bef2de1c233ffdf413dd1d7179ffea33f7185528bb81212887fa85d4da232f81e54998e3313eedc36e562d506',
          salt:'a1265934cb1bc3f5fb5cfd6ca22ddc2ab8e4c739', username:null, num_completed_balances:3},
      ]);
    });
};
