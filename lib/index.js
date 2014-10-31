var _   = require('underscore');
var Joi = require('joi');


var Dispute = function (args, config, error, success) {
  args    = _.values(args);
  error   = error   || function () {};
  success = success || function () {};

  var argObject = {};
  var missing   = {};

  // Search the first argument for named arguments
  if (args.length !== _.keys(config).length) {
    var found = false;
    _.each(config, function (value, key) {
      if (typeof args[0][key] !== 'undefined') {
        found = true;
        argObject[key] = args[0][key];
      }
      else {
        missing[key] = config[key];
      }
    });
    if (found) {
      args.shift();
    }
  }

  // When args length is less than missing length, that means we haven't been
  // given all the arguments, therefore we have to prioritize them.
  if (args.length <= _.keys(missing).length) {
    missing = getPrioritySorted(args, missing);
    missing = _.keys(missing);
  }
  // Map what we have in args into argObject
  _.each(missing.slice(0, args.length), function (key, i) {
    argObject[key] = args[i];
  });
  // These are the keys of whatever is still missing.
  // And that means *actually* missing.
  missing = missing.slice(args.length);

  var errors    = [];
  var finalArgs = {};
  var result;
  _.each(config, function (argConfig, key) {
    // Check for required
    if (argConfig === true || argConfig.required === true) {
      result = Joi.required().validate(argObject[key]);
      if (result.error) {
        errors.push(
          'Argument `' + key + '`: ' + result.error.details[0].message
        );
      }
    }
    else if (typeof argConfig.validate !== 'undefined') {
      if (argConfig.validate.isJoi) {
        result = argConfig.validate.validate(argObject[key]);
        if (result.error) {
          errors.push(
            'Argument `' + key + '`: ' + result.error.details[0].message
          );
        }
      }
    }
    else if (typeof argConfig.default !== 'undefined') {
      if (missing.indexOf(key) >= 0) {
        if (typeof argConfig.default === 'function') {
          argObject[key] = argConfig.default();
        }
        else {
          argObject[key] = argConfig.default;
        }
      }
    }
    if (typeof argObject[key] !== 'undefined') {
      finalArgs[key] = argObject[key];
    }
  });
  if (errors.length) {
    error(errors, finalArgs);
  }
  return finalArgs;
};

var getPrioritySorted = function (args, config) {
  var keys = _.keys(config);
  keys.sort(function (a, b) {
    var aPriority = config[a].priority;
    var bPriority = config[b].priority;
    if (typeof aPriority === 'undefined') {
      aPriority = args.length + 1;
    }
    if (typeof bPriority === 'undefined') {
      bPriority = args.length + 1;
    }
    return aPriority > bPriority;
  });
  return _.object(keys, _.map(keys, function (key) {
    return config[key];
  }));
};

module.exports = Dispute;
