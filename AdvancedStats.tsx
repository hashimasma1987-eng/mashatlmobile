import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Operation, Order } from '../services/dataService';

const { width } = Dimensions.get('window');

interface AdvancedStatsProps {
  operations: Operation[];
  orders: Order[];
}

export default function AdvancedStats({ operations, orders }: AdvancedStatsProps) {
  const totalPlanted = operations.reduce((sum, op) => sum + op.planted, 0);
  const totalFulfilled = operations.reduce((sum, op) => sum + op.fulfilled, 0);
  const totalOrdered = orders.reduce((sum, ord) => sum + ord.requested, 0);
  const totalDelivered = orders.reduce((sum, ord) => sum + ord.delivered, 0);

  const fulfillmentRate = totalPlanted > 0 ? ((totalFulfilled / totalPlanted) * 100).toFixed(1) : 0;
  const deliveryRate = totalOrdered > 0 ? ((totalDelivered / totalOrdered) * 100).toFixed(1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalPlanted.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي المزروعة</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalFulfilled.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي المشبعة</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{fulfillmentRate}%</Text>
          <Text style={styles.statLabel}>معدل الإشباع</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{deliveryRate}%</Text>
          <Text style={styles.statLabel}>معدل التسليم</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalOrdered.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي المطلوب</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalDelivered.toLocaleString()}</Text>
          <Text style={styles.statLabel}>إجمالي المسلم</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0DBD3',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D6B45',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#8A9A8A',
    textAlign: 'center',
  },
});
