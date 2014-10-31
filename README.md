dispute
=======

Function argument validation and overloading handler.

```javascript
var functionWithValidation = function (arg0, arg1, arg2, arg3) {
  var options = Dispute(arguments, {
    arg0: true, // Shorthand for required
    arg1: {
      priority: 2
    },
    arg2: {
      default: '123',
      validate: Joi.string()
    },
    arg3: {
      priority: 1
    }
  }, function (err, args) {
    throw new Error(err);
  });
};

functionWithValidation(1, '2', 3, 4);
=> options { arg0: 1, arg1: '2', arg2: 3, arg3: 4 }

functionWithValidation(1, '2', 3);
=> options { arg0: 1, arg1: '2', arg3: 4 }

functionWithValidation(1, '2');
=> options { arg0: 1, arg1: '2'}

functionWithValidation(1, 2);
=> Error: Argument `arg1`: value must be a string

functionWithValidation(1);
=> options { arg0: 1, arg1: '123'}

functionWithValidation({ arg0: 1, arg1: 2 }, 3);
=> options { arg0: 1, arg1: 2, arg3: 3}
```
