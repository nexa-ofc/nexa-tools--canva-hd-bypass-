const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { designUrl } = req.body;
  if (!designUrl) return res.status(400).json({ error: 'URL required' });

  try {
    const match = designUrl.match(/design\/([a-zA-Z0-9_-]+)/);
    if (!match) return res.status(400).json({ error: 'Invalid URL' });
    const designId = match[1];

    const exportRes = await axios.post('https://www.canva.com/_ajax/design/export', {
      designId: designId,
      format: 'png',
      quality: 100
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (exportRes.data && exportRes.data.url) {
      return res.status(200).json({
        success: true,
        downloadUrl: exportRes.data.url
      });
    } else {
      return res.status(400).json({ error: 'Extraction failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', detail: error.message });
  }
}
