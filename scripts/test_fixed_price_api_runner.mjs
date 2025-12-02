import handler from '../api/fixed_price.js';

function makeRes() {
  let statusCode = 200;
  return {
    status(code) { statusCode = code; return this; },
    json(payload) { console.log('=> RESPONSE', statusCode, JSON.stringify(payload)); return payload; }
  };
}

async function runTest(name, req, mockFetch) {
  console.log('\n--- TEST:', name);
  if (mockFetch !== undefined) globalThis.fetch = mockFetch;
  else delete globalThis.fetch;

  process.env.MJ_PUBLIC = process.env.MJ_PUBLIC || 'MJ_PUBLIC_TEST';
  process.env.MJ_PRIVATE = process.env.MJ_PRIVATE || 'MJ_PRIVATE_TEST';
  process.env.EMAIL_FROM = process.env.EMAIL_FROM || 'from@example.test';
  process.env.EMAIL_TO = process.env.EMAIL_TO || 'to@example.test';

  try {
    const res = makeRes();
    await handler(req, res);
  } catch (err) {
    console.error('Handler threw:', err && err.message ? err.message : err);
  }
}

// Run tests sequentially
(async () => {
  await runTest('Method Not Allowed (GET)', { method: 'GET' });

  await runTest('Missing Fields', { method: 'POST', body: {} }, async () => ({ ok: true, json: async () => ({}) }));

  await runTest('Success (Mailjet OK)', { method: 'POST', body: {
    first_name: 'Max', last_name: 'Mustermann', email: 'max@test', phone: '0123',
    service: 'TestService', weekly: '1', months: '1', street: 'Str', house: '1', zip: '10000', city: 'Berlin'
  }}, async (url, opts) => ({ ok: true, json: async () => ({ Messages: [{ Status: 'success' }] }) }));

  await runTest('Mailjet returns non-ok', { method: 'POST', body: {
    first_name: 'Max', last_name: 'Mustermann', email: 'max@test', phone: '0123',
    service: 'TestService', weekly: '1', months: '1', street: 'Str', house: '1', zip: '10000', city: 'Berlin'
  }}, async (url, opts) => ({ ok: false, json: async () => ({ Error: 'bad request' }) }));

  await runTest('Fetch throws', { method: 'POST', body: {
    first_name: 'Max', last_name: 'Mustermann', email: 'max@test', phone: '0123',
    service: 'TestService', weekly: '1', months: '1', street: 'Str', house: '1', zip: '10000', city: 'Berlin'
  }}, async () => { throw new Error('network error simulated'); });

  console.log('\nAll tests finished');
})();
