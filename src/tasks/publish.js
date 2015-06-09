var _ = require('lodash')

module.exports = function(node) {

    return function (context) {

        execute.annotations = { inject: ['broker', 'publication', 'payload', 'routingKey', 'options']}

        function execute(broker, publicationId, payload, routingKey, options, done) {

            broker = broker || context.broker
            options = _.defaults({}, { routingKey: routingKey }, options)

            broker.publish(publicationId, payload, options, function(err, publication) {
                if (err) return done(err)

                publication.on('success', function(messageId) {
                    return done(null, messageId)
                }).on('error', done)
            })
        }

        return execute
    }
}