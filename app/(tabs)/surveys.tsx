import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

// Mock Data for Surveys
const SURVEYS_DATA = [
  {
    id: '1',
    title: 'Memnuniyet Anketi',
    description: 'Çalışan memnuniyetini ölçmek için yıllık anket.',
    questionCount: 12,
    date: '29.01.2025',
    type: 'Genel',
  },
  {
    id: '2',
    title: 'Yemekhane Hizmetleri',
    description: 'Yemekhane kalitesi ve çeşitliliği hakkında.',
    questionCount: 5,
    date: '25.01.2025',
    type: 'Hizmet',
  },
  {
    id: '3',
    title: 'Eğitim Talepleri',
    description: '2025 yılı eğitim planlaması için ön talep.',
    questionCount: 8,
    date: '15.01.2025',
    type: 'İK',
  },
  {
    id: '4',
    title: 'Ofis Ortamı Değerlendirmesi',
    description: 'Ofis sıcaklığı, gürültü ve düzen hakkında.',
    questionCount: 10,
    date: '10.01.2025',
    type: 'İdari',
  },
];

export default function SurveysScreen() {
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A5D48" />

      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Anket Yönetimi</Text>
          <View style={styles.headerIconBg}>
            <Ionicons name="stats-chart" size={24} color="#1A5D48" />
          </View>
        </View>

        <View style={styles.headerButtonsRow}>
          <TouchableOpacity style={styles.headerBtnOutline}>
            <Text style={styles.headerBtnOutlineText}>Sistem Anketleri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtnFilled}>
            <Ionicons name="add" size={18} color="#1A5D48" style={{ marginRight: 4 }} />
            <Text style={styles.headerBtnFilledText}>Anket Oluştur</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* 2. Stats Cards Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Toplam Anket</Text>
              <Text style={styles.statValue}>{SURVEYS_DATA.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Mevcut Görünüm</Text>
              <Text style={styles.statValue}>{SURVEYS_DATA.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Aktif Filtreler</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>

          {/* 3. Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Anketleri ara veya açıklamaya göre ara..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* 4. Survey List */}
          <View style={styles.listContainer}>
            {SURVEYS_DATA.map((item) => (
              <View key={item.id} style={styles.surveyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.surveyTitle}>{item.title}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.surveyDate}>Oluşturulma: {item.date}</Text>
                </View>

                <Text style={styles.surveyDesc}>{item.description}</Text>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={16} color="#666" />
                  <Text style={styles.questionCountText}>Sorular: {item.questionCount}</Text>
                </View>

                {/* Actions Row */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionBtnPrimary}>
                    <Text style={styles.actionBtnText}>Analiz</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtnSecondary}>
                    <Text style={styles.actionBtnTextSecondary}>Gönder</Text>
                  </TouchableOpacity>

                  <View style={styles.iconActions}>
                    <TouchableOpacity style={styles.iconBtnEdit}>
                      <Feather name="edit-2" size={20} color="#ff9800" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtnDelete}>
                      <Feather name="trash-2" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A5D48',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    marginTop: 10,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIconBg: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerBtnOutlineText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  headerBtnFilled: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerBtnFilledText: {
    color: '#1A5D48',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  listContainer: {
    marginBottom: 20,
  },
  surveyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  badge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  surveyDate: {
    fontSize: 12,
    color: '#999',
  },
  surveyDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  questionCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  actionBtnPrimary: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  actionBtnText: {
    color: '#2196f3',
    fontWeight: '600',
    fontSize: 13,
  },
  actionBtnSecondary: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 'auto', // Pushes icons to the right
  },
  actionBtnTextSecondary: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  iconActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtnEdit: {
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginRight: 10,
  },
  iconBtnDelete: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
});