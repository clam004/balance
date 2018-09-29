
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'Josh@balance.com', password: '644e39a7c3c259f50243923ef97375344e9d901be21858c1174bbc2da7b6f7f13ef25fbf1f596961fd3b0f0d0f4d040cbf466a94a8da2a8805cb77088d782da2',
         salt:'6e11c5264acd9c0ec31d71a224161d866f7638f4', username:'Josh'},
        {id: 2, email: 'Toro@balance.com', password: '644e39a7c3c259f50243923ef97375344e9d901be21858c1174bbc2da7b6f7f13ef25fbf1f596961fd3b0f0d0f4d040cbf466a94a8da2a8805cb77088d782da2',
         salt:'6e11c5264acd9c0ec31d71a224161d866f7638f4', username:'Toro'}
      ]);
    });
};

