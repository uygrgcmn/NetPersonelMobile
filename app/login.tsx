import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Modal,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock Country Codes
const COUNTRY_CODES = [
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
];

export default function LoginScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

    // Form State
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Country Picker State
    const [countryCode, setCountryCode] = useState('+90');
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleLogin = () => {
        // Mock login for now, navigate to home
        router.replace('/(tabs)/home');
    };

    const renderCountryItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => {
                setCountryCode(item.code);
                setShowCountryPicker(false);
            }}
        >
            <Text style={styles.countryFlag}>{item.flag}</Text>
            <Text style={styles.countryName}>{item.country}</Text>
            <Text style={styles.countryCodeTextItem}>{item.code}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.contentContainer}>

                    {/* Logo & Header */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={require('../assets/images/netpersonel-logo-sadeceikon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Giriş Yap</Text>
                        <Text style={styles.subtitle}>Hesabınıza erişmek için lütfen giriş yapın.</Text>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'email' && styles.activeTab]}
                            onPress={() => setActiveTab('email')}
                        >
                            <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>E-Posta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'phone' && styles.activeTab]}
                            onPress={() => setActiveTab('phone')}
                        >
                            <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>Telefon</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>

                        {activeTab === 'email' ? (
                            // EMAIL INPUT
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-Posta Adresi</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="ornek@netpersonel.com"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        ) : (
                            // PHONE INPUT
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Telefon Numarası</Text>
                                <View style={[styles.inputWrapper, { paddingLeft: 0 }]}>
                                    <TouchableOpacity
                                        style={styles.countryCode}
                                        onPress={() => setShowCountryPicker(true)}
                                    >
                                        <Text style={styles.countryCodeText}>{countryCode}</Text>
                                        <Ionicons name="chevron-down" size={16} color="#666" style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="555 123 45 67"
                                        placeholderTextColor="#999"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>
                        )}

                        {/* PASSWORD INPUT */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Şifre</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Şifrenizi giriniz"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password Link */}
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Giriş Yap</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ marginBottom: 20 }} />

                </View>
            </KeyboardAvoidingView>

            {/* Country Picker Modal */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Ülke Kodu Seçin</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRY_CODES}
                            keyExtractor={(item) => item.code + item.country}
                            renderItem={renderCountryItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#1A5D48', // Primary Color
    },
    formContainer: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#333',
        fontSize: 15,
    },
    countryCode: {
        paddingHorizontal: 12,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
        marginRight: 10,
        backgroundColor: '#f9f9f9',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    countryCodeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: '#1A5D48',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#1A5D48',
        borderRadius: 12,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1A5D48',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    countryFlag: {
        fontSize: 24,
        marginRight: 15,
    },
    countryName: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    countryCodeTextItem: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A5D48',
    },
});
