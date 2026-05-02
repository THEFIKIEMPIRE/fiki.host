exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { htmlCode } = JSON.parse(event.body);
    
    // 1. Create a brand new site in your account
    const createSiteRes = await fetch(`https://api.netlify.com/api/v1/sites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `fiki-project-${Date.now()}` })
    });

    const newSite = await createSiteRes.json();
    const newSiteId = newSite.id;

    // 2. Upload your HTML to that brand new site
    await fetch(`https://api.netlify.com/api/v1/sites/${newSiteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          "index.html": {
            "content": Buffer.from(htmlCode).toString('base64'),
            "encoding": "base64"
          }
        }
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        url: `https://${newSite.name}.netlify.app`,
        msg: "Success! Your new Empire site is ready." 
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
