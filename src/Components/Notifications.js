import React, { useEffect, useState, useCallback } from "react";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../Services/api";
import "./Notifications.css";

function Notifications({ userEmail }) {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (!userEmail) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getNotifications(userEmail);
            const notificationsData = response.notifications || [];
            setNotifications(notificationsData);
            const unread = notificationsData.filter((n) => !n.isRead).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setError("Failed to load notifications. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    useEffect(() => {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 30000);
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMins < 60) {
            return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (notifications.length === 0) return;
        try {
            await markAllNotificationsAsRead(userEmail);
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };

    const handlePayNow = (notification) => {
        alert(`Redirecting to payment for: ${notification.metadata?.serviceTitle || "service"}`);
    };

    return (
        <div className="notification-container">
            <button
                className="notification-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <span className="notification-icon">🔔</span>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>
            {isOpen && (
                <div className="notification-box">
                    <div className="notification-header">
                        <h3>Your Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                className="mark-all-read-btn"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    {loading && <p className="loading-message">Loading notifications...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && notifications.length === 0 && (
                        <p className="no-notifications">No notifications yet.</p>
                    )}
                    {!loading && !error && notifications.length > 0 && (
                        <ul className="notification-list">
                            {notifications.map((notif) => {
                                const {
                                    _id,
                                    message,
                                    createdAt,
                                    isRead,
                                    metadata = {},
                                } = notif;
                                return (
                                    <li key={_id} className={`notification-item ${isRead ? "read" : "unread"}`}>
                                        <div className="notification-content">
                                            <div className="notif-message">{message}</div>
                                            <div className="notif-details">
                                                {metadata.workerName && (
                                                    <div className="notif-detail">
                                                        <span className="detail-label">Worker:</span>
                                                        <span className="detail-value">{metadata.workerName}</span>
                                                    </div>
                                                )}
                                                {metadata.serviceTitle && (
                                                    <div className="notif-detail">
                                                        <span className="detail-label">Service:</span>
                                                        <span className="detail-value">{metadata.serviceTitle}</span>
                                                    </div>
                                                )}
                                                {metadata.bookingDate && (
                                                    <div className="notif-detail">
                                                        <span className="detail-label">Date:</span>
                                                        <span className="detail-value">
                                                            {new Date(metadata.bookingDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                                {metadata.bookingTime && (
                                                    <div className="notif-detail">
                                                        <span className="detail-label">Time:</span>
                                                        <span className="detail-value">{metadata.bookingTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="notif-footer">
                                                <small className="notif-time">{formatDate(createdAt)}</small>
                                                <div>
                                                    {!isRead && (
                                                        <button
                                                            className="mark-read-btn"
                                                            onClick={() => handleMarkAsRead(_id)}
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                    <button
                                                        className="pay-now-btn"
                                                        onClick={() => handlePayNow(notif)}
                                                    >
                                                        Pay Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default Notifications;
