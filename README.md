# worksmith_rascal

[Rascal](http://npmjs.com/package/rascal) activities for [worksmith](http://npmjs.com/package/worksmith)

This package contains the following activities/tasks:

name | description
--- | ---
[publish](#publish-activity) | Publishes a message a rascal publication

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

### Running tests
You need an rabbitmq server running on localhost:5672 for the tests to pass. If you have docker and docker-compose installed simply run ```docker-compose up``` in the route of this project.

