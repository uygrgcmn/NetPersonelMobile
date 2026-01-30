import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform, TextInput, Modal, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
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

// Mock Data for Users
const MOCK_USERS_DATA = [
  { id: 'u1', name: 'Ayşe Yılmaz', phone: '532 123 45 67', department: 'İK', branch: 'Merkez', gender: 'Kadın', userType: 'Yönetici' },
  { id: 'u2', name: 'Mehmet Demir', phone: '541 987 65 43', department: 'Finans', branch: 'Şube 1', gender: 'Erkek', userType: 'Personel' },
  { id: 'u3', name: 'Zeynep Kaya', phone: '505 111 22 33', department: 'Pazarlama', branch: 'Merkez', gender: 'Kadın', userType: 'Personel' },
  { id: 'u4', name: 'Ali Can', phone: '553 444 55 66', department: 'Yazılım', branch: 'Ar-Ge', gender: 'Erkek', userType: 'Uzman' },
  { id: 'u5', name: 'Elif Tekin', phone: '530 777 88 99', department: 'İK', branch: 'Şube 2', gender: 'Kadın', userType: 'Personel' },
  { id: 'u6', name: 'Burak Aksoy', phone: '542 222 33 44', department: 'Finans', branch: 'Merkez', gender: 'Erkek', userType: 'Yönetici' },
  { id: 'u7', name: 'Cemre Yıldız', phone: '507 555 66 77', department: 'Pazarlama', branch: 'Şube 1', gender: 'Kadın', userType: 'Uzman' },
  { id: 'u8', name: 'Deniz Arslan', phone: '555 888 99 00', department: 'Yazılım', branch: 'Ar-Ge', gender: 'Erkek', userType: 'Personel' },
];

