const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const notificationController = require('../controllers/notificationController');

// View all notifications
router.get('/', ensureAuthenticated, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', ensureAuthenticated, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', ensureAuthenticated, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', ensureAuthenticated, notificationController.deleteNotification);

module.exports = router;