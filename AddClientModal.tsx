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
import { dataService, Client } from '../services/dataService';
import { notificationService } from '../services/notificationService';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
}

export default function AddClientModal({ visible, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
  });

  const handleAddClient = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const newClient = await dataService.addClient({
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
      });

      // إرسال إشعار
      await notificationService.sendNotificationOnNewClient(formData.name);

      onAdd(newClient);
      setFormData({
        name: '',
        phone: '',
        region: '',
      });
      onClose();
      Alert.alert('نجح', 'تم إضافة العميل بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل إضافة العميل');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إضافة عميل جديد</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>اسم العميل *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="الاسم الكامل"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>رقم الهاتف *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="رقم الهاتف"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>المنطقة</Text>
              <TextInput
                style={styles.input}
                value={formData.region}
                onChangeText={(text) => setFormData({ ...formData, region: text })}
                placeholder="المنطقة الجغرافية"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
              <Text style={styles.btnText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={handleAddClient}>
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
