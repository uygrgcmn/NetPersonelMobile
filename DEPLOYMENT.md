# NetPersonel Mobile - Sunucu Kurulum Rehberi

Bu rehber, NetPersonel mobil uygulamasının geliştirme sunucusunu (Expo Server) bir VPS üzerinde (Örn: 159.69.125.232) çalıştırmak ve `exp://IP:8081` adresinden sürekli erişilebilir hale getirmek için hazırlanmıştır.

## 1. Sunucu Gereksinimleri

Sunucunuzda (Ubuntu/Debian/CentOS vb.) aşağıdakilerin kurulu olması gerekir:

*   **Node.js** (LTS sürümü önerilir, v18+)
*   **Git**
*   **PM2** (Sürekli çalıştırma için)

### Kurulum Komutları (Ubuntu/Debian)

```bash
# Node.js Kurulumu (Eğer yoksa)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git Kurulumu
sudo apt-get install git

# PM2 Kurulumu (Global)
sudo npm install -g pm2
```

## 2. Projeyi Sunucuya Çekme

Projeyi sunucuya klonlayın veya dosyaları yükleyin.

```bash
git clone <REPO_ADRESINIZ>
cd NetPersonelMobile
```

## 3. Kurulum ve Ayarlar

Bağımlılıkları yükleyin:

```bash
npm install
```

`ecosystem.config.js` dosyasını kontrol edin. `REACT_NATIVE_PACKAGER_HOSTNAME` kısmında sunucunuzun IP adresinin yazdığından emin olun.

```javascript
// ecosystem.config.js içinden örnek:
env: {
  REACT_NATIVE_PACKAGER_HOSTNAME: "159.69.125.232", // Burası sunucu IP'niz olmalı
}
```

## 4. Uygulamayı Başlatma (PM2 ile)

PM2 kullanarak Expo sunucusunu arka planda başlatın:

```bash
pm2 start ecosystem.config.js
```

### Durum Kontrolü

```bash
pm2 status       # Çalışan servisleri listeler
pm2 logs NetPersonelMobile  # Logları ve QR kodunu (text olarak) gösterir
```

## 5. Erişim

Sunucunuzda **8081** portunun dışarıya açık olduğundan emin olun (Firewall/Güvenlik Duvarı ayarları).

Erişim Bağlantınız:
`exp://159.69.125.232:8081`

Bu adresi telefonunuzdaki Expo Go uygulamasına girebilir veya tarayıcıda açabilirsiniz.

## İpuçları

*   **Sunucu Yeniden Başlatıldığında Otomatik Açılma:**
    ```bash
    pm2 save
    pm2 startup
    ```
    (Çıkan komutu kopyalayıp terminale yapıştırın)

*   **Durdurma:**
    ```bash
    pm2 stop NetPersonelMobile
    ```

*   **Yeniden Başlatma:**
    ```bash
    pm2 restart NetPersonelMobile
    ```
