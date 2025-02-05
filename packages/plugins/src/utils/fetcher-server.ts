import { Cache } from '../Cache';
import { runFetcher } from '../Fetcher';
import { isAddress, networks } from '@sonarwatch/portfolio-core';
import { fetchers, getCache } from '../';
import express from 'express';

export interface FetcherServerConfig {
  port: number;
  cache: boolean;
}

export function startServer(config: FetcherServerConfig) {
  const cache = getCache();
  const app = express();

  app.get('/fetch/:fetcherId/:address', async (req, res) => {
    const { fetcherId, address } = req.params;

    let fOwner = address;
    const fetcher = fetchers.find((f) => f.id === fetcherId);
    if (!fetcher) {
      console.error(`Fetcher cannot be found: ${fetcherId}`);
      process.exit(1);
    }

    const network = networks[fetcher.networkId];
    if (!isAddress(fOwner, network.addressSystem)) {
      fOwner = `0x${fOwner}`;
    }
    if (!isAddress(fOwner, network.addressSystem)) {
      console.error(`Owner address is not valid: ${address}`);
      process.exit(1);
    }

    const cache = getCache();

    console.log('Fetching...');
    const result = await runFetcher(fOwner, fetcher, cache);
    console.log('Fetched!');

    res.json(result);
  });

  return app.listen(config.port, '0.0.0.0', () => {
    console.log(`Fetcher service running on port ${config.port}`);
  });
}
