# Hourly

Hourly is a setInterval() replacement to conveniently set up firing on the hour

# API

`hourly(fn, offset, ...params)`

fn {function} - the function to be repeatedly called.
[offset] {number} - optional number of milliseconds to offset the hour by.
[params] {...object} - optional parameters to pass into function.

Returned is a Promise which will resolve to the intervalId usable with `clearInterval`. Note that this will only be returned after the first invocation of hourly has already occured. 

# Executable

`hourly.js` is [also executable](https://github.com/rektide/hourly/blob/master/hourly.js#L42-L61], and will print the ISO8601 time to the screen on the hour. 

# Example

The example is based off the executable code, printing the date to the screen quarter past the hour.

```javascript
var hourly = require("hourly")

// set to run at quarter past the hour
var interval = setHourly(() => console.log(new Date().toISOString()), 15 * 60 * 100)

// stop after 24 hours
setTimeout(()=> interval.then(interval => clearInterval), 24 * 60 * 60 * 1000)
```

# Compatibility

Hourly is written in ES5 and is a CommonJS module.
