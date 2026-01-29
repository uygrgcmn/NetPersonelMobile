# AWS Üzerinde Sunucu (EC2) Kurulum Rehberi

Tebrikler, AWS hesabınız hazır! Şimdi adım adım **bedava (Free Tier)** sunucunuzu ayağa kaldıralım.

## 1. EC2 Konsoluna Giriş
1.  Üstteki arama çubuğuna **"EC2"** yazın ve çıkan ilk sonuca tıklayın.
2.  Açılan sayfada turuncu renkli **"Launch Instance"** (Sunucuyu Başlat) butonuna tıklayın.

## 2. Sunucu Ayarları (Çok Önemli!)
Açılan sayfada şu ayarları seçin:

1.  **Name:** `NetPersonelServer` (veya istediğiniz bir isim).
2.  **OS Images (İşletim Sistemi):** **Ubuntu** logosuna tıklayın.
    *   Altında *Ubuntu Server 24.04 LTS* veya *22.04 LTS (Free tier eligible)* yazdığından emin olun.
3.  **Instance Type:** `t2.micro` veya `t3.micro` seçili kalsın. (Yanında yeşil yazıyla "Free tier eligible" yazar).

4.  **Key Pair (Login):**
    *   Burada **"Create new key pair"** diyin.
    *   İsim olarak `MyAwsKey` yazın.
    *   Türe dokunmayın (`.pem` seçili olsun).
    *   **"Create key pair"** butonuna basın.
    *   **DİKKAT:** Bilgisayarınıza `.pem` uzantılı bir dosya inecek. Bu dosya sizin **ANAHTARINIZDIR**. Asla kaybetmeyin!

5.  **Network Settings (Ağ Ayarları):**
    *   "Allow SSH traffic from Anywhere" seçili olsun.
    *   Hemen sağ üst köşedeki **"Edit"** butonuna basın (veya aşağı kaydırın).
    *   **"Add security group rule"** butonuna tıklayın (Yeni bir kural ekleyeceğiz):
        *   **Type:** `Custom TCP`
        *   **Port range:** `8081` (Uygulamamızın çalışacağı port)
        *   **Source:** `Anywhere` (veya `0.0.0.0/0`)
    *   *(Bu adımı yapmazsanız uygulamanıza dışarıdan erişemezsiniz!)*

## 3. Başlat!
*   Sağ alttaki turuncu **"Launch Instance"** butonuna basın.
*   Biraz bekleyin, "Successfully initiated launch" yazısını görünce alttaki mavi **"View all instances"** butonuna basın.

## 4. IP Adresini Öğrenme
Listede sunucunuzu göreceksiniz. "Instance State" kısmı `Running` (Yeşil) olana kadar bekleyin (F5 ile sayfayı yenileyebilirsiniz).
*   Sunucunuza tıklayın.
*   Alt kısımda **"Public IPv4 address"** yazan yerde IP adresinizi göreceksiniz (Örn: `54.123.45.67`).
*   Bu IP adresini kopyalayın.

---

## 5. Bağlanma Zamanı!

Şimdi tekrar bilgisayarınızdaki **PowerShell**'i açın.

1.  Az önce indirdiğiniz anahtar dosyasının (`MyAwsKey.pem`) olduğu klasöre gidin. Genelde "İndirilenler" klasöründedir.
    ```bash
    cd Downloads
    # Veya Türkçe ise: cd İndirilenler
    ```
2.  Şu komutla bağlanın (IP yerine kopyaladığınız AWS IP'sini yazın):

```bash
ssh -i "MyAwsKey.pem" ubuntu@AWS_IP_ADRESINIZ
```

*   `Are you sure...` derse `yes` deyin.
*   Şifre sormaz, çünkü anahtar dosyası (`-i MyAwsKey.pem`) kullandık!

Bağlandıysanız tebrikler! Artık `BEGINNER_GUIDE.md` dosyasındaki **ADIM 2**'den devam edebilirsiniz.
*(Not: AWS Ubuntu sunucularında kullanıcı adı `root` değil `ubuntu`'dur. Rehberdeki kurulum komutlarında `sudo` olduğu için sorun çıkmaz).*
