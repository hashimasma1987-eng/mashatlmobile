import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { dataService, Operation, Order, Client, Item } from '../../services/dataService';
import { notificationService } from '../../services/notificationService';
import AddOperationModal from '../../components/AddOperationModal';
import AddOrderModal from '../../components/AddOrderModal';
import AddClientModal from '../../components/AddClientModal';
import SearchBar from '../../components/SearchBar';
import AdvancedStats from '../../components/AdvancedStats';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EDE6',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#162B1E',
  },
  header: {
    backgroundColor: '#162B1E',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  navTabs: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0DBD3',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  navTab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  navTabActive: {
    borderBottomColor: '#2D6B45',
  },
  navTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A9A8A',
  },
  navTabTextActive: {
    color: '#2D6B45',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    width: (width - 32) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0DBD3',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D6B45',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#8A9A8A',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0DBD3',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A2E1A',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  cardActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F0EDE6',
  },
  cardActionBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D6B45',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    fontSize: 12,
  },
  cardLabel: {
    color: '#8A9A8A',
    fontSize: 11,
  },
  badge: {
    backgroundColor: '#E8F5EC',
    color: '#2D6B45',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    backgroundColor: '#162B1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  footerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    fontSize: 10,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.1)',
    backgroundColor: 'rgba(255,255,255,.05)',
    color: 'rgba(255,255,255,.6)',
  },
  addBtn: {
    position: 'absolute',
    bottom: 70,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D6B45',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addBtnText: {
    fontSize: 24,
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    color: '#8A9A8A',
  },
  emptyStateText: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
});

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('summary');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [operationModalVisible, setOperationModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [clientModalVisible, setClientModalVisible] = useState(false);

  useEffect(() => {
    loadAllData();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        notificationService.setupNotificationListeners();
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const loadAllData = async () => {
    try {
      const [ops, ords, cls, itms] = await Promise.all([
        dataService.getOperations(),
        dataService.getOrders(),
        dataService.getClients(),
        dataService.getItems(),
      ]);
      setOperations(ops);
      setOrders(ords);
      setClients(cls);
      setItems(itms);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handleDeleteOperation = (id: string) => {
    Alert.alert('تأكيد', 'هل تريد حذف هذه العملية؟', [
      { text: 'إلغاء', onPress: () => {} },
      {
        text: 'حذف',
        onPress: async () => {
          await dataService.deleteOperation(id);
          await loadAllData();
          Alert.alert('نجح', 'تم حذف العملية');
        },
      },
    ]);
  };

  const handleDeleteOrder = (id: string) => {
    Alert.alert('تأكيد', 'هل تريد حذف هذه الطلبية؟', [
      { text: 'إلغاء', onPress: () => {} },
      {
        text: 'حذف',
        onPress: async () => {
          await dataService.deleteOrder(id);
          await loadAllData();
          Alert.alert('نجح', 'تم حذف الطلبية');
        },
      },
    ]);
  };

  const handleDeleteClient = (id: string) => {
    Alert.alert('تأكيد', 'هل تريد حذف هذا العميل؟', [
      { text: 'إلغاء', onPress: () => {} },
      {
        text: 'حذف',
        onPress: async () => {
          await dataService.deleteClient(id);
          await loadAllData();
          Alert.alert('نجح', 'تم حذف العميل');
        },
      },
    ]);
  };

  const exportToExcel = async (sheetName: string, sheetData: any[]) => {
    try {
      const ws = XLSX.utils.json_to_sheet(sheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
      const fileName = `مشتل_${sheetName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'تصدير البيانات',
      });

      Alert.alert('نجح', 'تم التصدير بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل التصدير');
      console.error('Export error:', error);
    }
  };

  const exportAll = async () => {
    try {
      const wb = XLSX.utils.book_new();
      const names: any = {
        operations: 'التشغيل',
        orders: 'الطلبيات',
        clients: 'العملاء',
        items: 'الأصناف',
      };

      if (operations.length > 0) {
        const ws = XLSX.utils.json_to_sheet(operations);
        XLSX.utils.book_append_sheet(wb, ws, names.operations);
      }
      if (orders.length > 0) {
        const ws = XLSX.utils.json_to_sheet(orders);
        XLSX.utils.book_append_sheet(wb, ws, names.orders);
      }
      if (clients.length > 0) {
        const ws = XLSX.utils.json_to_sheet(clients);
        XLSX.utils.book_append_sheet(wb, ws, names.clients);
      }
      if (items.length > 0) {
        const ws = XLSX.utils.json_to_sheet(items);
        XLSX.utils.book_append_sheet(wb, ws, names.items);
      }

      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
      const fileName = `مشتل_كامل_${new Date().toISOString().split('T')[0]}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'تصدير البيانات',
      });

      Alert.alert('نجح', 'تم التصدير بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل التصدير');
      console.error('Export all error:', error);
    }
  };

  const filteredOperations = operations.filter(
    (op) =>
      op.crop.includes(searchText) ||
      op.customer.includes(searchText) ||
      op.date.includes(searchText)
  );

  const filteredOrders = orders.filter(
    (ord) =>
      ord.customer.includes(searchText) ||
      ord.crop.includes(searchText) ||
      ord.date.includes(searchText)
  );

  const filteredClients = clients.filter(
    (cl) => cl.name.includes(searchText) || cl.phone.includes(searchText)
  );

  const renderSummary = () => (
    <>
      <View style={styles.statGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{operations.length}</Text>
          <Text style={styles.statLabel}>عمليات</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>طلبيات</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{clients.length}</Text>
          <Text style={styles.statLabel}>عملاء</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>أصناف</Text>
        </View>
      </View>

      <AdvancedStats operations={operations} orders={orders} />

      {operations.length > 0 ? (
        operations.slice(0, 3).map((op) => (
          <View key={op.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{op.crop}</Text>
              <Text style={styles.badge}>{op.fulfilled}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>{op.date}</Text>
              <Text style={styles.cardLabel}>{op.customer}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لا توجد بيانات</Text>
        </View>
      )}
    </>
  );

  const renderOperations = () => (
    <>
      <SearchBar
        placeholder="بحث بالصنف أو العميل..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredOperations.length > 0 ? (
        filteredOperations.map((op) => (
          <View key={op.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{op.crop}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardActionBtn}
                  onPress={() => handleDeleteOperation(op.id)}
                >
                  <Text style={styles.cardActionBtnText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>التاريخ: {op.date}</Text>
              <Text style={styles.cardLabel}>المزروعة: {op.planted}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>المشبعة: {op.fulfilled}</Text>
              <Text style={styles.cardLabel}>{op.customer}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لا توجد عمليات</Text>
        </View>
      )}
    </>
  );

  const renderOrders = () => (
    <>
      <SearchBar
        placeholder="بحث بالعميل أو الصنف..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredOrders.length > 0 ? (
        filteredOrders.map((ord) => (
          <View key={ord.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{ord.customer}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardActionBtn}
                  onPress={() => handleDeleteOrder(ord.id)}
                >
                  <Text style={styles.cardActionBtnText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>الصنف: {ord.crop}</Text>
              <Text style={styles.badge}>
                {ord.delivered}/{ord.requested}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>التاريخ: {ord.date}</Text>
              <Text style={styles.cardLabel}>{ord.phone}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لا توجد طلبيات</Text>
        </View>
      )}
    </>
  );

  const renderClients = () => (
    <>
      <SearchBar
        placeholder="بحث بالاسم أو الهاتف..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredClients.length > 0 ? (
        filteredClients.map((cl) => (
          <View key={cl.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{cl.name}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardActionBtn}
                  onPress={() => handleDeleteClient(cl.id)}
                >
                  <Text style={styles.cardActionBtnText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>{cl.phone}</Text>
              <Text style={styles.badge}>{cl.region}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لا توجد عملاء</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#162B1E" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>مشتل التنمية الحديثة</Text>
        </View>

        <View style={styles.navTabs}>
          {['summary', 'operations', 'orders', 'clients'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.navTab, activeTab === tab && styles.navTabActive]}
              onPress={() => {
                setActiveTab(tab);
                setSearchText('');
              }}
            >
              <Text
                style={[
                  styles.navTabText,
                  activeTab === tab && styles.navTabTextActive,
                ]}
              >
                {tab === 'summary'
                  ? 'الملخص'
                  : tab === 'operations'
                  ? 'التشغيل'
                  : tab === 'orders'
                  ? 'الطلبيات'
                  : 'العملاء'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {activeTab === 'summary' && renderSummary()}
          {activeTab === 'operations' && renderOperations()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'clients' && renderClients()}
        </ScrollView>

        {activeTab === 'operations' && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setOperationModalVisible(true)}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'orders' && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setOrderModalVisible(true)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'clients' && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setClientModalVisible(true)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerBtn} onPress={exportAll}>
            <Text style={{ color: 'rgba(255,255,255,.6)', fontSize: 10, fontWeight: '600' }}>
              📊 تصدير
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerBtn} onPress={onRefresh}>
            <Text style={{ color: 'rgba(255,255,255,.6)', fontSize: 10, fontWeight: '600' }}>
              🔄 تحديث
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddOperationModal
        visible={operationModalVisible}
        onClose={() => setOperationModalVisible(false)}
        onAdd={(op) => {
          setOperations([...operations, op]);
        }}
        clients={clients}
        items={items}
      />

      <AddOrderModal
        visible={orderModalVisible}
        onClose={() => setOrderModalVisible(false)}
        onAdd={(ord) => {
          setOrders([...orders, ord]);
        }}
      />

      <AddClientModal
        visible={clientModalVisible}
        onClose={() => setClientModalVisible(false)}
        onAdd={(cl) => {
          setClients([...clients, cl]);
        }}
      />
    </SafeAreaView>
  );
}
