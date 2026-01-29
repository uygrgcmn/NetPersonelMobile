# Adım Adım Kurulum Rehberi (Başlangıç Seviyesi)

Bu rehber, sunucu (VPS) nedir, nasıl bağlanılır ve uygulama oraya nasıl yüklenir, en temelden anlatmaktadır.

## Mantığı Anlayalım

1.  **Sizin Bilgisayarınız (Local):** Kodları yazdığınız yer.
2.  **Sunucu (Remote VPS):** `159.69.125.232` adresindeki, 7/24 açık olan uzaktaki bilgisayar (Genellikle Linux/Ubuntu işletim sistemi yüklüdür).
3.  **Amaç:** Kodlarınızı "Sizin Bilgisayarınızdan" -> "Sunucuya" kopyalamak ve orada sürekli çalışır hale getirmek.

Yani, az önce bilgisayarınıza kurduğunuz Node.js ve Git güzel bir adım ama asıl bu programların **Sunucuda** kurulu olması gerekiyor.

---

## ADIM 0: Önce Bir Sunucu Kiralamalısınız!

Şu an elinizde bağlanacak bir bilgisayar yok. İlk iş olarak internetten 7/24 çalışan bir sanal bilgisayar (VPS) kiralamanız lazım.

**Nereden Alınır?** (Örnek Firmalar)
*   **Hetzner** (Ucuz ve popüler)
*   **DigitalOcean** (Kullanımı çok kolay)
*   **AWS Lightsail** (Amazon güvencesi)
*   veya Türkiye lokasyonlu firmalar (Turhost, Natro vb.)

**Ne Satın Alacaksınız?**
*   **İşletim Sistemi:** "Ubuntu 22.04" veya "Ubuntu 24.04" (En önemlisi bu!)
*   **Özellik:** En ucuz paket işinizi görür (Örn: 2 CPU, 4GB RAM).

Satın aldıktan sonra size bir e-posta gelecek. İçinde şunlar yazar:
1.  **IP Adresi:** (Örn: `185.123.45.67`)
2.  **Kullanıcı Adı:** `root`
3.  **Şifre:** (Karmaşık bir şifre)

**BU BİLGİLER GELMEDEN DİĞER ADIMLARA GEÇEMEZSİNİZ!**

---

## ADIM 1: Sunucuya Bağlanmak

Sunucu bilgilerinizi (IP ve Şifre) aldıktan sonra:

1.  Bilgisayarınızın başlat menüsüne **"PowerShell"** yazın ve açın.
2.  Şu komutu yazın (IP kısmını size gelenle değiştirin!):

```bash
ssh root@SİZE_GELEN_İP_ADRESİ
```
*(Örnek: `ssh root@185.123.45.67`)*

3.  **"Are you sure...?"** derse `yes` yazın.
4.  **password:** derse size gelen şifreyi yazın.
    *   **ÖNEMLİ:** Şifreyi yazarken ekranda hiçbir şey çıkmaz (yıldız veya nokta bile çıkmaz). Siz şifrenizi doğruca yazıp Enter'a basın.

Eğer ekranda yeşil veya beyaz yazılarla **"Welcome to..."** veya **"root@..."** görüyorsanız, tebrikler! Şu an bedava bir şekilde uzaktaki sunucuya bağlandınız.

*(Bilgisayarınıza Ubuntu kurmanıza gerek yok, çünkü bağlandığınız o uzak bilgisayar zaten Ubuntu işletim sistemiyle çalışıyor. Biz sadece ona uzaktan bağlanıyoruz.)*

---

## ADIM 2: Sunucuyu Hazırlamak (Sadece İlk Sefer)

Artık sunucunun içindesiniz. Buraya gerekli programları kuralım. Sırasıyla şu komutları yapıştırın:

**1. Paketleri Güncelle:**
```bash
sudo apt update && sudo apt upgrade -y
```

**2. Node.js Kur (Programımızı çalıştıracak motor):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**3. Git Kur (Kodları çekmek için):**
```bash
sudo apt-get install git -y
```

**4. PM2 Kur (Uygulama kapanmasın diye bekçi):**
```bash
sudo npm install -g pm2
```

---

## ADIM 3: Projeyi Sunucuya Çekmek

Şimdi kodlarınızı sunucuya alacağız. Bunun için en kolay yol GitHub kullanmaktır.

1.  Kodlarınızı bilgisayarınızdan GitHub'a gönderdiniz mi? (Push ettiniz mi?)
2.  Eğer ettiyseniz, GitHub proje adresinizi alın (Örn: `https://github.com/kullaniciadi/proje.git`).
3.  Sunucuda şu komutu yazın:

```bash
git clone https://github.com/SİZİN_GITHUB_KULLANICI_ADINIZ/NetPersonelMobile.git
```
*(Link kısmını kendi projenizin linkiyle değiştirin)*

4.  Proje klasörüne girin:
```bash
cd NetPersonelMobile
```

---

## ADIM 4: Uygulamayı Kurmak ve Başlatmak

Klasörün içindeyken (yani `NetPersonelMobile` klasöründe):

1.  **Kütüphaneleri Yükle:**
```bash
npm install
```

2.  **Uygulamayı Başlat (PM2 ile):**
    Önce oluşturduğumuz `ecosystem.config.js` dosyasının orada olduğundan emin olun (`ls` yazarak görebilirsiniz). Sonra:

```bash
pm2 start ecosystem.config.js
```

3.  **Durumu Kontrol Et:**
```bash
pm2 logs
```
Bu komutla ekranda QR kodunu veya "Metro Server Running" yazılarını görmelisiniz.

---

## ADIM 5: Test Et

Telefonunuzu elinize alın.
Tarayıcıya veya Expo Go uygulamasına şunu yazın:

## ADIM 5: Test Et

`exp://SİZE_GELEN_İP_ADRESİ:8081`

Adresini telefonunuzda açın.

---

### Sık Sorulan Sorular

*   **Sunucudan nasıl çıkarım?** `exit` yazarak.
*   **Sunucuyu kapatırsam uygulama durur mu?** Hayır, `pm2` onu arka planda hep çalıştırır.
*   **Github kullanmıyorum, dosyaları nasıl atacağım?** Eğer Git kullanmıyorsanız, dosyaları bilgisayarınızdan sunucuya `SCP` veya `FileZilla` gibi programlarla manuel atmanız gerekir. Bu biraz daha zordur, Git kullanmanız önerilir.
