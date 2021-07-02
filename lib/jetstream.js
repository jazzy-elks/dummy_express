const { connect, StringCodec } = require('nats');
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

function config(subject) {
  return ({ config:
    {
      durable_name: `consume_${subject}`,
      deliver_subject: `${subject}`,
      filter_subject: `FLAG.${subject}`
    }
  });
}

async function initSubscribe() {
  const nc = await connect({ servers: "localhost:4222" });
  const js = nc.jetstream();

  updateSubscribe(js);
  createSubscribe(js);
  deleteSubscribe(js);
}

module.exports.initSubscribe = initSubscribe;