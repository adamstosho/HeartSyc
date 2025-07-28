module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    message: 'Simple function working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    env: process.env.NODE_ENV || 'not set'
  });
};