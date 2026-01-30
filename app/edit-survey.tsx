import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, SafeAreaView, Platform, Alert, Modal, FlatList, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock Question Pool Data
const QUESTION_POOL = [
    { id: 'p1', text: 'Çalışma ortamımdan memnunum.', type: 'Ölçek', category: 'Memnuniyet' },
    { id: 'p2', text: 'Yöneticimle iletişimim güçlüdür.', type: 'Ölçek', category: 'Yönetim' },
    { id: 'p3', text: 'Maaş ve yan haklarım yeterlidir.', type: 'Ölçek', category: 'Finans' },
    { id: 'p4', text: 'Şirket hedeflerini net anlıyorum.', type: 'Ölçek', category: 'Vizyon' },
    { id: 'p5', text: 'Eğitim olanakları yeterlidir.', type: 'Ölçek', category: 'Gelişim' },
];

export default function EditSurveyScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Survey State
    const [title, setTitle] = useState(params.title ? String(params.title) : 'Memnuniyet Anketi');
    const [description, setDescription] = useState('Çalışan memnuniyetini ölçmek için yıllık anket.');
    const [startMessage, setStartMessage] = useState('Bu anket çalışan memnuniyetini değerlendirmek amacıyla hazırlanmıştır. Katılımınız anonimdir.');

    // Questions State
    const [questions, setQuestions] = useState<any[]>([
        {
            id: 'q1',
            text: 'Çalıştığım kurumda farklılıklar yaratmak ve dinamik olmak isterim.',
            type: 'Çoktan Seçmeli',
            options: ['Evet', 'Hayır', 'Kararsızım']
        },
        {
            id: 'q2',
            text: 'Yöneticim beni takdir eder.',
            type: 'Çoktan Seçmeli',
            options: ['Her Zaman', 'Bazen', 'Hiçbir Zaman']
        }
    ]);

    // Modal State
    const [isQuestionModalVisible, setQuestionModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'new' | 'pool'>('new');

    // New Question Form State
    const [newQTitle, setNewQTitle] = useState('');
    const [newQText, setNewQText] = useState('');
    const [newQType, setNewQType] = useState('Çoktan Seçmeli');
    const [newQCategory, setNewQCategory] = useState('');
    const [newQFooter, setNewQFooter] = useState('');

    const handleUpdateSurvey = () => {
        Alert.alert('Başarılı', 'Anket güncellendi.');
        // router.back();
    };

    const handleDeleteQuestion = (id: string) => {
        Alert.alert('Sil', 'Bu soruyu silmek istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Sil', style: 'destructive', onPress: () => setQuestions(q => q.filter(item => item.id !== id)) }
        ]);
    };

    const handleAddQuestionFromPool = (poolQuestion: any) => {
        const newQuestion = {
            id: Date.now().toString(),
            text: poolQuestion.text,
            type: 'Çoktan Seçmeli', // Default for now
            options: ['Evet', 'Hayır', 'Kararsızım']
        };
        setQuestions([...questions, newQuestion]);
        setQuestionModalVisible(false);
        Alert.alert('Eklendi', 'Soru havuzundan eklendi.');
    };

    const handleAddNewQuestion = () => {
        if (!newQText.trim()) {
            Alert.alert('Hata', 'Soru metni zorunludur.');
            return;
        }
        const newQuestion = {
            id: Date.now().toString(),
            text: newQText,
            type: newQType,
            options: ['Evet', 'Hayır', 'Kararsızım'] // Mock default options
        };
        setQuestions([...questions, newQuestion]);
        setQuestionModalVisible(false);

        // Reset form
        setNewQTitle('');
        setNewQText('');
        setNewQCategory('');
        setNewQFooter('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5D48" />

            {/* Header */}
            <View style={styles.headerSection}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Anketi Düzenle</Text>
                </View>
            </View>

            <View style={styles.mainContent}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Survey Info Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Anket Bilgileri</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Anket Başlığı</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Açıklama</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Başlangıç Mesaj Şablonu</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={startMessage}
                                onChangeText={setStartMessage}
                                multiline
                            />
                        </View>

                        <View style={styles.infoActions}>
                            <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/system-default-surveys')}>
                                <Text style={styles.linkBtnText}>Sistem Anketlerine Göz At</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateSurvey}>
                                <Text style={styles.updateBtnText}>Anketi Güncelle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Questions Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.questionsHeader}>
                            <Text style={styles.sectionTitle}>Sorular ({questions.length})</Text>
                            <View style={styles.questionsActions}>
                                <TouchableOpacity
                                    style={styles.actionBtnOutline}
                                    onPress={() => {
                                        setActiveTab('pool');
                                        setQuestionModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.actionBtnOutlineText}>Soru Havuzu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionBtnFilled}
                                    onPress={() => {
                                        setActiveTab('new');
                                        setQuestionModalVisible(true);
                                    }}
                                >
                                    <Ionicons name="add" size={16} color="#fff" />
                                    <Text style={styles.actionBtnFilledText}>Soru Ekle</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {questions.map((q, index) => (
                            <View key={q.id} style={styles.questionCard}>
                                <View style={styles.questionHeader}>
                                    <View style={styles.questionTitleRow}>
                                        <View style={styles.questionIndexBadge}>
                                            <Text style={styles.questionIndexText}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.questionText}>{q.text}</Text>
                                    </View>
                                    <View style={styles.questionItemActions}>
                                        <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Düzenle', 'Soru düzenleme açılacak.')}>
                                            <Feather name="edit-2" size={18} color="#ff9800" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconBtn} onPress={() => handleDeleteQuestion(q.id)}>
                                            <Feather name="trash-2" size={18} color="#f44336" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.optionsContainer}>
                                    {q.options?.map((opt: string, i: number) => (
                                        <View key={i} style={styles.optionBadge}>
                                            <Text style={styles.optionText}>{opt}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={{ height: 60 }} />
                </ScrollView>
            </View>

            {/* Add Question Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isQuestionModalVisible}
                onRequestClose={() => setQuestionModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Soru Yönetimi</Text>
                            <TouchableOpacity onPress={() => setQuestionModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'new' && styles.activeTab]}
                                onPress={() => setActiveTab('new')}
                            >
                                <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>Yeni Soru Oluştur</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'pool' && styles.activeTab]}
                                onPress={() => setActiveTab('pool')}
                            >
                                <Text style={[styles.tabText, activeTab === 'pool' && styles.activeTabText]}>Soru Havuzu</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                            {activeTab === 'new' ? (
                                <View style={styles.formContainer}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Soru Tipi</Text>
                                        <View style={styles.readOnlyInput}>
                                            <Text style={{ color: '#333' }}>Çoktan Seçmeli (Tek Seçim)</Text>
                                            <Ionicons name="chevron-down" size={16} color="#666" />
                                        </View>
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Başlık (İsteğe Bağlı)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Örn: Motivasyon"
                                            value={newQTitle}
                                            onChangeText={setNewQTitle}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Soru Metni</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            placeholder="Sorunuzu buraya yazın..."
                                            multiline
                                            value={newQText}
                                            onChangeText={setNewQText}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Alt Bilgi (İsteğe Bağlı)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Soru altında görünecek açıklama"
                                            value={newQFooter}
                                            onChangeText={setNewQFooter}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Kategori</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Örn: Genel Memnuniyet"
                                            value={newQCategory}
                                            onChangeText={setNewQCategory}
                                        />
                                    </View>

                                    <View style={{ height: 20 }} />
                                    <TouchableOpacity style={styles.blockBtn} onPress={handleAddNewQuestion}>
                                        <Text style={styles.blockBtnText}>Soru Ekle</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.poolContainer}>
                                    <Text style={styles.poolInfo}>Listeden eklemek istediğiniz sorulara tıklayın.</Text>
                                    {QUESTION_POOL.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.poolItem}
                                            onPress={() => handleAddQuestionFromPool(item)}
                                        >
                                            <View style={styles.poolItemContent}>
                                                <Text style={styles.poolItemText}>{item.text}</Text>
                                                <Text style={styles.poolItemMeta}>{item.category} • {item.type}</Text>
                                            </View>
                                            <Ionicons name="add-circle-outline" size={24} color="#1A5D48" />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
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
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A5D48',
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#eee',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    infoActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    linkBtn: {
        paddingVertical: 10,
    },
    linkBtnText: {
        color: '#2196f3',
        fontWeight: '600',
        fontSize: 13,
    },
    updateBtn: {
        backgroundColor: '#1A5D48',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    updateBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 20,
    },
    // Questions Styles
    questionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    questionsActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtnOutline: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    actionBtnOutlineText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
    },
    actionBtnFilled: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: '#1A5D48',
    },
    actionBtnFilledText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
    },
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    questionTitleRow: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
    },
    questionIndexBadge: {
        backgroundColor: '#e8f5e9',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    questionIndexText: {
        color: '#1A5D48',
        fontWeight: 'bold',
        fontSize: 12,
    },
    questionText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1,
        lineHeight: 20,
    },
    questionItemActions: {
        flexDirection: 'row',
        gap: 5,
    },
    iconBtn: {
        padding: 5,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginLeft: 34,
    },
    optionBadge: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    optionText: {
        fontSize: 11,
        color: '#666',
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
        height: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 15,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#1A5D48',
    },
    tabText: {
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#1A5D48',
    },
    modalScroll: {
        paddingBottom: 30,
    },
    formContainer: {
        marginTop: 5,
    },
    readOnlyInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    blockBtn: {
        backgroundColor: '#1A5D48',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    blockBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Pool Styles
    poolContainer: {
        marginTop: 5,
    },
    poolInfo: {
        fontSize: 13,
        color: '#666',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    poolItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    poolItemContent: {
        flex: 1,
        marginRight: 10,
    },
    poolItemText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
    },
    poolItemMeta: {
        fontSize: 12,
        color: '#888',
    },
});
