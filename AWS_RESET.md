# AWS Sıfırdan Temiz Kurulum

Mevcut karmaşayı silip tertemiz bir sayfa açıyoruz.

**Önce Eskiyi Silelim:**
1.  **EC2** -> **Instances** sayfasına gidin.
2.  Mevcut sunucunuzu seçin.
3.  **Instance State** butonuna basıp **"Terminate instance"** (Yok et) seçeneğini seçin.
4.  Bu sunucu silinecek.

---

**YEPYENİ KURULUM:**

1.  **Launch Instance** (Yeni Sunucu Başlat) butonuna basın.
2.  **Name:** `NetPersonelServer-Yeni`
3.  **OS:** `Ubuntu` (24.04 veya 22.04)
4.  **Instance Type:** `t2.micro` (Free tier)
5.  **Key Pair:**
    *   Önceki indirdiğiniz `MyAwsKey` seçili kalsın (Yenisini oluşturmaya gerek yok, elinizdekini kullanın).

6.  **Network Settings (EN ÖNEMLİ KISIM):**
    *   Sağ üstteki **Edit** butonuna basın.
    *   **"Create security group"** seçili olsun.
    *   İlk kural zaten oradadır: **Type: SSH, Port: 22, Source: Anywhere (0.0.0.0/0)**. BUNA DOKUNMAYIN.
    *   Altındaki **"Add security group rule"** butonuna basın.
    *   İkinci kuralı ekleyin:
        *   **Type:** `Custom TCP`
        *   **Port range:** `8081`
        *   **Source:** `0.0.0.0/0` (Anywhere) seçin.

7.  **Launch Instance** butonuna basın.

---

**BAĞLANMA:**
Yeni sunucunuz açılınca (Running olunca) yeni IP adresini kopyalayın.

Terminalden:
```bash
ssh -i "MyAwsKey.pem" ubuntu@YENI_IP_ADRESI
```
*(Not: Eğer "Remote host identification changed" hatası verirse bunu söyleyin, bir komutla düzelteceğiz).*

Bağlandıktan sonra kurulum (Node, Git vb.) adımlarını hızlıca tekrar yapacağız. IP adresini bekliyorum!
