import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform, Dimensions, Alert, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Simple Pie Chart Component
const SimplePieChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const size = 100;
    const radius = size / 2;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let startAngle = 0;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <G x={radius} y={radius}>
                    {data.map((item, index) => {
                        const angle = (item.value / total) * 360;
                        const largeArc = angle > 180 ? 1 : 0;
                        const x1 = radius * Math.cos((Math.PI * startAngle) / 180);
                        const y1 = radius * Math.sin((Math.PI * startAngle) / 180);
                        const x2 = radius * Math.cos((Math.PI * (startAngle + angle)) / 180);
                        const y2 = radius * Math.sin((Math.PI * (startAngle + angle)) / 180);

                        const d = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        startAngle += angle;

                        return (
                            <Path
                                key={index}
                                d={d}
                                fill={item.color}
                            />
                        );
                    })}
                    {/* Inner Circle for Donut effect (Optional, removed for Pie) */}
                </G>
            </Svg>
        </View>
    );
};


export default function SurveyResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const surveyTitle = params.title as string || 'Anket';
    const groupDate = '15.01.2016'; // Mock date as per requirement

    // Modal State
    const [modalVisible, setModalVisible] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const handleDownload = () => {
        setModalVisible(false);
        Alert.alert('Başarılı', 'Rapor cihazınıza indirildi.');
    };

    const handleSendAndDownload = () => {
        setModalVisible(false);
        Alert.alert('Başarılı', `Rapor ${email} adresine gönderildi ve indirildi.`);
        setEmail('');
    };

    // Mock Question Data
    const questions = [
        {
            id: 1,
            text: 'Çalıştığım kurumda farklılıklar yaratmak ve dinamik olmak isterim.',
            responses: [
                { label: 'Evet', value: 65, color: '#4caf50', isSelected: true },
                { label: 'Hayır', value: 20, color: '#f44336', isSelected: false },
                { label: 'Kararsızım', value: 15, color: '#ff9800', isSelected: false },
            ]
        },
        {
            id: 2,
            text: 'Yöneticimden aldığım geri bildirimler gelişimime katkı sağlıyor.',
            responses: [
                { label: 'Evet', value: 45, color: '#4caf50', isSelected: true },
                { label: 'Hayır', value: 30, color: '#f44336', isSelected: false },
                { label: 'Kararsızım', value: 25, color: '#ff9800', isSelected: false },
            ]
        },
        {
            id: 3,
            text: 'Şirket hedefleri ve stratejileri hakkında yeterince bilgi sahibiyim.',
            responses: [
                { label: 'Evet', value: 80, color: '#4caf50', isSelected: true },
                { label: 'Hayır', value: 10, color: '#f44336', isSelected: false },
                { label: 'Kararsızım', value: 10, color: '#ff9800', isSelected: false },
            ]
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5D48" />

            {/* Header */}
            <View style={styles.headerSection}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Detaylı Soru Analizi</Text>
                        <Text style={styles.headerSubtitle}>{surveyTitle} - Grup {groupDate}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.exportBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="share-outline" size={18} color="#fff" />
                        <Text style={styles.exportBtnText}>Dışarı Aktar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Export Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Raporu Dışarı Aktar veya Gönder</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Alıcı E-posta Adresi (İsteğe bağlı)</Text>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="ornek@sirket.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>İptal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.downloadBtn}
                                onPress={handleDownload}
                            >
                                <Text style={styles.downloadBtnText}>İndir</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sendBtn,
                                    !email && styles.disabledBtn
                                ]}
                                onPress={handleSendAndDownload}
                                disabled={!email}
                            >
                                <Ionicons name="mail-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                                <Text style={styles.sendBtnText}>Gönder</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <View style={styles.mainContent}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {questions.map((q, index) => (
                        <View key={q.id} style={styles.questionCard}>
                            <Text style={styles.questionLabel}>Soru {index + 1}</Text>
                            <Text style={styles.questionText}>{q.text}</Text>

                            <View style={styles.divider} />

                            <View style={styles.analysisRow}>
                                {/* Left: Response Distribution List */}
                                <View style={styles.distributionList}>
                                    <Text style={styles.distributionTitle}>Yanıt Dağılımı:</Text>
                                    {q.responses.map((resp, i) => (
                                        <View key={i} style={styles.responseItem}>
                                            <View style={[styles.dotIndicator, { backgroundColor: resp.color }]} />
                                            <Text style={styles.responseText}>{resp.label}</Text>
                                            {resp.isSelected && (
                                                <Ionicons name="checkmark-circle" size={16} color="#4caf50" style={{ marginLeft: 6 }} />
                                            )}
                                            <Text style={styles.responseValue}>%{resp.value}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Right: Pie Chart */}
                                <View style={styles.chartContainer}>
                                    <SimplePieChart data={q.responses} />
                                </View>
                            </View>
                        </View>
                    ))}

                    <View style={{ height: 40 }} />
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
        paddingBottom: 20,
        marginTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginLeft: 10,
    },
    exportBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    questionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1A5D48',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    questionText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    analysisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    distributionList: {
        flex: 1,
        marginRight: 10,
    },
    distributionTitle: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    responseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dotIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    responseText: {
        fontSize: 13,
        color: '#444',
    },
    responseValue: {
        fontSize: 12,
        color: '#999',
        marginLeft: 'auto',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
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
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    emailInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#333',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    cancelBtnText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 13,
    },
    downloadBtn: {
        backgroundColor: '#e8f5e9',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#c8e6c9',
        marginHorizontal: 5,
    },
    downloadBtnText: {
        color: '#1A5D48',
        fontWeight: '600',
        fontSize: 13,
    },
    sendBtn: {
        backgroundColor: '#1A5D48',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    disabledBtn: {
        backgroundColor: '#ccc',
    },
});
