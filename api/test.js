module.exports = (req, res) => {
  res.status(200).json({
    message: 'Root level test function working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers
  });
};