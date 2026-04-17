import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// تكوين الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7F',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async sendLocalNotification(title: string, body: string, delay: number = 0) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          badge: 1,
        },
        trigger: delay > 0 ? { seconds: delay } : null,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  async sendNotificationOnNewOperation(operationName: string) {
    await this.sendLocalNotification(
      '✅ عملية جديدة',
      `تم إضافة عملية جديدة: ${operationName}`,
      1
    );
  },

  async sendNotificationOnNewOrder(customerName: string) {
    await this.sendLocalNotification(
      '📦 طلبية جديدة',
      `طلبية جديدة من: ${customerName}`,
      1
    );
  },

  async sendNotificationOnNewClient(clientName: string) {
    await this.sendLocalNotification(
      '👤 عميل جديد',
      `عميل جديد: ${clientName}`,
      1
    );
  },

  async sendDailyReminder() {
    await this.sendLocalNotification(
      '📋 تذكير يومي',
      'لا تنسَ تحديث بيانات التطبيق اليوم',
      60 * 60 * 9 // في الساعة 9 صباحاً
    );
  },

  setupNotificationListeners() {
    // الاستماع إلى الإشعارات عند الضغط عليها
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification pressed:', response);
        // يمكن إضافة منطق للتنقل أو تنفيذ إجراء معين
      }
    );

    return subscription;
  },
};
