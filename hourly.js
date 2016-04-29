#!/usr/bin/env node
"use strict"

var hr = 1000 * 60 * 60

/**
 * Repeatedly calls a function on the hour (or at a fixed offset from the hour).
 * @param {function} fn - the function to be repeatedly called.
 * @param {number} offset - the number of milliseconds to offset the hour by.
 * @param {...object} [params] - optional parameters to pass into function.
 * @returns {Promise<intervalId>} - promise for intervalId for use with clearInterval
 */
function setHourly(fn, offset) {
	var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null
	function callWithArgs(){
		fn.apply(global, args)
	}
	function callWithoutArgs(){
		fn.call(global)
	}
	var call = args ? callWithArgs : callWithoutArgs

	var start = new Date()
	start.setMinutes(0)
	start.setSeconds(0)
	start.setMilliseconds(offset || 0)
	var diff = start.getTime() - Date.now()
	diff %= hr
	if(diff < 0){
		diff += hr
	}
	return new Promise(function(resolve){
		setTimeout(function(){
			call()
			resolve(setInterval(call, hr))
		}, diff)
	})
}
module.exports = setHourly
module.exports.hourly = setHourly
module.exports.setHourly = setHourly

/**
 * Log the ISO8601 time on the hour (or offset)
 * @param {number} [offset] - offset from the hour
 * @param {number} [terminate] - stop printing times after this many milliseconds
 */
function sampleMain(offset, terminate){
	// setup hourly
	var interval = setHourly(function(){
		console.log(new Date().toISOString())
	}, offset)

	// allow shutdown
	if(terminate){
		setTimeout(function(){
			interval.then(function(interval){
				clearInterval(interval)
			})
		}, terminate)
	}
}
if(require.main === module){
	var offset = process.argv[2] ? parseFloat(process.argv[2]) * 1000 * 60 : 0
	var terminate = process.argv[3] ? parseFloat(process.argv[3]) * 1000 * 60 : 0
	sampleMain(offset, terminate)
}
