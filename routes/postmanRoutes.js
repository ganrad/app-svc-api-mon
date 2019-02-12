'use strict';
module.exports = function(app) {
  var postman = require('../controllers/postmanController');

  app.route('/api/postman')
    .get(postman.run);
 

  // app.route('/contactpref/:taskId')
  //   .get(contactPref.read_a_task)
  //   .put(contactPref.update_a_task)
  //   .delete(contactPref.delete_a_task);
};
