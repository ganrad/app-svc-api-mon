'use strict';
module.exports = function(app) {
  var postman = require('../controllers/postmanController');

  app.route('/api/postman')
    .get(postman.run);
 
};
