const COUNTER_API_BASE = 'https://api.counterapi.dev/v1';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  COUNTER_NAMESPACE: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS' && path.startsWith('/api/')) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Handle counter API proxy routes
    if (path.startsWith('/api/counter/')) {
      return handleCounterProxy(path, env.COUNTER_NAMESPACE);
    }

    // For all other routes, serve static assets (SPA)
    return env.ASSETS.fetch(request);
  },
};

async function handleCounterProxy(path: string, namespace: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    let apiUrl: string;

    switch (path) {
      case '/api/counter/visitors':
        apiUrl = `${COUNTER_API_BASE}/${namespace}/visitors`;
        break;
      case '/api/counter/visitors/up':
        apiUrl = `${COUNTER_API_BASE}/${namespace}/visitors/up`;
        break;
      case '/api/counter/checks':
        apiUrl = `${COUNTER_API_BASE}/${namespace}/checks`;
        break;
      case '/api/counter/checks/up':
        apiUrl = `${COUNTER_API_BASE}/${namespace}/checks/up`;
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown counter endpoint' }), {
          status: 404,
          headers: corsHeaders,
        });
    }

    const response = await fetch(apiUrl);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Counter API request failed' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
