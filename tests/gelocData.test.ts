import test from 'node:test';
import {getCountryCode, loadIP2LocationDB} from '../app/utils/gelocUtils';
import {assert} from 'node:console';

(async () => {
  await loadIP2LocationDB();
  test('geloc country code testing valid ipv4', async () => {
    const countryCode = await getCountryCode('217.92.217.67');
    assert(countryCode.length === 2, 'not a valid country code');
  });

  test('geloc country code testing valid ipv6', async () => {
    const countryCode = await getCountryCode(
      '2003:f4:bf2d:8000:2d5e:4b94:605f:8a81'
    );
    assert(countryCode.length === 2, 'not a valid country code');
  });

  test('geloc country code testing invalid ipv4', async () => {
    const countryCode = await getCountryCode('178.4.222');
    assert(countryCode.length === 2, 'not a valid country code');
  });

  test('geloc country code testing invalid ipv6', async () => {
    const countryCode = await getCountryCode('2003:f4:bf2d2d5e:4b94:605f:8a81');
    assert(countryCode.length === 2, 'not a valid country code');
  });
})();
