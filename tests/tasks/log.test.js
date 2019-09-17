'use strict'

var assert = require('assert')
var worksmith = require('worksmith')
var rascal = require('rascal')
var _ = require('lodash')

describe('log message', () => {

  it.only('should fail if no message has been received', function (done) {

    var workflow = worksmith({
      task: 'sequence',
      items: [{
        task: 'log',
        message: 'this is a test message string',
      }]
    })

    var ctx = {}

    workflow(ctx, function (err) {
      assert.ok(err)
      done()
    })
  })

  it.only('should not throw any error if the message is correct and the message received has not been forwarded', function (done) {

    var workflow = worksmith({
      task: 'sequence',
      items: [{
        task: 'log',
        message: 'this is a test message string',
      }]
    })

    var ctx = {
      message: {
        properties: {
          messageId: 'myMessageId',
          headers: {
            rascal: {
              originalQueue: 'this:is:a:queue',
            }
          }
        },
        fields: {
          routingKey: 'a.b.c.d'
        }
      }
    }

    workflow(ctx, function (err) {
      assert.ifError(err)
      done()
    })
  })

  it.only('should not throw any error if the message is correct', function (done) {

    var workflow = worksmith({
      task: 'sequence',
      items: [{
        task: 'log',
        message: 'this is a test message string',
      }]
    })

    var ctx = {
      message: {
        properties: {
          messageId: 'myMessageId',
          headers: {
            rascal: {
              originalQueue: 'this:is:a:queue',
              recovery: {
                'this:is:a:queue': {
                  forwarded: 9
                }
              }
            }
          }
        },
        fields: {
          routingKey: 'a.b.c.d'
        }
      }
    }

    workflow(ctx, function (err) {
      assert.ifError(err)
      done()
    })
  })
})
