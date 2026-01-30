import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock Data for System Default Surveys
const SYSTEM_SURVEYS_DATA = [
    {
        id: '1',
        title: '360 Anket',
        description: 'Çalışanların performansını her açıdan değerlendirin.',
        questionCount: 10,
        previewAvailable: true,
    },
    {
        id: '2',
        title: 'Çalışan Memnuniyeti',
        description: 'Şirket içi motivasyon ve bağlılık ölçümü.',
        questionCount: 15,
        previewAvailable: true,
    },
    {
        id: '3',
        title: 'Eğitim Değerlendirme',
        description: 'Verilen eğitimlerin etkinliğini ölçün.',
        questionCount: 8,
        previewAvailable: true,
    },
];

export default function SystemDefaultSurveysScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5D48" />

            {/* 1. Header Section */}
            <View style={styles.headerSection}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sistem Varsayılan Anketleri</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    Şirketinize önceden tanımlanmış sistem anketlerine göz atın ve kopyalayın.
                </Text>
            </View>

            <View style={styles.mainContent}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.listContainer}>
                        {SYSTEM_SURVEYS_DATA.map((item) => (
                            <View key={item.id} style={styles.surveyCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.surveyTitle}>{item.title}</Text>
                                        {item.previewAvailable && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>Önizleme Mevcut</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <Text style={styles.surveyDesc}>{item.description}</Text>

                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons name="format-list-bulleted" size={16} color="#666" />
                                    <Text style={styles.questionCountText}>{item.questionCount} Soru</Text>
                                </View>

                                {/* Actions Row */}
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity style={styles.actionBtnSecondary}>
                                        <Ionicons name="eye-outline" size={16} color="#666" style={{ marginRight: 4 }} />
                                        <Text style={styles.actionBtnTextSecondary}>Önizle</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionBtnPrimary}>
                                        <Ionicons name="copy-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                                        <Text style={styles.actionBtnText}>Anketi Kullan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
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
        paddingBottom: 25,
        marginTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
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
        alignItems: 'center',
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
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
        gap: 10,
    },
    actionBtnPrimary: {
        backgroundColor: '#1A5D48',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    actionBtnSecondary: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtnTextSecondary: {
        color: '#666',
        fontWeight: '600',
        fontSize: 13,
    },
});
