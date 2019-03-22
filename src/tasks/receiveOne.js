var defaults = require('lodash.defaults')

//An activity to receive exactly x number of messages
//Activity 'subscribe' will be the one that listens on a subscription for indefinite time

module.exports = function(node) {

    return function (context) {

        execute.annotations = { inject: ['broker', 'subscription', 'timeOut', 'options']}

        function execute(broker, subscription, timeOut, options, done) {
            var timeOutToken

            options = defaults({}, options, {prefetch:1 })
            broker = broker || context.broker
            var _receiveOne = function(m, c, an) {
                clearTimeout(timeOutToken)
                _receiveOne = function(m, c, an) {
                    an({}, {strategy:'republish'})
                }
                an()
                done(undefined, { message: m, content: c});
            }

            var receiveOne = function(message, content, ackNack) {
                _receiveOne(message, content, ackNack)
            }


            broker.subscribe(subscription, options, function(err, subscription) {
                if (timeOut) {
                    timeOutToken = setTimeout(function() {
                        _receiveOne = function() {  }
                        done({"message":"time out"})
                    }, timeOut)
                }
                if (err) return done(err)
                subscription
                    .on('message', receiveOne)
                    .on('error', done)
           })
        }

        return execute
    }
}
