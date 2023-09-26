import test from "node:test";
import { getCountryCode, loadIP2LocationDB } from "../utils/gelocUtils";


(async () => {
  await loadIP2LocationDB();
  test("geloc country code testing valid ipv4", async (t) => {
    const countryCode = await getCountryCode("217.92.217.67");
    console.log(countryCode);
  });

  test("geloc country code testing valid ipv6", async (t) => {
    const countryCode = await getCountryCode("2003:f4:bf2d:8000:2d5e:4b94:605f:8a81");
    console.log(countryCode);
  });

  test("geloc country code testing invalid ipv4", async (t) => {
    const countryCode = await getCountryCode("178.4.222");
    console.log(countryCode);
  });

  test("geloc country code testing invalid ipv6", async (t) => {
    const countryCode = await getCountryCode("2003:f4:bf2d2d5e:4b94:605f:8a81");
    console.log(countryCode);
  });
})();