export default function SurveysScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isAssignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  // Assignment State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [assignmentTime, setAssignmentTime] = useState<'now' | 'later'>('now');

  // Filters State
  const [filters, setFilters] = useState({
    branch: '',
    department: '',
    gender: '',
    userType: '',
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null); // 'branch', 'department', 'gender', 'userType' or null

  // User Selection State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchUserText, setSearchUserText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS_DATA);

  const handleOpenAssignment = (survey: any) => {
    setSelectedSurvey(survey);
    setAssignmentModalVisible(true);
    setSelectedUsers([]);
    setSearchUserText('');
    setFilteredUsers(MOCK_USERS_DATA);
    setFilters({ branch: '', department: '', gender: '', userType: '' });
    setExpandedFilter(null);
    setAssignmentTime('now');
    setSelectedDate(new Date());
  };

  const handleCloseAssignment = () => {
    setAssignmentModalVisible(false);
    setSelectedSurvey(null);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const toggleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleAssignSurvey = () => {
    if (!selectedSurvey) return;

    if (selectedUsers.length === 0) {
      Alert.alert('Uyarı', 'Lütfen anket atamak için en az bir kullanıcı seçin.');
      return;
    }

    const assignedCount = selectedUsers.length;
    const formattedDate = selectedDate.toLocaleDateString('tr-TR');
    const timeText = assignmentTime === 'now' ? 'Hemen Gönderilecek' : 'Daha Sonra Gönderilecek';

    Alert.alert(
      'Anket Atandı!',
      `Anket: ${selectedSurvey.title}\nAtanan Kişi Sayısı: ${assignedCount}\nBitiş Tarihi: ${formattedDate}\nGönderim: ${timeText}`,
      [{ text: 'Tamam', onPress: handleCloseAssignment }]
    );
  };

  const toggleFilter = (filterType: string) => {
    setExpandedFilter(expandedFilter === filterType ? null : filterType);
  };

  const selectFilterOption = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value === filters[type as keyof typeof filters] ? '' : value };
    setFilters(newFilters);
    applyUserFilter(searchUserText, newFilters);
  };

  const applyUserFilter = (searchText: string, currentFilters: typeof filters) => {
    let tempUsers = MOCK_USERS_DATA;

    // Apply Filters
    if (currentFilters.branch) tempUsers = tempUsers.filter(u => u.branch === currentFilters.branch);
    if (currentFilters.department) tempUsers = tempUsers.filter(u => u.department === currentFilters.department);
    if (currentFilters.gender) tempUsers = tempUsers.filter(u => u.gender === currentFilters.gender);
    if (currentFilters.userType) tempUsers = tempUsers.filter(u => u.userType === currentFilters.userType);

    // Apply Search
    if (searchText) {
      tempUsers = tempUsers.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredUsers(tempUsers);
  };

  React.useEffect(() => {
    applyUserFilter(searchUserText, filters);
  }, [searchUserText, filters]);


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
          <TouchableOpacity
            style={styles.headerBtnOutline}
            onPress={() => router.push('/system-default-surveys')}
          >
            <Text style={styles.headerBtnOutlineText}>Sistem Anketleri</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtnFilled}
            onPress={() => router.push('/create-survey')}
          >
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
                  <TouchableOpacity
                    style={styles.actionBtnPrimary}
                    onPress={() => router.push({
                      pathname: '/survey-analysis',
                      params: { id: item.id, title: item.title }
                    })}
                  >
                    <Text style={styles.actionBtnText}>Analiz</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => handleOpenAssignment(item)}
                  >
                    <Text style={styles.actionBtnTextSec}>Gönder</Text>
                  </TouchableOpacity>

                  <View style={styles.iconActions}>
                    <TouchableOpacity
                      style={styles.iconBtnEdit}
                      onPress={() => router.push({ pathname: '/edit-survey', params: { title: item.title } })}
                    >
                      <Feather name="edit-2" size={18} color="#ff9800" />
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

      {/* Assignment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAssignmentModalVisible}
        onRequestClose={handleCloseAssignment}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anket Atama</Text>
              <TouchableOpacity onPress={handleCloseAssignment}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedSurvey && (
                <View style={[styles.section, { marginBottom: 15 }]}>
                  <Text style={[styles.modalSurveyTitle, { fontSize: 18, color: '#1A5D48' }]}>{selectedSurvey.title}</Text>
                </View>
              )}

              {/* 1. Time & Date Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Zamanlama Ayarları</Text>
                <View style={styles.timeSettingsRow}>
                  {/* Date Picker */}
                  <View style={styles.timeSettingCol}>
                    <Text style={styles.label}>Bitiş Tarihi</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                      <Ionicons name="calendar-outline" size={18} color="#666" />
                      <Text style={styles.dateText}>{selectedDate.toLocaleDateString('tr-TR')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Time Logic */}
                  <View style={styles.timeSettingCol}>
                    <Text style={styles.label}>Tarih</Text>
                    <View style={styles.sendingTimeRow}>
                      <TouchableOpacity
                        style={[styles.sendingTimeBtn, assignmentTime === 'now' && styles.sendingTimeBtnActive]}
                        onPress={() => setAssignmentTime('now')}
                      >
                        <Text style={[styles.sendingTimeText, assignmentTime === 'now' && styles.sendingTimeTextActive]}>Şimdi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.sendingTimeBtn, assignmentTime === 'later' && styles.sendingTimeBtnActive]}
                        onPress={() => setAssignmentTime('later')}
                      >
                        <Text style={[styles.sendingTimeText, assignmentTime === 'later' && styles.sendingTimeTextActive]}>Sonra</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              {/* 2. Filters */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Kullanıcıları Filtrele</Text>

                {/* Branch Filter */}
                <View style={styles.filterItem}>
                  <TouchableOpacity style={styles.filterHeaderBtn} onPress={() => toggleFilter('branch')}>
                    <Text style={styles.filterHeaderLabel}>Şube {filters.branch ? `(${filters.branch})` : ''}</Text>
                    <Ionicons name={expandedFilter === 'branch' ? "chevron-up" : "chevron-down"} size={18} color="#666" />
                  </TouchableOpacity>
                  {expandedFilter === 'branch' && (
                    <View style={styles.filterOptionsContainer}>
                      {['Tüm Şubeler', ...new Set(MOCK_USERS_DATA.map(u => u.branch))].filter(Boolean).map((opt, idx) => (
                        <TouchableOpacity key={idx} style={styles.filterOptionRow} onPress={() => selectFilterOption('branch', opt === 'Tüm Şubeler' ? '' : opt)}>
                          <View style={[styles.radioCircle, filters.branch === (opt === 'Tüm Şubeler' ? '' : opt) && styles.radioCircleSelected]} />
                          <Text style={styles.filterOptionText}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Department Filter */}
                <View style={styles.filterItem}>
                  <TouchableOpacity style={styles.filterHeaderBtn} onPress={() => toggleFilter('department')}>
                    <Text style={styles.filterHeaderLabel}>Departman {filters.department ? `(${filters.department})` : ''}</Text>
                    <Ionicons name={expandedFilter === 'department' ? "chevron-up" : "chevron-down"} size={18} color="#666" />
                  </TouchableOpacity>
                  {expandedFilter === 'department' && (
                    <View style={styles.filterOptionsContainer}>
                      {['Tüm Departmanlar', ...new Set(MOCK_USERS_DATA.map(u => u.department))].map((opt, idx) => (
                        <TouchableOpacity key={idx} style={styles.filterOptionRow} onPress={() => selectFilterOption('department', opt === 'Tüm Departmanlar' ? '' : opt)}>
                          <View style={[styles.radioCircle, filters.department === (opt === 'Tüm Departmanlar' ? '' : opt) && styles.radioCircleSelected]} />
                          <Text style={styles.filterOptionText}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Gender Filter */}
                <View style={styles.filterItem}>
                  <TouchableOpacity style={styles.filterHeaderBtn} onPress={() => toggleFilter('gender')}>
                    <Text style={styles.filterHeaderLabel}>Cinsiyet {filters.gender ? `(${filters.gender})` : ''}</Text>
                    <Ionicons name={expandedFilter === 'gender' ? "chevron-up" : "chevron-down"} size={18} color="#666" />
                  </TouchableOpacity>
                  {expandedFilter === 'gender' && (
                    <View style={styles.filterOptionsContainer}>
                      {['Erkek', 'Kadın'].map((opt, idx) => (
                        <TouchableOpacity key={idx} style={styles.filterOptionRow} onPress={() => selectFilterOption('gender', opt)}>
                          <View style={[styles.radioCircle, filters.gender === opt && styles.radioCircleSelected]} />
                          <Text style={styles.filterOptionText}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* User Type Filter */}
                <View style={styles.filterItem}>
                  <TouchableOpacity style={styles.filterHeaderBtn} onPress={() => toggleFilter('userType')}>
                    <Text style={styles.filterHeaderLabel}>Kullanıcı Tipi {filters.userType ? `(${filters.userType})` : ''}</Text>
                    <Ionicons name={expandedFilter === 'userType' ? "chevron-up" : "chevron-down"} size={18} color="#666" />
                  </TouchableOpacity>
                  {expandedFilter === 'userType' && (
                    <View style={styles.filterOptionsContainer}>
                      {['Tümü', ...new Set(MOCK_USERS_DATA.map(u => u.userType))].map((opt, idx) => (
                        <TouchableOpacity key={idx} style={styles.filterOptionRow} onPress={() => selectFilterOption('userType', opt === 'Tümü' ? '' : opt)}>
                          <View style={[styles.radioCircle, filters.userType === (opt === 'Tümü' ? '' : opt) && styles.radioCircleSelected]} />
                          <Text style={styles.filterOptionText}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* 3. Search & List */}
              <View style={styles.section}>
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={20} color="#999" />
                  <TextInput
                    style={styles.modalSearchInput}
                    placeholder="Ad veya numara ile ara..."
                    placeholderTextColor="#999"
                    value={searchUserText}
                    onChangeText={setSearchUserText}
                  />
                </View>

                <View style={styles.userListHeader}>
                  <TouchableOpacity onPress={toggleSelectAllUsers} style={styles.selectAllBox}>
                    <MaterialIcons
                      name={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? "check-box" : "check-box-outline-blank"}
                      size={24}
                      color="#1A5D48"
                    />
                  </TouchableOpacity>
                  <Text style={[styles.columnHeader, { flex: 2 }]}>Ad Soyad</Text>
                  <Text style={[styles.columnHeader, { flex: 1 }]}>Telefon</Text>
                </View>

                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userRow} onPress={() => toggleUserSelection(item.id)}>
                      <View style={styles.checkbox}>
                        <MaterialIcons
                          name={selectedUsers.includes(item.id) ? "check-box" : "check-box-outline-blank"}
                          size={24}
                          color="#1A5D48"
                        />
                      </View>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userPhone}>{item.phone}</Text>
                    </TouchableOpacity>
                  )}
                />
                {filteredUsers.length === 0 && (
                  <Text style={{ textAlign: 'center', color: '#999', marginTop: 10 }}>Kullanıcı bulunamadı.</Text>
                )}
              </View>

            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={handleCloseAssignment} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAssignSurvey}
                style={[styles.assignButton, selectedUsers.length === 0 && styles.disabledButton]}
                disabled={selectedUsers.length === 0}
              >
                <Text style={styles.assignButtonText}>ANKET ATA ({selectedUsers.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    marginBottom: 5,
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
  actionBtnTextSec: {
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '92%',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A5D48',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalSurveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  // Time Settings Styles
  timeSettingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  timeSettingCol: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    height: 45,
  },
  dateText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 13,
  },
  sendingTimeRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 3,
    height: 45,
  },
  sendingTimeBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  sendingTimeBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendingTimeText: {
    fontSize: 13,
    color: '#666',
  },
  sendingTimeTextActive: {
    color: '#1A5D48',
    fontWeight: '600',
  },

  // Filter Styles
  filterItem: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  filterHeaderBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fcfcfc',
  },
  filterHeaderLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterOptionsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 5,
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#1A5D48',
    backgroundColor: '#1A5D48',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },

  // Search & List Styles
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 45,
  },
  modalSearchInput: { // Reusing flex: 1 from main styles but ensuring height
    flex: 1,
    height: '100%',
    color: '#333',
  },
  userListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 5,
  },
  selectAllBox: {
    marginRight: 10,
  },
  columnHeader: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: 13,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  checkbox: {
    marginRight: 10,
  },
  userName: {
    flex: 2,
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  userPhone: {
    flex: 1,
    color: '#666',
    fontSize: 12,
  },

  // Footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 'auto', // Pushes to bottom if space is available
  },
  cancelButton: {
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 15,
  },
  assignButton: {
    backgroundColor: '#1A5D48',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});