import test from 'node:test';
import assert from 'node:assert/strict';
import { registrationSchema, password, noteSchema } from '../src/lib/validation';
import { eventDate, newToken, tokenHash, secretMatches, validToken } from '../src/lib/security';
import { body, api, json } from '../src/lib/http';

const valid = {first_name:' Maria ',last_name:'Smith',organization:'Test',role:'Partner',email:'MARIA@EXAMPLE.TEST',phone:'+263123',consent:true};
test('registration normalizes names and email and requires consent, valid contact information and bounded text', () => {
  const parsed = registrationSchema.parse(valid);
  assert.equal(parsed.first_name,'Maria'); assert.equal(parsed.email,'maria@example.test');
  for (const patch of [{first_name:' '},{email:'bad'},{consent:false},{consent:undefined},{phone:''},{role:'Admin'},{dietary_requirements:'x'.repeat(501)}]) assert.equal(registrationSchema.safeParse({...valid,...patch}).success,false);
});
test('passwords enforce bcrypt byte limits; notes require a real session ID', () => {
  assert.equal(password.safeParse('short').success,false);
  assert.equal(password.safeParse('😀'.repeat(30)).success,false);
  assert.equal(password.safeParse('long enough test password').success,true);
  assert.equal(noteSchema.safeParse({session_id:'not-a-uuid',note_text:'A meaningful note'}).success,false);
});
test('opaque tokens have sufficient entropy and never equal their stored hashes', () => {
  const tokens = Array.from({length:1000},newToken);
  assert.equal(new Set(tokens).size,1000);
  assert(tokens.every(t=>validToken(t)&&tokenHash(t)!==t));
  assert.equal(secretMatches('OAK-STAFF-2026',undefined),false);
  assert.equal(secretMatches('wrong','configured'),false);
  assert.equal(secretMatches('configured','configured'),true);
});
test('Harare date changes at 22:00 UTC rather than UTC midnight', () => {
  assert.equal(eventDate(new Date('2026-11-09T21:59:59Z')),'2026-11-09');
  assert.equal(eventDate(new Date('2026-11-09T22:00:00Z')),'2026-11-10');
});
test('malformed, oversized, cross-origin and invalid requests return controlled client errors', async () => {
  const handler=api(async req=>json(await body(req,registrationSchema)));
  const call=(text:string,headers:Record<string,string>={})=>handler(new Request('https://event.test/api/register',{method:'POST',headers:{'content-type':'application/json',...headers},body:text}));
  assert.equal((await call('{bad')).status,400);
  assert.equal((await call(JSON.stringify({...valid,first_name:' '}))).status,400);
  assert.equal((await call('x'.repeat(20000))).status,413);
  assert.equal((await call(JSON.stringify(valid),{origin:'https://other.test'})).status,403);
  assert.equal((await call(JSON.stringify(valid),{'content-type':'text/plain'})).status,415);
  assert.equal((await call(JSON.stringify(valid))).status,200);
});
