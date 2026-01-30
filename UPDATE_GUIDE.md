# Sunucuyu Güncelleme Rehberi

Bilgisayarınızdaki değişiklikleri sunucuya atmak için bu adımları **PowerShell (Sunucu)** ekranında uygulayın.

**1. Mevcut Uygulamayı Durdurun:**
Ekranda uygulama çalışıyorsa `Ctrl + C` tuşlarına basarak durdurun.

**2. Güncellemeleri İndirin:**
```bash
git pull
```
*(Bu komut "Already up to date" derse güncelleme yok demektir. Dosya isimleri listelerse güncellendi demektir).*

**3. Gerekirse Yeni Paketleri Yükleyin:**
*(Eğer yeni kütüphane eklediyseniz bunu yapmanız şart)*
```bash
npm install
```

**4. Tekrar Başlatın:**
```bash
export REACT_NATIVE_PACKAGER_HOSTNAME=16.170.165.137
npx expo start --host lan --port 8081
```

QR kodu tekrar okuttuğunuzda yeni ekranların geldiğini göreceksiniz.
