import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Circular Progress Component
const CircularProgress = ({ percentage, color, label, centerValue }: { percentage: number, color: string, label: string, centerValue?: string }) => {
    const size = 100;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressDask = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.chartContainer}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e6e6e6"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={progressDask}
                        strokeLinecap="round"
                    />
                </G>
                {centerValue && (
                    <View style={styles.chartCenterTextContainer}>
                        <Text style={[styles.chartCenterText, { color: color }]}>{centerValue}</Text>
                    </View>
                )}
            </Svg>
            <Text style={styles.chartLabel}>{label}</Text>
        </View>
    );
};

// Donut Chart Component
const DonutChart = ({ completed, notCompleted }: { completed: number, notCompleted: number }) => {
    const total = completed + notCompleted;
    const completedPercentage = (completed / total) * 100;

    const size = 160;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressDask = circumference - (completedPercentage / 100) * circumference;

    return (
        <View style={styles.donutContainer}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background Circle (Not Completed) */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FF6B6B"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Foreground Circle (Completed) */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#4ECDC4"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={progressDask}
                        strokeLinecap="butt"
                    />
                </G>
            </Svg>

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
                    <Text style={styles.legendText}>Tamamlandı (%{Math.round(completedPercentage)})</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                    <Text style={styles.legendText}>Tamamlanmadı (%{Math.round(100 - completedPercentage)})</Text>
                </View>
            </View>
        </View>
    )
}


export default function SurveyAnalysisScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const surveyTitle = params.title as string || 'Anket Detayı';

    // Mock Data
    const stats = {
        totalAssignments: 150,
        submissionRate: 85,
        readRate: 92,
        interactionRate: 78,
        delivered: 145,
        read: 138,
        completedCount: 127,
        notCompletedCount: 23,
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
                    <View>
                        <Text style={styles.headerTitle}>Anket Analizi</Text>
                        <Text style={styles.headerSubtitle}>{surveyTitle}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.mainContent}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Top Filter Bar */}
                    <View style={styles.topFilterBar}>
                        {/* Row 1: Group Select (Full Width) */}
                        <TouchableOpacity style={styles.groupSelectBtn}>
                            <Text style={styles.groupSelectText}>Grup Seç</Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>

                        {/* Row 2: Action Buttons */}
                        <View style={styles.filterActionsRow}>
                            <TouchableOpacity
                                style={styles.resultsBtn}
                                onPress={() => router.push({
                                    pathname: '/survey-results',
                                    params: { title: surveyTitle }
                                })}
                            >
                                <Ionicons name="document-text-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.resultsBtnText}>Anket Sonuçları</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.compareBtn}>
                                <MaterialCommunityIcons name="compare" size={20} color="#1A5D48" style={{ marginRight: 6 }} />
                                <Text style={styles.compareBtnText}>Grupları Karşılaştır</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Top Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValueLabel}>Toplam Atama</Text>
                            <Text style={styles.statValue}>{stats.totalAssignments}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValueLabel}>Teslim Oranı</Text>
                            <Text style={styles.statValue}>%{stats.submissionRate}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValueLabel}>Okunma Oranı</Text>
                            <Text style={styles.statValue}>%{stats.readRate}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValueLabel}>Etkileşim Oranı</Text>
                            <Text style={styles.statValue}>%{stats.interactionRate}</Text>
                        </View>
                    </View>

                    {/* Assignment Overview */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Atama Genel Bakışı</Text>
                        <View style={styles.chartRow}>
                            <CircularProgress
                                percentage={100}
                                color="#4A90E2"
                                label="Toplam"
                                centerValue={stats.totalAssignments.toString()}
                            />
                            <CircularProgress
                                percentage={(stats.delivered / stats.totalAssignments) * 100}
                                color="#FF9F43"
                                label="Teslim Edildi"
                                centerValue={stats.delivered.toString()}
                            />
                            <CircularProgress
                                percentage={(stats.read / stats.totalAssignments) * 100}
                                color="#2ECC71"
                                label="Okundu"
                                centerValue={stats.read.toString()}
                            />
                        </View>
                    </View>

                    {/* Status Distribution */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Durum Dağılımı</Text>
                        <DonutChart completed={stats.completedCount} notCompleted={stats.notCompletedCount} />
                    </View>

                    {/* Detailed Status Breakdown */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Detaylı Durum Dökümü</Text>

                        <View style={styles.breakdownRow}>
                            <View style={styles.breakdownItem}>
                                <View style={[styles.dotIndicator, { backgroundColor: '#4ECDC4' }]} />
                                <Text style={styles.breakdownLabel}>Tamamlandı</Text>
                                <Text style={styles.breakdownValue}>{stats.completedCount}</Text>
                            </View>
                            <View style={styles.breakdownDivider} />
                            <View style={styles.breakdownItem}>
                                <View style={[styles.dotIndicator, { backgroundColor: '#FF6B6B' }]} />
                                <Text style={styles.breakdownLabel}>Tamamlanmadı</Text>
                                <Text style={styles.breakdownValue}>{stats.notCompletedCount}</Text>
                            </View>
                        </View>
                    </View>

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
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
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
        paddingTop: 20,
    },
    topFilterBar: {
        marginBottom: 20,
    },
    groupSelectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
        width: '100%',
    },
    groupSelectText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    filterActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    resultsBtn: {
        flex: 1,
        backgroundColor: '#4caf50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    resultsBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    compareBtn: {
        flex: 1,
        backgroundColor: '#e8f5e9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    compareBtnText: {
        color: '#1A5D48',
        fontWeight: '600',
        fontSize: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: (width - 55) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statValueLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A5D48',
    },
    sectionContainer: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chartContainer: {
        alignItems: 'center',
        width: '33%',
        position: 'relative',
    },
    chartCenterTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartCenterText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    chartLabel: {
        marginTop: 10,
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    donutContainer: {
        alignItems: 'center',
    },
    legendContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    breakdownItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Puts label and value on opposite sides if desired, or 'flex-start'
        paddingHorizontal: 10,
    },
    breakdownDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#eee',
    },
    dotIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    breakdownLabel: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    breakdownValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});
