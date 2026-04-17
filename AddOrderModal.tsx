import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { dataService, Order } from '../services/dataService';
import { notificationService } from '../services/notificationService';

interface AddOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (order: Order) => void;
}

export default function AddOrderModal({ visible, onClose, onAdd }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    phone: '',
    crop: '',
    requested: '',
    delivered: '',
  });

  const handleAddOrder = async () => {
    if (!formData.customer || !formData.crop || !formData.requested) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const newOrder = await dataService.addOrder({
        date: formData.date,
        customer: formData.customer,
        phone: formData.phone,
        crop: formData.crop,
        requested: parseInt(formData.requested),
        delivered: parseInt(formData.delivered) || 0,
      });

      // إرسال إشعار
      await notificationService.sendNotificationOnNewOrder(formData.customer);

      onAdd(newOrder);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        customer: '',
        phone: '',
        crop: '',
        requested: '',
        delivered: '',
      });
      onClose();
      Alert.alert('نجح', 'تم إضافة الطلبية بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل إضافة الطلبية');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إضافة طلبية جديدة</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>التاريخ</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>العميل *</Text>
              <TextInput
                style={styles.input}
                value={formData.customer}
                onChangeText={(text) => setFormData({ ...formData, customer: text })}
                placeholder="اسم العميل"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>الهاتف</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="رقم الهاتف"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>الصنف *</Text>
              <TextInput
                style={styles.input}
                value={formData.crop}
                onChangeText={(text) => setFormData({ ...formData, crop: text })}
                placeholder="اسم الصنف"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>المطلوب *</Text>
              <TextInput
                style={styles.input}
                value={formData.requested}
                onChangeText={(text) => setFormData({ ...formData, requested: text })}
                placeholder="العدد"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>المسلم</Text>
              <TextInput
                style={styles.input}
                value={formData.delivered}
                onChangeText={(text) => setFormData({ ...formData, delivered: text })}
                placeholder="العدد"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
              <Text style={styles.btnText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={handleAddOrder}>
              <Text style={styles.btnTextAdd}>إضافة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DBD3',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#162B1E',
  },
  closeBtn: {
    fontSize: 24,
    color: '#8A9A8A',
  },
  form: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3D5A3D',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0DBD3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'System',
    color: '#1A2E1A',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0DBD3',
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#E0DBD3',
  },
  btnAdd: {
    backgroundColor: '#2D6B45',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3D5A3D',
  },
  btnTextAdd: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
