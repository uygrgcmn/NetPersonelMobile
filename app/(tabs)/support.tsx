import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

// Renkler ve Tipler
const TICKET_TYPES = {
    SUPPORT: { label: 'Destek Talebi', color: '#1A5D48' },
    DATA_ISSUE: { label: 'Veri Yetersizliği', color: '#ff9800' }, // Turuncu
    COMPLAINT: { label: 'Şikayet', color: '#dc3545' }, // Kırmızı
};

const TICKET_STATUS = {
    PENDING: { label: 'Beklemede', color: '#6c757d' },
    ANSWERED: { label: 'Yanıtlandı', color: '#28a745' },
};

// Mock Data
const SUPPORT_TICKETS = [
    {
        id: '1',
        user: 'Uygar Ali',
        title: 'Giriş Yapamıyorum lütfen yardım edin',
        type: TICKET_TYPES.COMPLAINT,
        status: TICKET_STATUS.PENDING,
        date: 'Bugün'
    },
    {
        id: '2',
        user: 'Ahmet Yılmaz',
        title: 'Maaş Bordrosu Eksik',
        type: TICKET_TYPES.DATA_ISSUE,
        status: TICKET_STATUS.ANSWERED,
        date: 'Dün'
    },
    {
        id: '3',
        user: 'Ayşe Kaya',
        title: 'İzin Talebi Onayı',
        type: TICKET_TYPES.SUPPORT,
        status: TICKET_STATUS.ANSWERED,
        date: '25 Oca'
    },
    {
        id: '4',
        user: 'Mehmet Demir',
        title: 'Sistem Hatası',
        type: TICKET_TYPES.COMPLAINT,
        status: TICKET_STATUS.PENDING,
        date: '20 Oca'
    },
];

export default function SupportScreen() {
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.ticketCard}>
            {/* 1. Satır: Kullanıcı ve Tarih */}
            <View style={styles.rowBetween}>
                <View style={styles.userContainer}>
                    <Ionicons name="person-circle-outline" size={20} color="#666" />
                    <Text style={styles.userName}>{item.user}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>

            {/* 2. Satır: Talep Başlığı */}
            <Text style={styles.ticketTitle}>{item.title}</Text>

            {/* 3. Satır: Etiketler (Tip ve Durum) */}
            <View style={styles.tagsRow}>
                <View style={[styles.tag, { backgroundColor: item.type.color + '15' }]}>
                    <Text style={[styles.tagText, { color: item.type.color }]}>{item.type.label}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: item.status.color + '15' }]}>
                    <Text style={[styles.tagText, { color: item.status.color }]}>{item.status.label}</Text>
                </View>
            </View>

            {/* 4. Satır: İşlem Butonu */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Görüntüle</Text>
                    <Ionicons name="eye-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5D48" />

            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="headset-outline" size={32} color="#1A5D48" />
                    </View>
                    <Text style={styles.headerTitle}>Destek Talepleri</Text>
                </View>
            </View>

            {/* Content Area */}
            <View style={styles.mainContent}>

                {/* Arama ve Filtreleme Alanı */}
                <View style={styles.searchFilterContainer}>
                    {/* Arama Çubuğu */}
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#999" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Talep metni, kullanıcı adı, telefon vb. ile ara..."
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Alt Satır: Okunmamış & Filtrele */}
                    <View style={styles.filterActionsRow}>
                        <TouchableOpacity style={styles.unreadToggle}>
                            <Ionicons name="toggle" size={20} color={Colors.primary} />
                            <Text style={styles.unreadText}>Sadece okunmamışları göster</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filterButton}>
                            <Ionicons name="filter" size={18} color="#fff" />
                            <Text style={styles.filterButtonText}>Filtrele</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Talepleriniz</Text>

                <FlatList
                    data={SUPPORT_TICKETS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Henüz destek talebiniz yok.</Text>
                    }
                />

                {/* New Request Button */}
                <TouchableOpacity style={styles.fab}>
                    <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>

                {/* Bottom padding for tab bar */}
                <View style={{ height: 80 }} />
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
    headerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
    },
    searchFilterContainer: {
        paddingHorizontal: 20,
        marginTop: 25, // Add top margin inside mainContent
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 45,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        color: '#333',
    },
    filterActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    unreadToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    unreadText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        gap: 6,
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 25,
        marginTop: 10,
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    ticketCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    userName: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 12,
        color: '#aaa',
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 15,
    },
    tag: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    actionRow: {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        paddingTop: 12,
        alignItems: 'flex-end',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A5D48',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        color: '#999',
    },
    fab: {
        position: 'absolute',
        bottom: 100, // Above tab bar
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1A5D48',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1A5D48',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});