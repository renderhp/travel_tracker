export const sendNotification = async (title, message, url = null) => {
    if (Notification.permission === 'granted') {
        createNotification(title, message, url);
    } else {
        console.warn('Notification permission was previously denied. Enable in the settings!');
    }
};

export const requestNotificationPermission = async () => {
    if (Notification.permission === 'granted') {
        return true;
    }
    await Notification.requestPermission();
};

// Helper function to create and send the notification
const createNotification = (title, message, url) => {
    const notification = new Notification(title, {
        body: message,
        icon: `${process.env.PUBLIC_URL}/favicon.ico`,
    });

    if (url) {
        notification.onclick = () => {
            window.open(url, '_blank');
        };
    }
    console.log(notification);
};

window.requestNotificationPermission = requestNotificationPermission;
window.sendNotification = sendNotification;