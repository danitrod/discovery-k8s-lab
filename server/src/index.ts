import fastify, { FastifyRequest } from 'fastify';
import fastifyStatic from 'fastify-static';
import { IamAuthenticator } from 'ibm-watson/auth';
import DiscoveryV1 from 'ibm-watson/discovery/v1';
import path from 'path';

// Check for credentials
if (!process.env.DISCOVERY_API_KEY || !process.env.DISCOVERY_URL) {
  console.error(
    'Please provide the DISCOVERY_API_KEY and DISCOVERY_URL environment variables to run the app.'
  );
  process.exit(1);
}

// Setup Discovery service
const discovery = new DiscoveryV1({
  version: '2019-04-30',
  authenticator: new IamAuthenticator({
    apikey: process.env.DISCOVERY_API_KEY,
  }),
  url: process.env.DISCOVERY_URL,
});

const server = fastify({ logger: { level: 'info', prettyPrint: true } });

// Serve front end
server.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
});

// Add query post request
type QueryRequest = FastifyRequest<{ Body: { query: string } }>;
server.post('/api/query', async (request: QueryRequest) => {
  console.log('New request from', request.hostname);
  let response;
  try {
    const discoveryResponse = await discovery.query({
      environmentId: 'system',
      collectionId: 'news-en',
      naturalLanguageQuery: request.body.query,
      count: 10,
    });
    response = { err: false, results: discoveryResponse.result.results };
  } catch (err) {
    console.error(err);
    response = { err: true };
  }
  return response;
});

// Run
const port = process.env.PORT || 7000;
server.listen(port, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
