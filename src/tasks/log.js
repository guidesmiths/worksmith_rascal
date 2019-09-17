'use strict'

var assignIn = require('lodash.assignin')
var get = require('lodash.get')

module.exports = function define(node) {
    return function build(context) {

        execute.annotations = { inject: ['level', 'message', 'data', 'logger'] }

        function execute(level, message, data, logger, done) {
            
            logger = logger || context.logger || console

            var recovery = get(context, 'message.properties.headers.rascal.recovery')
            var originalQueue = get(context, 'message.properties.headers.rascal.originalQueue')
            var timesForwarded = recovery && recovery[originalQueue] && recovery[originalQueue].forwarded || 0

            logger[level || 'info'](message, assignIn({
                messageId: context.message.properties.messageId,
                routingKey: context.message.fields.routingKey,
                timesForwarded: timesForwarded,
            }, data))
            done()
        }

        return execute
    }
}
