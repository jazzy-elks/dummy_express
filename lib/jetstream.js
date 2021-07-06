const { connect, StringCodec, consumerOpts, createInbox } = require('nats');
const sc = StringCodec();


async function updateSubscribe(js) {
  const sub = await js.subscribe('FLAG.updated', config('updated'));

  console.log(`Update subscription running`);
  subscriptionLog('Update')(sub);
}

async function createSubscribe(js) {
  const sub = await js.subscribe('FLAG.created', config('created'));

  console.log(`Create subscription running`);
  subscriptionLog('Create')(sub);
}

async function deleteSubscribe(js) {
  const sub = await js.subscribe('FLAG.deleted', config('deleted'));

  console.log(`Delete subscription running`);
  subscriptionLog('Delete')(sub);
}

function subscriptionLog(subject) {
  return(
    async function(subscription) {
      for await (const msg of subscription) {
        msg.ack();
        console.log(`Data from ${subject} func; subject: ${msg.subject}: ${sc.decode(msg.data)}`);
      }
      console.log(`Subscription to ${subject} closed.`);
    }
  );
}

async function sendDataRequest() {
  const nc = await connect({servers: "localhost:4222"})
  await nc.request("allData", "", {  timeout: 1000}  )
}

async function requestAllDataFromCache() {

  const nc = await connect({servers: "localhost:4222"})


  // the client makes a request and receives a promise for a message
  // by default the request times out after 1s (1000 millis) and has
  // no payload.

  await nc.request("allData", "", {  timeout: 1000}  )
    .then((reply) => {
      console.log(`requestAllDataFromCache reply received: ${sc.decode(reply.data)}`);
    })
    .catch(async (err) => {

        console.log(`requestAllDataFromCache err: ${err}; retry to send message in 5 sec.`)
        setTimeout(async () => {
          await nc.request("allData", "", {  timeout: 5000}  )
          .then((rply) => {
            console.log(`retry successful. requestAllDataFromCache reply received: ${sc.decode(reply.data)}`)
          })
          .catch((err2) => {
            console.log(`Retry failed. Err: ${err}`)
          })
        }, 5000)
      })
      
  await nc.close();
}

function config(subject) {
  // config push subscription
  // https://github.com/nats-io/nats.deno/blob/main/jetstream.md#push-subscriptions
  const opts = consumerOpts();
  opts.durable(subject);
  opts.manualAck();
  opts.ackExplicit();
  opts.deliverTo(createInbox());

  return opts
}

async function initSubscribe() {
  const nc = await connect({ servers: "localhost:4222" });
  const js = nc.jetstream();

  updateSubscribe(js);
  createSubscribe(js);
  deleteSubscribe(js);
}

module.exports.initSubscribe = initSubscribe;
exports.requestAllDataFromCache = requestAllDataFromCache;