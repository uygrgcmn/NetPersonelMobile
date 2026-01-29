import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

// Renk Sabitleri
const SOCIAL_COLORS = {
    WHAT: '#25D366',
    INSTA: '#C13584', // Gradient kullanılacak ama sabit renk yedeği
    FACE: '#1877F2',
};

// Mock Data (Örnek Veriler) - Gerçek uygulamada API'den gelecek
const MESSAGES_DATA = [
    { id: '1', platform: 'whatsapp', name: 'Uygar Ali Göçmen', message: 'Sipariş durumunu öğrenebilir miyim?', time: '10:30', unread: 2, avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random' },
    { id: '2', platform: 'instagram', name: 'moda_butik', message: 'Fiyat bilgisi alabilir miyim?', time: '09:45', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Moda+Butik&background=random' },
    { id: '3', platform: 'facebook', name: 'Mustafa Demir', message: 'Ürün stokta var mı?', time: 'Dün', unread: 1, avatar: 'https://ui-avatars.com/api/?name=Mustafa+Demir&background=random' },
    { id: '4', platform: 'whatsapp', name: 'Morphosium', message: 'Teşekkürler, iyi çalışmalar.', time: 'Dün', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Ayse+Kaya&background=random' },
    { id: '5', platform: 'instagram', name: 'sport_life', message: 'Kargo ne zaman çıkar?', time: 'Pzt', unread: 5, avatar: 'https://ui-avatars.com/api/?name=Sport+Life&background=random' },
    { id: '6', platform: 'facebook', name: 'Veli Can', message: 'Adres bilgisini güncelledim.', time: 'Pzt', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Veli+Can&background=random' },
    { id: '7', platform: 'whatsapp', name: 'Ahmet Yılmaz', message: 'Sipariş durumunu öğrenebilir miyim?', time: '10:30', unread: 2, avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random' },
    { id: '8', platform: 'instagram', name: 'moda_butik', message: 'Fiyat bilgisi alabilir miyim?', time: '09:45', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Moda+Butik&background=random' },
    { id: '9', platform: 'facebook', name: 'Mustafa Demir', message: 'Ürün stokta var mı?', time: 'Dün', unread: 1, avatar: 'https://ui-avatars.com/api/?name=Mustafa+Demir&background=random' },
    { id: '10', platform: 'whatsapp', name: 'Hasan Kalyoncu Universitesi', message: 'Teşekkürler, iyi çalışmalar.', time: 'Dün', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Ayse+Kaya&background=random' },
    { id: '11', platform: 'instagram', name: 'sport_life', message: 'Kargo ne zaman çıkar?', time: 'Pzt', unread: 5, avatar: 'https://ui-avatars.com/api/?name=Sport+Life&background=random' },
    { id: '12', platform: 'facebook', name: 'Veli Can', message: 'Adres bilgisini güncelledim.', time: 'Pzt', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Veli+Can&background=random' },
    { id: '13', platform: 'whatsapp', name: 'Ahmet Sevban Uysal', message: 'Sipariş durumunu öğrenebilir miyim?', time: '10:30', unread: 2, avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random' },
    { id: '14', platform: 'instagram', name: 'moda_butik', message: 'Fiyat bilgisi alabilir miyim?', time: '09:45', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Moda+Butik&background=random' },
    { id: '15', platform: 'facebook', name: 'Mustafa Demir', message: 'Ürün stokta var mı?', time: 'Dün', unread: 1, avatar: 'https://ui-avatars.com/api/?name=Mustafa+Demir&background=random' },
    { id: '16', platform: 'whatsapp', name: 'Ayşe Kaya', message: 'Teşekkürler, iyi çalışmalar.', time: 'Dün', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Ayse+Kaya&background=random' },
    { id: '17', platform: 'instagram', name: 'sport_life', message: 'Kargo ne zaman çıkar?', time: 'Pzt', unread: 5, avatar: 'https://ui-avatars.com/api/?name=Sport+Life&background=random' },
    { id: '18', platform: 'facebook', name: 'Veli Can', message: 'Adres bilgisini güncelledim.', time: 'Pzt', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Veli+Can&background=random' },



    // ... daha fazla veri eklenebilir
];

export default function ChatScreen() {
    const [activeTab, setActiveTab] = useState<'whatsapp' | 'instagram' | 'facebook'>('whatsapp');
    const [searchText, setSearchText] = useState('');

    // Sadece seçili tab'a ait mesajları filtrele
    const filteredMessages = MESSAGES_DATA.filter(item => item.platform === activeTab);

    // Tab Butonu Bileşeni
    const TabButton = ({ id, label, icon, color, iconLibrary }: any) => {
        const isActive = activeTab === id;
        const IconComp = iconLibrary || Ionicons; // Varsayılan Ionicons, ama Facebook için FontAwesome gerekebilir

        return (
            <TouchableOpacity
                style={[
                    styles.tabButton,
                    isActive && { backgroundColor: color + '20', borderColor: color } // Aktifse hafif arka plan
                ]}
                onPress={() => setActiveTab(id)}
            >
                <IconComp name={icon} size={20} color={isActive ? color : '#999'} />
                <Text style={[styles.tabText, isActive ? { color: color, fontWeight: '700' } : { color: '#999' }]}>
                    {label}
                </Text>
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </TouchableOpacity>
        );
    };

    const renderMessageItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.messageItem}>
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

    const getBrandColor = (platform: string) => {
        if (platform === 'whatsapp') return SOCIAL_COLORS.WHAT;
        if (platform === 'instagram') return SOCIAL_COLORS.INSTA;
        if (platform === 'facebook') return SOCIAL_COLORS.FACE;
        return Colors.primary;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* 1. ÜST KISIM: Sosyal Medya Tabları */}
            <View style={styles.headerTabsContainer}>
                <TabButton
                    id="whatsapp"
                    label="WhatsApp"
                    icon="logo-whatsapp"
                    color={SOCIAL_COLORS.WHAT}
                />
                <TabButton
                    id="instagram"
                    label="Instagram"
                    icon="logo-instagram"
                    color={SOCIAL_COLORS.INSTA}
                />
                <TabButton
                    id="facebook"
                    label="Facebook"
                    icon="facebook"
                    color={SOCIAL_COLORS.FACE}
                    iconLibrary={FontAwesome5} // Facebook ikonu için FontAwesome daha iyi
                />
            </View>

            {/* 2. ARA KISIM: Arama ve Filtre */}
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
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {/* 3. LİSTE: Mesajlar */}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    headerTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#f0f0f0',
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent', // Aktif değilken border yok
        gap: 6,
        position: 'relative',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -6,
        left: 20,
        right: 20,
        height: 3,
        borderRadius: 2,
        display: 'none', // Border ve renk değişimi yeterli olduğu için alt çizgiyi kapattım, istenirse açılabilir
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
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
        paddingBottom: 100, // Tab bar'ın altında kalmasın diye
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
});