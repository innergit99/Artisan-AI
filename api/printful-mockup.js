// Vercel Serverless Function - Printful Mockup Proxy
// Bypasses CORS by making server-side requests to Printful API

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_PRINTFUL_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Printful API key not configured' });
  }

  const { variantId, placement, imageUrl, format = 'jpg', width = 1000 } = req.body;

  if (!variantId || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields: variantId, imageUrl' });
  }

  try {
    // Create mockup task - Printful expects 'id' not 'variant_ids'
    const createResponse = await fetch('https://api.printful.com/mockup-generator/create-task', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: parseInt(variantId),
        format: format || 'jpg',
        width: width || 1000
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Printful create task failed:', createResponse.status, errorText);
      return res.status(createResponse.status).json({ 
        error: 'Failed to create mockup task', 
        details: errorText 
      });
    }

    const createData = await createResponse.json();
    const taskKey = createData.result.task_key;

    // Poll for completion (max 30 seconds)
    let mockupUrl = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts && !mockupUrl) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!pollResponse.ok) {
        attempts++;
        continue;
      }

      const pollData = await pollResponse.json();
      
      if (pollData.result.status === 'completed') {
        mockupUrl = pollData.result.mockups[0].mockup_url;
        break;
      }
      
      if (pollData.result.status === 'failed') {
        return res.status(500).json({ error: 'Mockup generation failed' });
      }
      
      attempts++;
    }

    if (!mockupUrl) {
      return res.status(504).json({ error: 'Mockup generation timeout' });
    }

    return res.status(200).json({ 
      success: true, 
      mockupUrl,
      taskKey 
    });

  } catch (error) {
    console.error('Printful proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
