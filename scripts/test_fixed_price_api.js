// Test runner for api/fixed_price.js
// Run with: node .\Clients\20250001hy\scripts\test_fixed_price_api.js

(async () => {
  const path = require('path');

  const modulePath = path.resolve(__dirname, '..', 'api', 'fixed_price.js');
  console.log('Loading handler from', modulePath);

  // Node in this workspace may treat .js as CommonJS; the handler file is ESM (export default).
  // To run tests reliably, create a temporary CommonJS wrapper by reading the file,
  // replacing the `export default async function handler` with a plain function
  // and exporting it via module.exports.
  const fs = require('fs');
  const original = fs.readFileSync(modulePath, 'utf8');
  // Remove ES module import lines (e.g., `import fetch from 'node-fetch';`)
  let wrapped = original.split(/\r?\n/).filter(line => !line.trim().startsWith('import ')).join('\n');

  if (wrapped.includes('export default')) {
    wrapped = wrapped.replace(/export default\s+async function handler\s*\(/, 'async function handler(');
    wrapped += '\n\nmodule.exports = handler;\n';
  } else {
    wrapped += '\n\nmodule.exports = typeof handler !== "undefined" ? handler : (exports && exports.default) ? exports.default : null;\n';
  }

  const tmpPath = path.resolve(__dirname, 'tmp_fixed_price_wrapper.cjs');
  fs.writeFileSync(tmpPath, wrapped, 'utf8');
  const handler = require(tmpPath);

  function makeRes() {
    let statusCode = 200;
    return {
      status(code) { statusCode = code; return this; },
      json(payload) {
        console.log('=> RESPONSE', statusCode, JSON.stringify(payload));
        return payload;
      }
    };
  }

  async function runTest(name, req, mockFetch) {
    console.log('\n--- TEST:', name);
    if (mockFetch !== undefined) global.fetch = mockFetch;
    else delete global.fetch;

    // ensure env exists for handler
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

  // 1) Method not allowed
  await runTest('Method Not Allowed (GET)', { method: 'GET' });

  // 2) Missing required fields -> expect 400
  await runTest('Missing Fields', { method: 'POST', body: {} }, async () => ({ ok: true, json: async () => ({}) }));

  // 3) Successful send (mock Mailjet returns success)
  await runTest('Success (Mailjet OK)', { method: 'POST', body: {
    first_name: 'Max', last_name: 'Mustermann', email: 'max@test', phone: '0123',
    service: 'TestService', weekly: '1', months: '1', street: 'Str', house: '1', zip: '10000', city: 'Berlin'
  }}, async (url, opts) => ({ ok: true, json: async () => ({ Messages: [{ Status: 'success' }] }) }));

  // 4) Mailjet API responds but with non-ok -> expect 500
  await runTest('Mailjet returns non-ok', { method: 'POST', body: {
    first_name: 'Max', last_name: 'Mustermann', email: 'max@test', phone: '0123',
    service: 'TestService', weekly: '1', months: '1', street: 'Str', house: '1', zip: '10000', city: 'Berlin'
  }}, async (url, opts) => ({ ok: false, json: async () => ({ Error: 'bad request' }) }));

  // 5) fetch throws (network) -> expect 500
  await runTest('Fetch throws', { method: 'POST', body: {
    first_name: 'Max', last_name: 'Mustermann', email: 'max@test', phone: '0123',
    service: 'TestService', weekly: '1', months: '1', street: 'Str', house: '1', zip: '10000', city: 'Berlin'
  }}, async () => { throw new Error('network error simulated'); });

  console.log('\nAll tests finished');

})().catch(e => { console.error('Test runner error:', e); process.exit(1); });
