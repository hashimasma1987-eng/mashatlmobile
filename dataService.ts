import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Operation {
  id: string;
  date: string;
  crop: string;
  planted: number;
  fulfilled: number;
  customer: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  phone: string;
  crop: string;
  requested: number;
  delivered: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  region: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
}

const STORAGE_KEYS = {
  operations: 'n_operation',
  orders: 'n_orders',
  clients: 'n_clients',
  items: 'n_items',
  production: 'n_production',
  delivered: 'n_delivered',
};

export const dataService = {
  // العمليات
  async getOperations(): Promise<Operation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.operations);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting operations:', error);
      return [];
    }
  },

  async addOperation(operation: Omit<Operation, 'id'>): Promise<Operation> {
    const operations = await this.getOperations();
    const newOperation: Operation = {
      ...operation,
      id: Date.now().toString(),
    };
    operations.push(newOperation);
    await AsyncStorage.setItem(STORAGE_KEYS.operations, JSON.stringify(operations));
    return newOperation;
  },

  async updateOperation(id: string, updates: Partial<Operation>): Promise<void> {
    const operations = await this.getOperations();
    const index = operations.findIndex((op) => op.id === id);
    if (index !== -1) {
      operations[index] = { ...operations[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.operations, JSON.stringify(operations));
    }
  },

  async deleteOperation(id: string): Promise<void> {
    const operations = await this.getOperations();
    const filtered = operations.filter((op) => op.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.operations, JSON.stringify(filtered));
  },

  // الطلبيات
  async getOrders(): Promise<Order[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.orders);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  async addOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const orders = await this.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
    };
    orders.push(newOrder);
    await AsyncStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    const orders = await this.getOrders();
    const index = orders.findIndex((ord) => ord.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    }
  },

  async deleteOrder(id: string): Promise<void> {
    const orders = await this.getOrders();
    const filtered = orders.filter((ord) => ord.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(filtered));
  },

  // العملاء
  async getClients(): Promise<Client[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.clients);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  },

  async addClient(client: Omit<Client, 'id'>): Promise<Client> {
    const clients = await this.getClients();
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
    };
    clients.push(newClient);
    await AsyncStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
    return newClient;
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<void> {
    const clients = await this.getClients();
    const index = clients.findIndex((cl) => cl.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
    }
  },

  async deleteClient(id: string): Promise<void> {
    const clients = await this.getClients();
    const filtered = clients.filter((cl) => cl.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(filtered));
  },

  // الأصناف
  async getItems(): Promise<Item[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.items);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  },

  async addItem(item: Omit<Item, 'id'>): Promise<Item> {
    const items = await this.getItems();
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
    };
    items.push(newItem);
    await AsyncStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
    return newItem;
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<void> {
    const items = await this.getItems();
    const index = items.findIndex((it) => it.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
    }
  },

  async deleteItem(id: string): Promise<void> {
    const items = await this.getItems();
    const filtered = items.filter((it) => it.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.items, JSON.stringify(filtered));
  },

  // جميع البيانات
  async getAllData() {
    return {
      operations: await this.getOperations(),
      orders: await this.getOrders(),
      clients: await this.getClients(),
      items: await this.getItems(),
    };
  },
};
