const { connect, StringCodec, consumerOpts, createInbox} = require('nats');
const sc = StringCodec();

async function updateSubscribe() {
  const nc = await connect({ servers: "localhost:4222" });
  const js = nc.jetstream();


  const sub = await js.subscribe('FLAG.updated', {config:
    {
      durable_name: "consume_updates",
      deliver_subject: "updated",
      filter_subject: "FLAG.updated"
  }
});

  console.log(`push subscription running`);
  (async () => {
    for await (const m of sub) {
      m.ack();
      console.log(`Data from updateSubscribe func; subject: ${m.subject}: ${sc.decode(m.data)}`);
    }
    console.log("subscription closed");
  })();
}

function initSubscribe() {
  updateSubscribe();
}

module.exports.initSubscribe = initSubscribe;