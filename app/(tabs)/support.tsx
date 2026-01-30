import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, TextInput, Modal, ScrollView } from 'react-native';
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
    CLOSED: { label: 'Kapatıldı', color: '#343a40' }
};

// Filter Constants
const USER_TYPES = ['Çalışan', 'Misafir', 'Müşteri', 'Aday'];
const STATUS_OPTIONS = ['Beklemede', 'Yanıtlandı', 'Kapatıldı'];
const TYPE_OPTIONS = ['Veri Yetersizliği', 'Destek Talebi', 'Şikayet'];

// Mock Data
const SUPPORT_TICKETS = [
    {
        id: '1',
        ticketId: 'Talep#794355455',
        user: 'Uygar Ali',
        title: 'Giriş Yapamıyorum lütfen yardım edin',
        fullDescription: 'Uygulamaya giriş yapmaya çalışırken sürekli "Sunucu hatası" alıyorum. İnternet bağlantımı kontrol ettim, sorun yok. Şifremi de doğru giriyorum.',
        type: TICKET_TYPES.COMPLAINT,
        status: TICKET_STATUS.PENDING,
        date: 'Bugün',
        isRead: true,
        botResponse: 'Merhaba, sunucu erişiminde yaşanan geçici bir kesinti olabilir. Lütfen 15 dakika sonra tekrar deneyiniz. Sorun devam ederse lütfen hata ekran görüntüsünü paylaşınız.',
        adminResponse: '',
        history: [
            { sender: 'user', message: 'Hala giremiyorum, acil yardım!', time: '10:05' },
            { sender: 'bot', message: 'Talebiniz teknik ekibe iletildi.', time: '10:06' }
        ]
    },
    {
        id: '2',
        ticketId: 'Talep#882103921',
        user: 'Ahmet Yılmaz',
        title: 'Maaş Bordrosu Eksik',
        fullDescription: 'Ocak ayı maaş bordrom sistemde görünmüyor. Muhasebe ile görüştüm yüklendi dediler ama ben göremiyorum.',
        type: TICKET_TYPES.DATA_ISSUE,
        status: TICKET_STATUS.ANSWERED,
        date: 'Dün',
        isRead: false, // Unread
        botResponse: 'Merhaba, bordro görüntüleme yetkiniz kontrol ediliyor. İK departmanı ile iletişime geçildi.',
        adminResponse: 'Ahmet Bey, sistemsel bir gecikme olmuş. Şu an bordronuzu görüntüleyebilirsiniz.',
        history: []
    },
    {
        id: '3',
        ticketId: 'Talep#129384755',
        user: 'Ayşe Kaya',
        title: 'İzin Talebi Onayı',
        fullDescription: 'Yıllık iznimi sisteme girdim fakat yöneticim onay ekranında göremediğini söylüyor.',
        type: TICKET_TYPES.SUPPORT,
        status: TICKET_STATUS.ANSWERED,
        date: '25 Oca',
        isRead: true,
        botResponse: 'Yöneticinizin onay yetkisi tanımlamaları kontrol edilmelidir.',
        adminResponse: 'Yönetici onayı bekleyenler listesinde kaydınız görünüyor. Tekrar kontrol etmesini rica ederiz.',
        history: [
            { sender: 'user', message: 'Tamam, tekrar iletiyorum kendisine.', time: '14:30' }
        ]
    },
    {
        id: '4',
        ticketId: 'Talep#992837461',
        user: 'Mehmet Demir',
        title: 'Sistem Hatası',
        fullDescription: 'Rapor alırken uygulama kapanıyor.',
        type: TICKET_TYPES.COMPLAINT,
        status: TICKET_STATUS.PENDING,
        date: '20 Oca',
        isRead: false, // Unread
        botResponse: 'Hata logları incelenmek üzere kaydedildi. Uygulamanızın güncel olduğundan emin olunuz.',
        adminResponse: '',
        history: []
    },
];

