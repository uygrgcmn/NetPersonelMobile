import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Renk geçişi için
import { Colors } from '../../src/constants/colors';

// Ortadaki Havalı Buton (FAB)
const CustomTabBarButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={{
            top: -30, // Barın üstüne çıkarıyoruz
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.fabShadow,
        }}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <LinearGradient
            colors={['#1A5D48', '#4db6ac']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                borderWidth: 4,
                borderColor: '#f4f6f9', // Arka plan rengiyle uyumlu border (sanki delik varmış gibi)
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </LinearGradient>
    </TouchableOpacity>
);

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#1A5D48',
                tabBarInactiveTintColor: '#C4C4C4',

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: 8, // İkon ile yazı arası
                },

                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 10, // Android için güçlü gölge
                    backgroundColor: '#ffffff',
                    borderRadius: 25,
                    height: 80,
                    borderTopWidth: 0, // Üstteki ince çizgiyi kaldır
                    ...styles.shadow,
                },
                tabBarItemStyle: {
                    height: 80,
                    paddingTop: 10,
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={26} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="checkbox-outline" size={26} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="chat"
                options={{
                    title: '', // Ortadaki butonun yazısı karmaşa yaratmasın diye boş bırakıldı (Profesyonel görünüm)
                    tabBarIcon: ({ focused }) => null, // İkonu CustomTabBarButton render ediyor zaten
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props}>
                            <Ionicons name="chatbubbles" size={32} color="#fff" />
                        </CustomTabBarButton>
                    ),
                }}
            />

            <Tabs.Screen
                name="surveys"
                options={{
                    title: 'Surveys',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart-outline" size={26} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="support"
                options={{
                    title: 'Support',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="headset-outline" size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    fabShadow: {
        shadowColor: '#1A5D48',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    }
});