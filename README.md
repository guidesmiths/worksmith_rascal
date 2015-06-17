# worksmith_rascal

[Rascal](http://npmjs.com/package/rascal) activities for [worksmith](http://npmjs.com/package/worksmith)

This package contains the following activities/tasks:

name | description
--- | ---
[publish](#publish-activity) | Publishes a message a rascal publication
[receiveOne](#receiveone-activity) | Receives a message from a rascal publication

### publish activity
Publish as message to a rascal publication
##### params
name | type | description
--- | --- | ---
broker | Rascal Broker | Will look in context.broker if not specified
publication | Publication id | Where to send the message
payload | The payload to publish
routingKey | Routing key to use when publishing the message. Will override the routing key defined in the publication
options | Other publication options (see rascal documentation)

##### example

```javascript
var worksmith = require('worksmith')
worksmith.use('rascal', require('worksmith_rascal'))
var workflow = worksmith({task:"sequence", items : [{
    task:'rascal/publish',
    broker: '@broker',
    publication: 'p1',
    payload: 'test message',
    resultTo: 'messageId'
}])
```


### receiveOne activity
Receives exactly one message from a subscription within a given timeout.
Causes an error if no message could be received.

When a message is received the result is `{ message: rabbitMsg, content: parsed<message.content> }`

##### params
name | type | description
--- | --- | ---
broker | Rascal Broker | Will look in context.broker if not specified
subscription | Subscription id | Rascal subscription name to receive from
timeOut | milliseconds | amount of time to wait for a message
options | Other subscription options (see rascal documentation)

##### example

```javascript
var worksmith = require('worksmith')
worksmith.use('rascal', require('worksmith_rascal'))
var workflow = worksmith({task:"sequence", items : [{
    task:'rascal/receiveOne',
    broker: '@broker',
    subscription: 's1',
    resultTo: 'message'
}])
```

### Running tests
You need an rabbitmq server running on localhost:5672 for the tests to pass. If you have docker and docker-compose installed simply run ```docker-compose up``` in the route of this project.

