'use strict'

var assert = require('assert')
var worksmith = require('worksmith')
var rascal = require('rascal')
var _ = require('lodash')

describe('publish task', function() {

    this.slow(undefined)
    this.timeout(5000)

    var broker
    var config = {
        vhosts: {
            '/': {
                exchanges: ['e1'],
                queues: ['q1'],
                bindings: ['e1 -> q1'],
                subscriptions: {
                    's1': {
                        queue: 'q1'
                    }
                },
                publications: {
                    'p1': {
                        exchange: 'e1'
                    }
                }
            }
        }
    }

    beforeEach(function(done) {
        rascal.createBroker(rascal.withTestConfig(config), function(err, _broker) {
            broker = _broker
            done()
        })
    })

    afterEach(function(done) {
        if (broker) return broker.nuke(done)
        done()
    })

    it('should publish with defaults', function(done) {

        var workflow = worksmith({
            task: 'sequence',
            items: [
                {
                    task: 'publish',
                    broker: broker,
                    publication: 'p1',
                    payload: 'test message',
                    resultTo: 'messageId'
                }
            ]
        })

        var ctx = {}

        workflow(ctx, function(err) {
            assert.ifError(err)
            assert.ok(ctx.messageId)
        })

        broker.subscribe('s1', function(err, subscription) {
            assert.ifError(err)
            subscription.on('message', function(message, content) {
                subscription.cancel(function() {
                    assert.equal(content, 'test message')
                    done()
                })
            })
        })
    })

    it('should publish with routing key', function(done) {

        var workflow = worksmith({
            task: 'sequence',
            items: [
                {
                    task: 'publish',
                    broker: broker,
                    publication: 'p1',
                    payload: 'test message',
                    routingKey: 'rk1',
                    resultTo: 'messageId'
                }
            ]
        })

        var ctx = {}

        workflow(ctx, function(err) {
            assert.ifError(err)
            assert.ok(ctx.messageId)
        })

        broker.subscribe('s1', function(err, subscription) {
            assert.ifError(err)
            subscription.on('message', function(message, content) {
                subscription.cancel(function() {
                    assert.equal(message.fields.routingKey, 'rk1')
                    done()
                })
            })
        })
    })


    it('should publish with routing key', function(done) {

        var workflow = worksmith({
            task: 'sequence',
            items: [
                {
                    task: 'publish',
                    broker: broker,
                    publication: 'p1',
                    payload: 'test message',
                    options: {
                        routingKey: 'rk1'
                    },
                    resultTo: 'messageId'
                }
            ]
        })

        var ctx = {}

        workflow(ctx, function(err) {
            assert.ifError(err)
            assert.ok(ctx.messageId)
        })

        broker.subscribe('s1', function(err, subscription) {
            assert.ifError(err)
            subscription.on('message', function(message, content) {
                subscription.cancel(function() {
                    assert.equal(message.fields.routingKey, 'rk1')
                    done()
                })
            })
        })
    })
})