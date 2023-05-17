export default function handler(req, res) {
    res.status(200).json({ name: req.body.type });
    // res.status(502).json({ error: 'Not found' });
}