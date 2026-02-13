export const config = {
    runtime: 'edge', // Use Edge Runtime for better performance and native fetch
};

export default async function handler(request) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle Preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: corsHeaders
        });
    }

    try {
        const body = await request.json();
        const n8nUrl = 'https://dhairya78.app.n8n.cloud/webhook/question-webhook';

        // Forward request to n8n
        const n8nResponse = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Get response from n8n
        const data = await n8nResponse.json();

        // Return response to frontend
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Proxy Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to connect to n8n', details: error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
