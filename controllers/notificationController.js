const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.render('notifications', {
            title: 'Notifications - CostMate',
            user: req.user,
            notifications
        });
    } catch (err) {
        console.error('Error getting notifications:', err);
        req.flash('error_msg', 'Error loading notifications');
        res.redirect('/dashboard');
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { isRead: true }
        );
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ error: 'Error marking notification as read' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        res.status(500).json({ error: 'Error marking notifications as read' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({ error: 'Error deleting notification' });
    }
};

exports.createNotification = async (userId, type, title, message) => {
    try {
        const notification = new Notification({
            user: userId,
            type,
            title,
            message
        });
        
        await notification.save();
        return notification;
    } catch (err) {
        console.error('Error creating notification:', err);
        return null;
    }
};