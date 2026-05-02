exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { htmlCode } = JSON.parse(event.body);
    
    // This tells Netlify to create the site AND upload the file at the same time
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/deploys`, {
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

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        url: `https://${data.name}.netlify.app`,
        msg: "Empire Site Created! If you see 404, wait 10 seconds and refresh." 
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
