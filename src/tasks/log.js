'use strict'

var assignIn = require('lodash.assignin')

module.exports = function define(node) {
    return function build(context) {

        execute.annotations = {inject: ['level', 'message', 'data', 'logger']}

        function execute(level, message, data, logger, done) {

            logger = logger || context.logger || console

            logger[level || 'info'](message, assignIn({
                messageId: context.message.properties.messageId,
                routingKey: context.message.fields.routingKey
            }, data))
            done()
        }

        return execute
    }
}
