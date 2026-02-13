export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { question } = req.body;

        // Webhook URL
        const n8nUrl = 'https://dhairya78.app.n8n.cloud/webhook/question-webhook';

        // Call n8n using native fetch (no axios dependency needed)
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            throw new Error(`n8n responded with ${response.status}`);
        }

        const data = await response.json();

        // Return n8n response
        res.status(200).json(data);
    } catch (error) {
        console.error('n8n Proxy Error:', error.message);
        res.status(500).json({
            error: 'Failed to connect to n8n',
            details: error.message
        });
    }
}
