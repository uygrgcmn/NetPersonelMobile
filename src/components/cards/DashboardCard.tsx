import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardItem } from '../../types';

interface DashboardCardProps {
    item: DashboardItem;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ item }) => {
    const IconComp = item.iconLib;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                <IconComp name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardCount}>{item.count}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtext}>{item.subtext}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#ddd" style={styles.arrowIcon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '47%', // Restored grid width
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'column', // Restored Column Direction
        alignItems: 'flex-start',
        position: 'relative',
        borderWidth: 0, // Removed border which wasn't in original
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 10, // Restored margin bottom
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        width: '100%',
    },
    cardCount: {
        fontSize: 22, // Restored original font size
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
});
