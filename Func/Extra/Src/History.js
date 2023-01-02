/**
 * Console History v1.5.1
 * console-history.js
 *
 * Licensed under the MIT License.
 * https://git.io/console
 */
'use strict'

/* Allow only one instance of console-history.js */
if (typeof console.history !== 'undefined') {
    throw new Error('Only one instance of console-history.js can run at a time.')
}

/* Store the original log functions. */
console._log = console.log
console._info = console.info
console._warn = console.warn
console._error = console.error
console._debug = console.debug

/* Declare our console history variable. */
console.history = []

/* Redirect all calls to the collector. */
console.log = function(dt) {
    return console._intercept('log', dt, arguments)
}
console.info = function(dt) {
    return console._intercept('info', dt, arguments)
}
console.warn = function(dt) {
    return console._intercept('warn', dt, arguments)
}
console.error = function(dt) {
    return console._intercept('error', dt, arguments)
}
console.debug = function(dt) {
    return console._intercept('debug', dt, arguments)
}

/* Give the developer the ability to intercept the message before letting
   console-history access it. */
console._intercept = function(type, data, args) {
    // Your own code can go here, but the preferred method is to override this
    // function in your own script, and add the line below to the end or
    // begin of your own 'console._intercept' function.
    // REMEMBER: Use only underscore console commands inside _intercept!
    console._collect(type, data,args)
}

/* Define the main log catcher. */
console._collect = function(type, data, args) {
    // WARNING: When debugging this function, DO NOT call a modified console.log
    // function, all hell will break loose.
    // Instead use the original console._log functions.

    // All the arguments passed to any function, even when not defined
    // inside the function declaration, are stored and locally available in
    // the variable called 'arguments'.
    //
    // The arguments of the original console.log functions are collected above,
    // and passed to this function as a variable 'args', since 'arguments' is
    // reserved for the current function.

    // Collect the timestamp of the console log.
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    var time = new Date().toLocaleDateString('vi-VN', options)

    // Make sure the 'type' parameter is set. If no type is set, we fall
    // back to the default log type.
    if (!type) type = 'log'

    // To ensure we behave like the original console log functions, we do not
    // output anything if no arguments are provided.
    if (!args || args.length === 0) return

    // Act normal, and just pass all original arguments to
    // the origial console function :)
    console['_' + type].apply(console, args)

    // Get stack trace information. By throwing an error, we get access to
    // a stack trace. We then go up in the trace tree and filter out
    // irrelevant information.
    var stack = false
    try {
        throw Error('')
    } catch (error) {
        // The lines containing 'console-history.js' are not relevant to us.
        var stackParts = error.stack.split('\n')
        stack = []
        for (var i = 0; i < stackParts.length; i++) {
            if (stackParts[i].indexOf('console-history.js') > -1 ||
                stackParts[i].indexOf('console-history.min.js') > -1 ||
                stackParts[i] === 'Error') {
                continue
            }
            stack.push(stackParts[i].trim())
        }
    }
    try {
        data = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,'')
    }
    catch (e) {
        data = data;
    }
    // Add the log to our history.
    console.history.push({
        type: type,
        timestamp: time,
        message: data,
        stack: stack
    })
}