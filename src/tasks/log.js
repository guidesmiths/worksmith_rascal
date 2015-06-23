'use strict'

var _ = require('lodash')

module.exports = function define(node) {
    return function build(context) {

        execute.annotations = {inject: ['level', 'message', 'data', 'logger']}

        function execute(level, message, data, logger, done) {

            logger = logger || context.logger || console

            logger[level || 'info'](message, _.extend({
                messageId: context.message.properties.messageId,
                routingKey: context.message.fields.routingKey
            }, data))
            done()
        }

        return execute
    }
}