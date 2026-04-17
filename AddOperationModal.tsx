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
import { dataService, Operation } from '../services/dataService';

interface AddOperationModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (operation: Operation) => void;
  clients: any[];
  items: any[];
}

export default function AddOperationModal({
  visible,
  onClose,
  onAdd,
  clients,
  items,
}: AddOperationModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    crop: '',
    planted: '',
    fulfilled: '',
    customer: '',
    phone: '',
  });

  const handleAddOperation = async () => {
    if (!formData.crop || !formData.planted || !formData.fulfilled || !formData.customer) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const newOperation = await dataService.addOperation({
        date: formData.date,
        crop: formData.crop,
        planted: parseInt(formData.planted),
        fulfilled: parseInt(formData.fulfilled),
        customer: formData.customer,
        phone: formData.phone,
      });

      onAdd(newOperation);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        crop: '',
        planted: '',
        fulfilled: '',
        customer: '',
        phone: '',
      });
      onClose();
      Alert.alert('نجح', 'تم إضافة العملية بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل إضافة العملية');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إضافة عملية جديدة</Text>
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
              <Text style={styles.label}>الصنف *</Text>
              <TextInput
                style={styles.input}
                value={formData.crop}
                onChangeText={(text) => setFormData({ ...formData, crop: text })}
                placeholder="اسم الصنف"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>المزروعة *</Text>
              <TextInput
                style={styles.input}
                value={formData.planted}
                onChangeText={(text) => setFormData({ ...formData, planted: text })}
                placeholder="العدد"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>المشبعة *</Text>
              <TextInput
                style={styles.input}
                value={formData.fulfilled}
                onChangeText={(text) => setFormData({ ...formData, fulfilled: text })}
                placeholder="العدد"
                keyboardType="numeric"
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
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
              <Text style={styles.btnText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={handleAddOperation}>
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
