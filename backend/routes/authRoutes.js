const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Auth API works');
});

module.exports = router; // 🔴 ВАЖЛИВО!