import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, SafeAreaView, Platform, StatusBar, ScrollView, Modal, KeyboardAvoidingView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

// Renk Sabitleri
const SOCIAL_COLORS = {
    WHAT: '#25D366',
    INSTA: '#C13584',
    FACE: '#1877F2',
    X: '#000000',
    TELE: '#0088cc',
};

// Mock Data Interfaces
interface ChatMessage {
    id: string;
    text: string;
    time: string;
    isSender: boolean;
}

interface Message {
    id: string;
    platform: 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'telegram';
    name: string;
    message: string;
    time: string;
    unread: number;
    avatar: string;
    phoneNumber?: string; // Or username
    hasReservation: boolean;
    history: ChatMessage[];
}

const SAMPLE_HISTORY: ChatMessage[] = [
    { id: '1', text: 'Merhaba, siparişim hakkında bilgi alabilir miyim?', time: '10:00', isSender: false },
    { id: '2', text: 'Tabii, sipariş numaranızı öğrenebilir miyim?', time: '10:05', isSender: true },
    { id: '3', text: '123456789', time: '10:06', isSender: false },
    { id: '4', text: 'Kontrol ediyorum, lütfen bekleyin.', time: '10:07', isSender: true },
];

const MESSAGES_DATA: Message[] = [
    {
        id: '1', platform: 'whatsapp', name: 'Uygar Ali Göçmen', message: 'Sipariş durumunu öğrenebilir miyim?', time: '10:30', unread: 2, avatar: 'https://ui-avatars.com/api/?name=Uygar+Ali&background=random',
        phoneNumber: '+90 555 123 45 67', hasReservation: true, history: [...SAMPLE_HISTORY, { id: '5', text: 'Sipariş durumunu öğrenebilir miyim?', time: '10:30', isSender: false }]
    },
    {
        id: '2', platform: 'instagram', name: 'moda_butik', message: 'Fiyat bilgisi alabilir miyim?', time: '09:45', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Moda+Butik&background=random',
        phoneNumber: '@moda_butik', hasReservation: false, history: SAMPLE_HISTORY
    },
    {
        id: '3', platform: 'facebook', name: 'Mustafa Demir', message: 'Ürün stokta var mı?', time: 'Dün', unread: 1, avatar: 'https://ui-avatars.com/api/?name=Mustafa+Demir&background=random',
        phoneNumber: 'Mustafa Demir', hasReservation: true, history: SAMPLE_HISTORY
    },
    {
        id: '4', platform: 'whatsapp', name: 'Morphosium', message: 'Teşekkürler, iyi çalışmalar.', time: 'Dün', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Morphosium&background=random',
        phoneNumber: '+90 532 987 65 43', hasReservation: false, history: SAMPLE_HISTORY
    },
    {
        id: '5', platform: 'x', name: 'CryptoTrader', message: 'Yeni özellikler harika olmuş!', time: '14:20', unread: 3, avatar: 'https://ui-avatars.com/api/?name=Crypto+Trader&background=random',
        phoneNumber: '@cryptotrader', hasReservation: false, history: SAMPLE_HISTORY
    },
    {
        id: '6', platform: 'telegram', name: 'Destek Grubu', message: 'Sunucu bakımı ne zaman bitecek?', time: '11:05', unread: 10, avatar: 'https://ui-avatars.com/api/?name=Destek+Grubu&background=random',
        phoneNumber: 't.me/supportgroup', hasReservation: true, history: SAMPLE_HISTORY
    },
    {
        id: '7', platform: 'instagram', name: 'sport_life', message: 'Kargo ne zaman çıkar?', time: 'Pzt', unread: 5, avatar: 'https://ui-avatars.com/api/?name=Sport+Life&background=random',
        phoneNumber: '@sport_life', hasReservation: false, history: SAMPLE_HISTORY
    },
    {
        id: '8', platform: 'facebook', name: 'Veli Can', message: 'Adres bilgisini güncelledim.', time: 'Pzt', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Veli+Can&background=random',
        phoneNumber: 'Veli Can', hasReservation: true, history: SAMPLE_HISTORY
    },
    {
        id: '9', platform: 'x', name: 'TechNews', message: 'DM bakar mısınız?', time: 'Dün', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Tech+News&background=random',
        phoneNumber: '@technews', hasReservation: false, history: SAMPLE_HISTORY
    },
];

