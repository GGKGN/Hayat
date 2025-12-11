# Production Deployment Guide

Bu rehber, projenizi canlı bir sunucuya (Ubuntu/Linux önerilir) nasıl yükleyeceğinizi anlatır.

## Ön Gereksinimler

Sunucunuzda şunların kurulu olması gerekir:
1.  **Docker**: Sanallaştırma için.
2.  **Docker Compose**: Çoklu konteyner yönetimi için.
3.  **Git**: Kodları çekmek için.

## Sık Karşılaşılan Sorunlar (Troubleshooting)

### Error: Your local changes to ... package-lock.json would be overwritten
Eğer `git pull` yaparken bu hatayı alıyorsanız, sunucudaki `package-lock.json` dosyası değişmiş demektir. Bunu çözmek için sunucudaki değişikliği iptal etmelisiniz:

```bash
# Sadece package-lock dosyasını sıfırla
git checkout web/package-lock.json

# Veya tüm yerel değişiklikleri sil (DİKKATLİ KULLANIN)
git reset --hard

# Sonra tekrar çekin
git pull
```

## Dağıtım (Deploy) Adımları

### 1. Güncelleme
```bash
git pull
```

### 2. Başlatma
```bash
./deploy.sh
```
