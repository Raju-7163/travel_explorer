export function getHealth(req, res) {
  res.json({
    success: true,
    status: "ok",
    service: "India Tourism Explorer API",
    uptime: process.uptime()
  });
}
