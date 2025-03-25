const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Status API works');
});

module.exports = router; // 🔴 ВАЖЛИВО!