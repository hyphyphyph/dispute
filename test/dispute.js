var assert = require('assert');
var Dispute = require('dispute');

describe('Dispute', function () {
  it ('should do shit', function () {
    Dispute([
      1,
      3
    ], {
      first: {
        type: String,
        priority: 1,
        validate: function () {
          return false;
        }
      },
      second: {
        type: String,
        default: 'Hello World',
        required: true
      },
      third: {
        type: String,
        priority: 2
      }
    });
  });
});
