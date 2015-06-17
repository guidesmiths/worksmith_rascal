'use strict'

var assert = require('assert')
var worksmith = require('worksmith')
var rascal = require('rascal')
var _ = require('lodash')

describe('receive task', function() {

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
    

    it('should receive a message', function(done) {

        var workflow = worksmith({
            task: 'sequence',
            items: [{
                    condition:"true",
                    task: 'publish',
                    broker: broker,
                    publication: 'p1',
                    payload: 'test message',
                    resultTo: 'messageId'
                },
                {
                    condition:"true",
                    task: 'publish',
                    broker: broker,
                    publication: 'p1',
                    payload: 'test message',
                    resultTo: 'messageId'
                },
                {
                    task: 'receiveOne',
                    broker: broker,
                    subscription: 's1',
                    resultTo: 'message'
                }]
        })

        var ctx = {}

        workflow(ctx, function(err) {
            assert.ifError(err)
            assert.ok(ctx.message)
            assert.ok(ctx.message.message)
            assert.ok(ctx.message.content)
            assert.equal("test message", ctx.message.content)
            done()
        })

    })

    it('should time out if there is no message to receive', function(done) {

        var workflow = worksmith({
            task: 'sequence',
            items: [{
                    task: 'receiveOne',
                    broker: broker,
                    subscription: 's1',
                    timeOut: 100,
                    resultTo: 'message'
                }]
        })

        var ctx = {}

        workflow(ctx, function(err) {
            assert.ok(err)
            done()
        })

    })


})