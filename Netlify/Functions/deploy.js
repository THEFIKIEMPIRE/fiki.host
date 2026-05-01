<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIKI.host</title>
    <style>
        body { background: #0b0e14; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding: 40px; }
        .card { background: #1a1f29; padding: 25px; border-radius: 12px; width: 100%; max-width: 450px; border: 1px solid #2d333f; }
        textarea { width: 100%; height: 180px; background: #0b0e14; border: 1px solid #2d333f; color: #10b981; border-radius: 8px; padding: 10px; box-sizing: border-box; }
        button { width: 100%; padding: 15px; margin-top: 15px; background: #3b82f6; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; }
        #status { margin-top: 20px; display: none; text-align: center; }
    </style>
</head>
<body>
    <h1>🚀 FIKI.host</h1>
    <div class="card">
        <textarea id="htmlInput" placeholder="Paste your HTML here..."></textarea>
        <button onclick="deployProject()">Launch Project</button>
        <div id="status"></div>
    </div>

    <script>
        async function deployProject() {
            const htmlCode = document.getElementById('htmlInput').value;
            const status = document.getElementById('status');
            status.innerHTML = "Working...";
            status.style.display = "block";

            try {
                // This talks to your folder path exactly as it appears in your screenshot
                const response = await fetch('/.netlify/functions/deploy', {
                    method: 'POST',
                    body: JSON.stringify({ htmlCode })
                });
                const data = await response.json();
                if (data.url) {
                    status.innerHTML = `✅ <a href="${data.url}" target="_blank" style="color: #10b981;">CLICK TO VIEW SITE</a>`;
                } else {
                    status.innerHTML = "❌ Setup error. Check Netlify variables.";
                }
            } catch (e) {
                status.innerHTML = "❌ Connection error.";
            }
        }
    </script>
</body>
</html>
