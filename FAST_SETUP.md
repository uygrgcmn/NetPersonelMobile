# Hızlı Kurulum Komutları (Tek Seferde)

Aşağıdaki komutları yeni sunucunuza bağlandıktan sonra sırasıyla yapıştırın.

**1. Bağlanın:**
(Önce `Remote host identification changed` hatası verirse, bilgisayarınızda `C:\Users\SizinKullaniciniz\.ssh\known_hosts` dosyasını silip tekrar deneyin).

```bash
ssh -i "MyAwsKey.pem" ubuntu@16.170.165.137
```

**2. Güncelleme ve Gerekli Araçlar:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
```

**3. Node.js 20 Kurulumu (Önemli!):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**4. Hafıza (Swap) Arttırma (Donmaması için şart!):**
```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**5. PM2 Kurulumu:**
```bash
sudo npm install -g pm2
```

**6. Projeyi Çekme:**
```bash
git clone https://github.com/uygrgcmn/NetPersonelMobile.git
cd NetPersonelMobile
```

**7. Projeyi Hazırlama:**
```bash
npm install
```
*(Bu işlem biraz sürebilir, bekleyin. Donarsa swap sayesinde kurtarır)*

**8. Çalıştırma:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**BİTTİ!**
Telefonunuzdan: `exp://16.170.165.137:8081` adresine girin.
