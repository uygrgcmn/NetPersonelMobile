import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { DashboardItem, Activity } from '../../src/types';
import { DashboardCard } from '../../src/components/cards/DashboardCard';

// Mock Data
const DASHBOARD_ITEMS = [
    {
        id: '1',
        title: 'Çalışanlar & Misafirler',
        count: '120 | 15',
        icon: 'people',
        iconLib: Ionicons,
        color: '#4caf50', // Green
        subtext: 'Aktif çalışan ve misafirler'
    },
    {
        id: '2',
        title: 'Şubeler',
        count: '8',
        icon: 'business',
        iconLib: Ionicons,
        color: '#2196f3', // Blue
        subtext: 'Toplam Şube'
    },
    {
        id: '3',
        title: 'Departmanlar',
        count: '12',
        icon: 'layers',
        iconLib: Ionicons,
        color: '#9c27b0', // Purple
        subtext: 'Aktif Departman'
    },
    {
        id: '4',
        title: 'Aktif Anketler',
        count: '3',
        icon: 'poll',
        iconLib: MaterialCommunityIcons,
        color: '#ff9800', // Orange
        subtext: 'Katılım Bekleyen'
    },

    {
        id: '6',
        title: 'Dosyalar',
        count: '42',
        icon: 'folder-open',
        iconLib: Ionicons,
        color: '#00bcd4', // Cyan
        subtext: 'Yüklenen Belgeler'
    },
    {
        id: '7',
        title: 'Mesaj Şablonları',
        count: '9',
        icon: 'chatbox-ellipses',
        iconLib: Ionicons,
        color: '#795548', // Brown
        subtext: 'Hazır Şablon'
    },
];

const BRANCH_CREDITS = [
    { id: 1, name: 'Merkez Şube', used: 85, total: 100, color: '#dc3545' }, // Critical
    { id: 2, name: 'İstanbul Şube', used: 45, total: 100, color: '#28a745' }, // Good
    { id: 3, name: 'Ankara Şube', used: 60, total: 100, color: '#ffc107' }, // Warning
    { id: 4, name: 'İzmir Şube', used: 30, total: 100, color: '#28a745' },
];

const SURVEY_STATS = [
    { name: 'Reddedildi', count: 45, color: '#dc3545' },    // Kırmızı
    { name: 'Tamamlandı', count: 30, color: '#28a745' },    // Yeşil
    { name: 'Bekliyor', count: 15, color: '#ff9800' },      // Turuncu
    { name: 'Devam Ediyor', count: 10, color: '#6f42c1' },  // Mor
    { name: 'Zamanlandı', count: 5, color: '#17a2b8' },     // Mavi
    { name: 'Süresi Doldu', count: 3, color: '#343a40' },   // Koyu Gri
    { name: 'İptal Edildi', count: 2, color: '#6c757d' },   // Gri
];

const RECENT_ACTIVITIES = [
    { id: '1', title: 'Yeni Dosya Yüklendi', desc: 'İK Yönetmeliği.pdf sisteme eklendi.', time: '10:30', icon: 'cloud-upload', color: '#00bcd4', iconLib: Ionicons },
    { id: '2', title: 'Yeni Kullanıcı', desc: 'Ahmet Yılmaz (Satış) eklendi.', time: 'Dün', icon: 'person-add', color: '#4caf50', iconLib: Ionicons },
    { id: '3', title: 'Anket Oluşturuldu', desc: 'Memnuniyet Anketi yayına alındı.', time: 'Pzt', icon: 'poll', color: '#ff9800', iconLib: MaterialCommunityIcons },
    { id: '4', title: 'Duyuru Paylaşıldı', desc: 'Ofis tadilatı hakkında duyuru.', time: '15 Oca', icon: 'megaphone', color: '#e91e63', iconLib: Ionicons },
];

