const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { htmlCode } = JSON.parse(event.body);

    // Send the user's code to Netlify to create a new site
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          "index.html": Buffer.from(htmlCode).toString('base64')
        }
      })
    });

    const data = await response.json();

    // Send the new URL back to your dashboard
    return {
      statusCode: 200,
      body: JSON.stringify({ url: `https://${data.name}.netlify.app` })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