export default function SupportScreen() {
    // Filter State
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [selectedUserTypes, setSelectedUserTypes] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    // Detail Modal State
    const [ticketDetailModalVisible, setTicketDetailModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [replyText, setReplyText] = useState('');

    const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleReset = () => {
        setSelectedUserTypes([]);
        setSelectedStatuses([]);
        setSelectedTypes([]);
    };

    const handleApply = () => {
        // Here you would typically apply the filters to the data source
        setFilterModalVisible(false);
    };

    const handleViewTicket = (ticket: any) => {
        // Mark as read when viewing
        ticket.isRead = true;
        setSelectedTicket(ticket);
        setReplyText('');
        setTicketDetailModalVisible(true);
    };

    // Filter Logic
    const filteredTickets = SUPPORT_TICKETS.filter(ticket => {
        if (showUnreadOnly && ticket.isRead) return false;
        // (Future: Add other filters here from modal selection if needed instantly)
        return true;
    });

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.ticketCard, !item.isRead && styles.unreadCard]}>
            {/* 1. Satır: Kullanıcı ve Tarih */}
            <View style={styles.rowBetween}>
                <View style={styles.userContainer}>
                    <Ionicons name="person-circle-outline" size={20} color="#666" />
                    <Text style={[styles.userName, !item.isRead && styles.unreadTextBold]}>{item.user}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>

            {/* 2. Satır: Talep Başlığı */}
            <Text style={[styles.ticketTitle, !item.isRead && styles.unreadTextBold]}>{item.title}</Text>

            {/* 3. Satır: Etiketler (Tip ve Durum) */}
            <View style={styles.tagsRow}>
                <View style={[styles.tag, { backgroundColor: item.type.color + '15' }]}>
                    <Text style={[styles.tagText, { color: item.type.color }]}>{item.type.label}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: item.status.color + '15' }]}>
                    <Text style={[styles.tagText, { color: item.status.color }]}>{item.status.label}</Text>
                </View>
                {!item.isRead && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>Yeni</Text>
                    </View>
                )}
            </View>

            {/* 4. Satır: İşlem Butonu */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.viewButton} onPress={() => handleViewTicket(item)}>
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
                        <TouchableOpacity
                            style={[styles.unreadToggleLarge, showUnreadOnly && styles.unreadToggleActive]}
                            onPress={() => setShowUnreadOnly(!showUnreadOnly)}
                        >
                            <Ionicons
                                name={showUnreadOnly ? "checkbox" : "square-outline"}
                                size={24}
                                color={showUnreadOnly ? Colors.primary : "#999"}
                            />
                            <Text style={[styles.unreadTextLarge, showUnreadOnly && { color: Colors.primary }]}>
                                Sadece okunmamışları göster
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                            <Ionicons name="filter" size={18} color="#fff" />
                            <Text style={styles.filterButtonText}>Filtrele</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Talepleriniz</Text>

                <FlatList
                    data={filteredTickets}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {showUnreadOnly ? "Okunmamış talep bulunamadı." : "Henüz destek talebiniz yok."}
                        </Text>
                    }
                />

                {/* Bottom padding for tab bar */}
                <View style={{ height: 80 }} />
            </View>

            {/* ERROR / FILTER MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Destek Taleplerini Filtrele</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* User Type Section */}
                            <Text style={styles.filterSectionTitle}>Kullanıcı Tipi</Text>
                            <View style={styles.filterOptionsContainer}>
                                {USER_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.filterOption,
                                            selectedUserTypes.includes(type) && styles.filterOptionSelected
                                        ]}
                                        onPress={() => toggleSelection(type, selectedUserTypes, setSelectedUserTypes)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            selectedUserTypes.includes(type) && styles.filterOptionTextSelected
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Status Section */}
                            <Text style={styles.filterSectionTitle}>Durum</Text>
                            <View style={styles.filterOptionsContainer}>
                                {STATUS_OPTIONS.map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.filterOption,
                                            selectedStatuses.includes(status) && styles.filterOptionSelected
                                        ]}
                                        onPress={() => toggleSelection(status, selectedStatuses, setSelectedStatuses)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            selectedStatuses.includes(status) && styles.filterOptionTextSelected
                                        ]}>{status}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Request Type Section */}
                            <Text style={styles.filterSectionTitle}>Talep Tipi</Text>
                            <View style={styles.filterOptionsContainer}>
                                {TYPE_OPTIONS.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.filterOption,
                                            selectedTypes.includes(type) && styles.filterOptionSelected
                                        ]}
                                        onPress={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            selectedTypes.includes(type) && styles.filterOptionTextSelected
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Modal Footer Actions */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                                <Text style={styles.resetButtonText}>Sıfırla</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setFilterModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>İptal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                                    <Text style={styles.applyButtonText}>Uygula</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* DETAIL MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={ticketDetailModalVisible}
                onRequestClose={() => setTicketDetailModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    {selectedTicket && (
                        <>
                            {/* MODAL HEADER */}
                            <View style={styles.detailHeader}>
                                <TouchableOpacity onPress={() => setTicketDetailModalVisible(false)} style={styles.closeIcon}>
                                    <Ionicons name="arrow-back" size={24} color="#333" />
                                </TouchableOpacity>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.detailTitle}>{selectedTicket.ticketId}</Text>
                                    <Text style={styles.detailDate}>{selectedTicket.date}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                    <View style={[styles.tag, { backgroundColor: selectedTicket.status.color + '20' }]}>
                                        <Text style={[styles.tagText, { color: selectedTicket.status.color }]}>{selectedTicket.status.label}</Text>
                                    </View>
                                    <View style={[styles.tag, { backgroundColor: selectedTicket.type.color + '20' }]}>
                                        <Text style={[styles.tagText, { color: selectedTicket.type.color }]}>{selectedTicket.type.label}</Text>
                                    </View>
                                </View>
                            </View>

                            <ScrollView style={styles.detailContent} contentContainerStyle={{ paddingBottom: 100 }}>

                                {/* 1. Kullanıcı Sorusu */}
                                <View style={styles.sectionBox}>
                                    <Text style={styles.boxTitle}>Kullanıcı Sorusu</Text>
                                    <Text style={styles.boxText}>{selectedTicket.fullDescription}</Text>
                                </View>

                                {/* 2. Bot Yanıtı */}
                                {selectedTicket.botResponse ? (
                                    <View style={[styles.sectionBox, styles.botBox]}>
                                        <Text style={styles.boxTitle}>
                                            <Ionicons name="hardware-chip-outline" size={16} /> Bot Yanıtı
                                        </Text>
                                        <Text style={styles.boxText}>{selectedTicket.botResponse}</Text>
                                    </View>
                                ) : null}

                                {/* 3. Sizin Yanıtınız (Admin) */}
                                {selectedTicket.adminResponse ? (
                                    <View style={[styles.sectionBox, styles.adminBox]}>
                                        <Text style={styles.boxTitle}>
                                            <Ionicons name="person" size={16} /> Sizin Yanıtınız
                                        </Text>
                                        <Text style={styles.boxText}>{selectedTicket.adminResponse}</Text>
                                    </View>
                                ) : null}

                                {/* 4. Konuşma Geçmişi (WhatsApp Style) */}
                                <Text style={styles.chatSectionTitle}>Konuşma Geçmişi</Text>
                                <View style={styles.chatContainer}>
                                    {selectedTicket.history && selectedTicket.history.length > 0 ? (
                                        selectedTicket.history.map((msg: any, index: number) => (
                                            <View key={index} style={[
                                                styles.chatBubble,
                                                msg.sender === 'user' ? styles.bubbleLeft : styles.bubbleRight
                                            ]}>
                                                <Text style={styles.chatText}>{msg.message}</Text>
                                                <Text style={styles.chatTime}>{msg.time}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.noHistoryText}>Geçmiş mesaj bulunmuyor.</Text>
                                    )}
                                </View>

                                {/* 5. Talebi Yanıtla */}
                                <View style={styles.replySection}>
                                    <Text style={styles.replyTitle}>Talebi Yanıtla</Text>
                                    <TextInput
                                        style={styles.replyInput}
                                        placeholder="Yanıtınızı buraya yazınız..."
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={4}
                                        value={replyText}
                                        onChangeText={setReplyText}
                                    />
                                </View>

                            </ScrollView>

                            {/* FOOTER ACTIONS */}
                            <View style={styles.detailFooter}>
                                <TouchableOpacity
                                    style={styles.footerBtnCancel}
                                    onPress={() => setTicketDetailModalVisible(false)}
                                >
                                    <Text style={styles.footerBtnTextCancel}>İptal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.footerBtnCloseTicket}>
                                    <Text style={styles.footerBtnTextClose}>Talebi Kapat</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.footerBtnReply, !replyText.trim() && styles.disabledBtn]}
                                    disabled={!replyText.trim()}
                                >
                                    <Text style={styles.footerBtnTextReply}>Yanıt Gönder</Text>
                                    <Ionicons name="send" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>

                        </>
                    )}
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ... existing content ...
    // Detail Modal Styles
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: Platform.OS === 'android' ? 30 : 0
    },
    closeIcon: {
        padding: 5,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    detailDate: {
        fontSize: 12,
        color: '#999'
    },
    detailContent: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 15,
    },
    sectionBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    botBox: {
        borderColor: '#e3f2fd',
        backgroundColor: '#f1f8ff',
    },
    adminBox: {
        borderColor: '#e8f5e9',
        backgroundColor: '#f1f8e9',
    },
    boxTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    boxText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    chatSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 15,
    },
    chatContainer: {
        paddingBottom: 20,
    },
    chatBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    bubbleLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 0,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    bubbleRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        borderBottomRightRadius: 0,
        borderWidth: 1,
        borderColor: '#c3e6b1',
    },
    chatText: {
        fontSize: 14,
        color: '#333',
    },
    chatTime: {
        fontSize: 10,
        color: '#888',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    noHistoryText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    replySection: {
        marginTop: 10,
    },
    replyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    replyInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 14,
    },
    detailFooter: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    footerBtnCancel: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    footerBtnTextCancel: {
        color: '#666',
        fontWeight: '600'
    },
    footerBtnCloseTicket: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#fff3cd',
        borderWidth: 1,
        borderColor: '#ffeeba',
    },
    footerBtnTextClose: {
        color: '#856404',
        fontWeight: '600'
    },
    footerBtnReply: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#1A5D48',
        borderRadius: 8,
        gap: 8,
    },
    footerBtnTextReply: {
        color: '#fff',
        fontWeight: '600'
    },
    disabledBtn: {
        backgroundColor: '#ccc',
    },
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
    // Updated Larger Toggle
    unreadToggleLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        gap: 10,
    },
    unreadTextLarge: {
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        gap: 6,
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 14,
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
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#1A5D48', // Highlight unread cards with green border
        backgroundColor: '#f9fffa', // Slight green tint
    },
    unreadTextBold: {
        fontWeight: '700',
        color: '#000',
    },
    unreadBadge: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
    },
    unreadBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    unreadToggleActive: {
        backgroundColor: '#e8f5e9',
        borderColor: '#1A5D48',
        borderWidth: 1.5,
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
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        color: '#999',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
    },
    filterOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#eee',
    },
    filterOptionSelected: {
        backgroundColor: '#e8f5e9',
        borderColor: '#1A5D48',
    },
    filterOptionText: {
        fontSize: 14,
        color: '#555',
    },
    filterOptionTextSelected: {
        color: '#1A5D48',
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    resetButton: {
        padding: 10,
    },
    resetButtonText: {
        color: '#999',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    applyButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: '#1A5D48',
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});