const PERFORMANCE_METRICS = [
    { id: '1', title: 'Anket Yanıt Oranı', value: '%90', progress: 0.9, color: '#4caf50', icon: 'checkbox-marked-circle-outline', iconLib: MaterialCommunityIcons },
    { id: '2', title: 'Mesaj Ulaşım Oranı', value: '%95', progress: 0.95, color: '#2196f3', icon: 'message-check-outline', iconLib: MaterialCommunityIcons },
    { id: '3', title: 'Kullanıcı Katılımı', value: '%70', progress: 0.7, color: '#ff9800', icon: 'account-group-outline', iconLib: MaterialCommunityIcons },
    { id: '4', title: 'Depolama Kullanımı', value: '13.43MB / 10GB', progress: 0.01, color: '#e91e63', icon: 'cloud-outline', iconLib: Ionicons },
];

export default function HomeScreen() {
    const router = useRouter();
    const currentDate = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });



    // --- PIE CHART LOGIC ---
    const totalSurveyCount = SURVEY_STATS.reduce((acc, cur) => acc + cur.count, 0);
    let startAngle = 0;

    const PieSlice = ({ startAngle, angle, color }: any) => {
        const radius = 60;
        const strokeWidth = 20;
        const center = 70;

        // Basit bir D yay çizimi (Matematiksel)
        const x1 = center + radius * Math.cos(Math.PI * startAngle / 180);
        const y1 = center + radius * Math.sin(Math.PI * startAngle / 180);
        const x2 = center + radius * Math.cos(Math.PI * (startAngle + angle) / 180);
        const y2 = center + radius * Math.sin(Math.PI * (startAngle + angle) / 180);

        const largeArc = angle > 180 ? 1 : 0;

        // Donut chart path
        return (
            <Path
                d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={color}
                stroke="#fff"
                strokeWidth="2"
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5D48" />

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hoş geldiniz,<Text style={styles.greeting}>Uygar</Text></Text>

                    <Text style={styles.dateText}>{currentDate}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[styles.notificationButton, { marginRight: 10 }]} onPress={() => router.replace('/login')}>
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color="#fff" />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Grid */}
            <View style={styles.mainContent}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Genel Bakış</Text>
                    <View style={styles.gridContainer}>
                        {DASHBOARD_ITEMS.map((item) => (
                            <DashboardCard key={item.id} item={item} />
                        ))}
                    </View>

                    {/* SECTION 1: Şube Bazında Kredi Kullanımı */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Şube Bazında Kredi Kullanımı</Text>
                        <Text style={styles.sectionSubtitle}>Her şube için mevcut kredi bakiyesi</Text>
                        <View style={styles.cardLike}>
                            {BRANCH_CREDITS.map((branch) => (
                                <View key={branch.id} style={styles.creditRow}>
                                    <View style={styles.creditInfo}>
                                        <Text style={styles.branchName}>{branch.name}</Text>
                                        <Text style={styles.creditPercent}>%{branch.used}</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { width: `${branch.used}%`, backgroundColor: branch.color }
                                            ]}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* SECTION 2: Son Anketin Durumu */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Son Anketin Durumu</Text>
                        <Text style={styles.sectionSubtitle}>Mevcut dağılım</Text>
                        <View style={styles.cardLikeRow}>
                            {/* Sol: Pie Chart */}
                            <View style={styles.pieContainer}>
                                <Svg height="140" width="140" viewBox="0 0 140 140">
                                    {SURVEY_STATS.map((stat, index) => {
                                        const angle = (stat.count / totalSurveyCount) * 360;
                                        const slice = <PieSlice key={index} startAngle={startAngle} angle={angle} color={stat.color} />;
                                        startAngle += angle;
                                        return slice;
                                    })}
                                    {/* Ortadaki Beyaz Daire (Donut Efekti için) */}
                                    <Circle cx="70" cy="70" r="35" fill="#fff" />
                                </Svg>
                            </View>

                            {/* Sağ: Legend (Açıklamalar) */}
                            <View style={styles.legendContainer}>
                                {SURVEY_STATS.map((stat, index) => (
                                    <View key={index} style={styles.legendRow}>
                                        <View style={[styles.legendDot, { backgroundColor: stat.color }]} />
                                        <Text style={styles.legendText}>{stat.name}</Text>
                                        <Text style={styles.legendCount}>({stat.count})</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* SECTION 3: Son Aktiviteler */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
                        <Text style={styles.sectionSubtitle}>Organizasyonunuzdaki son işlemler</Text>
                        <View style={styles.cardLike}>
                            {RECENT_ACTIVITIES.map((item, index) => {
                                const IconComp = item.iconLib;
                                return (
                                    <View key={item.id}>
                                        <View style={styles.activityRow}>
                                            <View style={[styles.activityIcon, { backgroundColor: item.color + '15' }]}>
                                                <IconComp icon={item.icon} size={20} color={item.color} />
                                            </View>
                                            <View style={styles.activityContent}>
                                                <Text style={styles.activityTitle}>{item.title}</Text>
                                                <Text style={styles.activityDesc}>{item.desc}</Text>
                                            </View>
                                            <Text style={styles.activityTime}>{item.time}</Text>
                                        </View>
                                        {index < RECENT_ACTIVITIES.length - 1 && <View style={styles.divider} />}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* SECTION 4: Performans Metrikleri */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Performans Metrikleri</Text>
                        <Text style={styles.sectionSubtitle}>Sistem sağlık göstergeleri</Text>
                        <View style={styles.cardLike}>
                            {PERFORMANCE_METRICS.map((metric, index) => {
                                const IconComp = metric.iconLib;
                                return (
                                    <View key={metric.id}>
                                        <View style={styles.metricRow}>
                                            <View style={[styles.metricIcon, { backgroundColor: metric.color + '15' }]}>
                                                <IconComp icon={metric.icon} size={22} color={metric.color} />
                                            </View>
                                            <View style={styles.metricContent}>
                                                <View style={styles.metricHeader}>
                                                    <Text style={styles.metricTitle}>{metric.title}</Text>
                                                    <Text style={styles.metricValue}>{metric.value}</Text>
                                                </View>
                                                <View style={styles.metricProgressBg}>
                                                    <View
                                                        style={[
                                                            styles.metricProgressFill,
                                                            { width: `${metric.progress * 100}%`, backgroundColor: metric.color }
                                                        ]}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        {index < PERFORMANCE_METRICS.length - 1 && <View style={styles.divider} />}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Bottom padding for tab bar */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A5D48', // Main Green Background
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 25, // Adjusted padding
        marginTop: 10,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
    },
    greeting: {
        fontSize: 18,
        color: '#ffffffff',
        fontWeight: 'bold',
    },

    dateText: {
        fontSize: 13,
        color: '#ffffffff',
        marginTop: 4,
    },
    notificationButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.15)', // Semi-transparent white
        borderRadius: 12,
        marginTop: 5,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingTop: 25, // Add padding to separate from top edge
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 5,
        marginBottom: 15,
        marginTop: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Slightly less than 50% for gap
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    cardContent: {
        width: '100%',
    },
    cardCount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },
    cardSubtext: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    arrowIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    chartSection: {
        paddingHorizontal: 5,
        marginBottom: 20,
    },
    cardLike: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    cardLikeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    creditRow: {
        marginBottom: 15,
    },
    creditInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    branchName: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    creditPercent: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    pieContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendContainer: {
        flex: 1,
        paddingLeft: 20,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendText: {
        fontSize: 12,
        color: '#555',
        flex: 1,
    },
    legendCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    activityDesc: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    activityTime: {
        fontSize: 11,
        color: '#999',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 55,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#888',
        marginLeft: 5,
        marginBottom: 10,
        marginTop: -10,
    },
    metricRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    metricIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    metricContent: {
        flex: 1,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    metricTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    metricValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    metricProgressBg: {
        height: 6,
        backgroundColor: '#f5f5f5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    metricProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
});