# 📱 تعليمات التثبيت والتشغيل

## الخطوة 1: تثبيت المتطلبات

### على Windows و Mac و Linux

1. **تثبيت Node.js**
   - زيارة https://nodejs.org/
   - تحميل النسخة LTS
   - اتباع خطوات التثبيت

2. **التحقق من التثبيت**
   ```bash
   node --version
   npm --version
   ```

## الخطوة 2: تثبيت Expo CLI (اختياري)

```bash
npm install -g expo-cli
```

## الخطوة 3: تثبيت المشروع

```bash
# الانتقال إلى مجلد المشروع
cd mashatl-mobile

# تثبيت المكتبات
npm install
```

## الخطوة 4: التشغيل

### على الويب (الأسهل)
```bash
npm run web
```

### على Android
```bash
# يتطلب تثبيت Android Studio و Android SDK
npm run android
```

### على iOS (macOS فقط)
```bash
npm run ios
```

## الخطوة 5: استخدام Expo Go (للاختبار السريع)

1. **تحميل تطبيق Expo Go**
   - من App Store (iOS)
   - من Google Play (Android)

2. **تشغيل المشروع**
   ```bash
   npm start
   ```

3. **مسح رمز QR**
   - افتح Expo Go
   - امسح رمز QR الظاهر في الطرفية

## 🚀 بناء التطبيق للإنتاج

### بناء ملف APK (Android)
```bash
# يتطلب Expo Account
eas build --platform android
```

### بناء ملف IPA (iOS)
```bash
eas build --platform ios
```

## 🔧 استكشاف الأخطاء

### المشكلة: "npm: command not found"
**الحل**: تأكد من تثبيت Node.js بشكل صحيح

### المشكلة: "Port 19000 already in use"
**الحل**: 
```bash
# قتل العملية على المنفذ
lsof -ti:19000 | xargs kill -9
```

### المشكلة: "Module not found"
**الحل**:
```bash
# إعادة تثبيت المكتبات
rm -rf node_modules
npm install
```

## 📚 موارد إضافية

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

للدعم الفني، يرجى التواصل مع فريق التطوير.
