const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const notificationController = require('../controllers/notificationController');

// Get all notifications
router.get('/', ensureAuthenticated, notificationController.getNotifications);

// Mark as read
router.put('/:id/read', ensureAuthenticated, notificationController.markAsRead);

// Mark all as read
router.put('/read-all', ensureAuthenticated, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', ensureAuthenticated, notificationController.deleteNotification);

module.exports = router;

