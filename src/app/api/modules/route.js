import Anthropic from '@anthropic-ai/sdk';

export async function GET(request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return Response.json({ error: 'API Key is required' }, { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const models = await anthropic.models.list({ limit: 20 });
    return Response.json(models);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// CORS対応
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}