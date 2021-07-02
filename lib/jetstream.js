const { connect, StringCodec } = require('nats');
const sc = StringCodec();

async function updateSubscribe(js) {
  const sub = await js.subscribe('FLAG.updated', {config:
    {
      durable_name: "consume_updates",
      deliver_subject: "updated",
      filter_subject: "FLAG.updated"
  }
});

  console.log(`Update subscription running`);
  (async () => {
    for await (const m of sub) {
      m.ack();
      console.log(`Data from updateSubscribe func; subject: ${m.subject}: ${sc.decode(m.data)}`);
    }
    console.log("subscription closed");
  })();
}

async function createSubscribe(js) {
  const sub = await js.subscribe('FLAG.created', {config:
    {
      durable_name: "consume_creation",
      deliver_subject: "created",
      filter_subject: "FLAG.created"
    }
  });

  console.log(`Create subscription running`);
  (async () => {
    for await (const m of sub) {
      m.ack();
      console.log(`Data from createSubscribe func; subject: ${m.subject}: ${sc.decode(m.data)}`);
    }
    console.log("subscription closed");
  })();
}

async function deleteSubscribe(js) {
  const sub = await js.subscribe('FLAG.deleted', {config:
    {
      durable_name: "consume_deletion",
      deliver_subject: "deleted",
      filter_subject: "FLAG.deleted"
    }
  });

  console.log(`Delete subscription running`);
  (async () => {
    for await (const m of sub) {
      m.ack();
      console.log(`Data from deleteSubscribe func; subject: ${m.subject}: ${sc.decode(m.data)}`);
    }
    console.log("subscription closed");
  })();
}

async function initSubscribe() {
  const nc = await connect({ servers: "localhost:4222" });
  const js = nc.jetstream();

  updateSubscribe(js);
  createSubscribe(js);
  deleteSubscribe(js);
}

module.exports.initSubscribe = initSubscribe;