export default function ChatScreen() {
    // State Management
    const [activeTab, setActiveTab] = useState<'whatsapp' | 'instagram' | 'facebook' | 'x' | 'telegram'>('whatsapp');
    const [searchText, setSearchText] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    // Detail View State
    const [chatDetailVisible, setChatDetailVisible] = useState(false);
    const [selectedChat, setSelectedChat] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');

    // Filtering Logic
    const filteredMessages = MESSAGES_DATA.filter(item => {
        const matchesPlatform = item.platform === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.message.toLowerCase().includes(searchText.toLowerCase());
        const matchesUnread = showUnreadOnly ? item.unread > 0 : true;

        return matchesPlatform && matchesSearch && matchesUnread;
    });

    // Helper Functions
    const getBrandColor = (platform: string) => {
        switch (platform) {
            case 'whatsapp': return SOCIAL_COLORS.WHAT;
            case 'instagram': return SOCIAL_COLORS.INSTA;
            case 'facebook': return SOCIAL_COLORS.FACE;
            case 'x': return SOCIAL_COLORS.X;
            case 'telegram': return SOCIAL_COLORS.TELE;
            default: return Colors.primary;
        }
    };

    const getPlatformTheme = (platform: string) => {
        switch (platform) {
            case 'whatsapp':
                return { header: '#075E54', bg: '#ECE5DD', bubbleIn: '#fff', bubbleOut: '#DCF8C6', textIn: '#000', textOut: '#000', headerText: '#fff' };
            case 'instagram':
                return { header: '#fff', bg: '#fff', bubbleIn: '#efefef', bubbleOut: '#3797f0', textIn: '#000', textOut: '#fff', headerText: '#000', borderBottom: '#dbdbdb', statusBarStyle: 'dark-content' };
            case 'facebook':
                return { header: '#1877F2', bg: '#f0f2f5', bubbleIn: '#e4e6eb', bubbleOut: '#1877F2', textIn: '#050505', textOut: '#fff', headerText: '#fff' };
            case 'x':
                return { header: '#000', bg: '#fff', bubbleIn: '#eff3f4', bubbleOut: '#1d9bf0', textIn: '#0f1419', textOut: '#fff', headerText: '#fff' };
            case 'telegram':
                return { header: '#517da2', bg: '#d7e2ea', bubbleIn: '#fff', bubbleOut: '#effdd6', textIn: '#000', textOut: '#000', headerText: '#fff' };
            default:
                return { header: Colors.primary, bg: '#f5f5f5', bubbleIn: '#fff', bubbleOut: Colors.primary, textIn: '#000', textOut: '#fff', headerText: '#fff' };
        }
    };

    const handleOpenChat = (chat: Message) => {
        setSelectedChat(chat);
        setChatDetailVisible(true);
    };

    // Components
    const TabButton = ({ id, label, icon, color, iconLibrary }: { id: string, label: string, icon: any, color: string, iconLibrary?: any }) => {
        const isActive = activeTab === id;
        const IconComp = iconLibrary || Ionicons;

        return (
            <TouchableOpacity
                style={[
                    styles.tabButton,
                    isActive && { backgroundColor: color + '20', borderColor: color }
                ]}
                onPress={() => setActiveTab(id as any)}
            >
                <IconComp name={icon} size={20} color={isActive ? color : '#999'} />
                <Text style={[styles.tabText, isActive ? { color: color, fontWeight: '700' } : { color: '#999' }]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderMessageItem = ({ item }: { item: Message }) => (
        <TouchableOpacity style={styles.messageItem} onPress={() => handleOpenChat(item)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={styles.senderName}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.messageFooter}>
                    <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
                    {item.unread > 0 && (
                        <View style={[styles.unreadBadge, { backgroundColor: getBrandColor(item.platform) }]}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Detail Chat Modal Component
    const ChatDetailModal = () => {
        if (!selectedChat) return null;
        const theme = getPlatformTheme(selectedChat.platform);

        return (
            <Modal
                animationType="slide"
                visible={chatDetailVisible}
                onRequestClose={() => setChatDetailVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.header }}>
                    {/* Header */}
                    <View style={[styles.chatHeader, { backgroundColor: theme.header, borderBottomColor: theme.borderBottom, borderBottomWidth: theme.borderBottom ? 1 : 0 }]}>
                        <TouchableOpacity onPress={() => setChatDetailVisible(false)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
                            <Image source={{ uri: selectedChat.avatar }} style={styles.headerAvatar} />
                        </TouchableOpacity>

                        <View style={styles.headerInfo}>
                            <Text style={[styles.headerName, { color: theme.headerText }]}>{selectedChat.name}</Text>
                            <Text style={[styles.headerPhone, { color: theme.headerText }]} numberOfLines={1}>{selectedChat.phoneNumber}</Text>
                        </View>

                        <View style={[styles.reservationBadge, { backgroundColor: selectedChat.hasReservation ? '#4CAF50' : '#F44336' }]}>
                            <Text style={styles.reservationText}>
                                {selectedChat.hasReservation ? 'Rez: Var' : 'Rez: Yok'}
                            </Text>
                        </View>
                    </View>

                    {/* Chat Body */}
                    <View style={[styles.chatBody, { backgroundColor: theme.bg }]}>
                        <FlatList
                            data={selectedChat.history}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <View style={[
                                    styles.bubbleContainer,
                                    item.isSender ? styles.bubbleRight : styles.bubbleLeft
                                ]}>
                                    <View style={[
                                        styles.bubble,
                                        { backgroundColor: item.isSender ? theme.bubbleOut : theme.bubbleIn }
                                    ]}>
                                        <Text style={[
                                            styles.bubbleText,
                                            { color: item.isSender ? theme.textOut : theme.textIn }
                                        ]}>{item.text}</Text>
                                        <Text style={[
                                            styles.bubbleTime,
                                            { color: item.isSender ? theme.textOut + 'AA' : theme.textIn + '88' }
                                        ]}>{item.time}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                    {/* Footer Input */}
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
                        <TouchableOpacity style={styles.attachButton}>
                            <Ionicons name="add" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Mesaj yazın..."
                            value={replyText}
                            onChangeText={setReplyText}
                        />
                        <TouchableOpacity style={[
                            styles.sendButton,
                            { backgroundColor: replyText.trim() ? Colors.primary : '#ccc' }
                        ]}>
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header / Social Tabs */}
            <View style={styles.headerContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.headerTabsContent}
                >
                    <TabButton id="whatsapp" label="WhatsApp" icon="logo-whatsapp" color={SOCIAL_COLORS.WHAT} />
                    <TabButton id="instagram" label="Instagram" icon="logo-instagram" color={SOCIAL_COLORS.INSTA} />
                    <TabButton id="facebook" label="Facebook" icon="facebook" color={SOCIAL_COLORS.FACE} iconLibrary={FontAwesome5} />
                    <TabButton id="x" label="X" icon="logo-twitter" color={SOCIAL_COLORS.X} />
                    <TabButton id="telegram" label="Telegram" icon="paper-plane" color={SOCIAL_COLORS.TELE} />
                </ScrollView>
            </View>

            {/* Search and Distillation */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Mesajlarda ara..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                    <Ionicons name="options-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                data={filteredMessages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Mesaj bulunamadı.</Text>
                    </View>
                }
            />

            {/* Filter Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrele</Text>

                        {/* Filter Options */}
                        <View style={styles.filterOptionsContainer}>
                            {['Şube', 'Departman', 'Kullanıcı Tipi', 'Etikete Göre'].map((option, index) => (
                                <TouchableOpacity key={index} style={styles.filterOptionItem}>
                                    <Text style={styles.filterOptionText}>{option}</Text>
                                    <Ionicons name="chevron-down" size={20} color="#999" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Footer */}
                        <View style={styles.filterFooter}>
                            <TouchableOpacity
                                style={styles.unreadToggleContainer}
                                onPress={() => setShowUnreadOnly(!showUnreadOnly)}
                            >
                                <Ionicons
                                    name={showUnreadOnly ? "checkbox" : "square-outline"}
                                    size={20}
                                    color={showUnreadOnly ? Colors.primary : "#999"}
                                />
                                <Text style={[styles.unreadToggleText, showUnreadOnly && { color: Colors.primary }]}>
                                    Sadece Okunmamışları Göster
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setFilterModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>İptal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setFilterModalVisible(false)}
                                >
                                    <Text style={styles.applyButtonText}>Uygula</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Detail Chat Modal */}
            <ChatDetailModal />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    headerContainer: {
        height: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    headerTabsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 10,
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#eee',
        gap: 6,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 15,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    filterButton: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: '#eee',
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    senderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 10,
    },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    unreadText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 16,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    filterOptionsContainer: {
        gap: 12,
        marginBottom: 25,
    },
    filterOptionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    filterOptionText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    filterFooter: {
        marginTop: 10,
    },
    unreadToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    unreadToggleText: {
        fontSize: 13,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    applyButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: Colors.primary,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    // Chat Detail Styles
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ccc',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 10,
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerPhone: {
        fontSize: 12,
        opacity: 0.9,
    },
    reservationBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    reservationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    chatBody: {
        flex: 1,
    },
    bubbleContainer: {
        marginVertical: 4,
        width: '100%',
    },
    bubbleLeft: {
        alignItems: 'flex-start',
    },
    bubbleRight: {
        alignItems: 'flex-end',
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    bubbleText: {
        fontSize: 15,
        marginBottom: 4,
    },
    bubbleTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Lift up from bottom, especially for iOS Home Indicator
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    attachButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 24, // More rounded like WhatsApp/Messenger
        paddingHorizontal: 15,
        paddingVertical: 10, // Better vertical padding
        fontSize: 15,
        maxHeight: 100,
        marginHorizontal: 8, // More spacing
        borderWidth: 1,
        borderColor: '#eee',
    },
    sendButton: {
        width: 44, // Slightly larger touch target
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
});