import {IP2Location} from 'ip2location-nodejs';
import path from 'path';
import {z} from 'zod';

export let ip2locationDB: IP2Location;
export let ip2locationV6DB: IP2Location;

export const loadIP2LocationDB = async () => {
  ip2locationDB = new IP2Location();
  ip2locationDB.open(
    path.join(process.cwd(), 'ext', 'IP2LOCATION-LITE-DB1.BIN')
  );

  ip2locationV6DB = new IP2Location();
  ip2locationV6DB.open(
    path.join(process.cwd(), 'ext', 'IP2LOCATION-LITE-DB1.IPV6.BIN')
  );
};

export const getCountryCode = async (ip: string) => {
  try {
    const ipResult = await z.string().ip().parseAsync(ip);
    return ipResult.includes(':')
      ? await ip2locationV6DB.getCountryShortAsync(ipResult)
      : await ip2locationDB.getCountryShortAsync(ipResult);
  } catch (_err) {
    return 'XX';
  }
};
