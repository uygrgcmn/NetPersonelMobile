import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreateSurveyScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startMessage, setStartMessage] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Hata', 'Lütfen anket başlığını giriniz.');
            return;
        }
        // Simulate API save
        setIsSaved(true);
        Alert.alert('Başarılı', 'Anket taslağı oluşturuldu. Şimdi soru ekleyebilirsiniz.');
    };

    const handleAddQuestion = () => {
        if (!isSaved) {
            Alert.alert('Uyarı', 'Soru ekleyebilmek için önce anketi kaydetmelisiniz.');
            return;
        }
        // Logic to add question would go here
        Alert.alert('Bilgi', 'Soru ekleme ekranı açılacak.');
    };

    const handleBrowseQuestionPool = () => {
        if (!isSaved) {
            Alert.alert('Uyarı', 'Soru havuzuna bakmak için önce anketi kaydetmelisiniz.');
            return;
        }
        Alert.alert('Bilgi', 'Soru havuzu açılacak.');
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
                    <Text style={styles.headerTitle}>Anket Oluştur</Text>
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
                                placeholder="Anket başlığı"
                                placeholderTextColor="#999"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Açıklama</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Anket açıklaması..."
                                placeholderTextColor="#999"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Başlangıç Mesaj Şablonu</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Ankete başlarken görünecek mesaj..."
                                placeholderTextColor="#999"
                                value={startMessage}
                                onChangeText={setStartMessage}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Action Buttons Row */}
                    <View style={styles.mainActionsRow}>
                        <TouchableOpacity
                            style={styles.browseSystemBtn}
                            onPress={() => router.push('/system-default-surveys')}
                        >
                            <Ionicons name="library-outline" size={18} color="#1A5D48" style={{ marginRight: 6 }} />
                            <Text style={styles.browseSystemBtnText}>Sistem Anketlerine Göz At</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveBtn, isSaved && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={isSaved}
                        >
                            <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.saveBtnText}>{isSaved ? 'Kaydedildi' : 'Anketi Kaydet'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Questions Section */}
                    <View style={[styles.sectionContainer, !isSaved && styles.disabledSection]}>
                        <View style={styles.questionsHeader}>
                            <Text style={styles.sectionTitle}>Sorular</Text>
                            <View style={styles.questionsActions}>
                                <TouchableOpacity
                                    style={styles.questionActionBtn}
                                    onPress={handleBrowseQuestionPool}
                                >
                                    <Text style={styles.questionActionText}>Soru Havuzuna Göz at</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.questionActionBtn, styles.addQuestionBtn]}
                                    onPress={handleAddQuestion}
                                >
                                    <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 4 }} />
                                    <Text style={[styles.questionActionText, { color: '#fff' }]}>Soru Ekle</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {!isSaved ? (
                            <View style={styles.emptyStateContainer}>
                                <Ionicons name="lock-closed-outline" size={40} color="#ccc" />
                                <Text style={styles.emptyStateText}>Soru eklemek için önce anketi kaydediniz.</Text>
                            </View>
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <MaterialCommunityIcons name="clipboard-list-outline" size={40} color="#ccc" />
                                <Text style={styles.emptyStateText}>Henüz soru eklenmemiş.</Text>
                            </View>
                        )}

                    </View>

                    {/* Bottom Padding */}
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
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
        height: 100,
    },
    mainActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    browseSystemBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e8f5e9',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    browseSystemBtnText: {
        color: '#1A5D48',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
    },
    saveBtn: {
        flex: 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A5D48',
        paddingVertical: 12,
        borderRadius: 12,
    },
    saveBtnDisabled: {
        backgroundColor: '#8dafab',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 20,
    },
    questionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    questionsActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    questionActionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    addQuestionBtn: {
        backgroundColor: '#1A5D48',
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionActionText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
    },
    disabledSection: {
        opacity: 0.7,
    },
    emptyStateContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#eee',
    },
    emptyStateText: {
        marginTop: 10,
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
    },
});
