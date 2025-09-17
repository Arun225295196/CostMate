const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const dashboardController = require('../controllers/dashboardController');

// Dashboard
router.get('/', ensureAuthenticated, dashboardController.getDashboard);

module.exports = router;