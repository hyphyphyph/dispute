var Dispute = require('dispute');
var Joi     = require('joi');

var test = function (a, b, c, d) {
  var options = Dispute(arguments, {
    a: true,
    b: {
      priority: 2
    },
    c: true,
    callback: {
      priority: 1
    }
  }, function (err, args) {
    throw new Error(err);
  });
};

test({
  a: 1,
  c: 3
}, '2');
