# Sales Analytics Dashboard

Gerçek zamanlı satış analizi ve finansal izleme platformu. KPI takibi, gelir trendleri, bölgesel performans ve daha fazlası tek bir dashboard'ta.

## Özellikler

### 📊 Gerçek Zamanlı KPI Takibi
- Toplam Gelir, Sipariş Sayısı, Ortalama Sipariş Değeri
- Dönüşüm Oranı, Sepet Terk Oranı
- Brüt Marj, Net Kar, Nakit Akışı
- Bütçe Varyansı, Müşteri Yaşam Boyu Değeri (LTV)

### 📈 Gelişmiş Grafikler
- **Trend Grafikleri:** Gelir, sipariş hacmi, performans trendleri
- **Karşılaştırmalı Analiz:** Satış vs Hedef, Bütçe karşılaştırması
- **Bölgesel Harita:** Coğrafi ısı haritası ile bölgesel performans
- **Funnel Analizi:** Kategori bazlı dönüşüm hunileri
- **Gauge Gösterge:** Kar marjı ve hedef karşılaştırması

### 🔄 Canlı Veri Güncellemeleri
- WebSocket (Socket.io) ile anlık veri senkronizasyonu
- 30 saniyede otomatik veri yenileme
- Gerçek zamanlı bildirim sistemi

### 🎨 Modern UI/UX
- **Karanlık/Aydınlık Tema:** Göz yorgunluğunu azaltan tema seçeneği
- **Responsive Tasarım:** Masaüstü, tablet ve mobil uyumlu
- **Tremor UI:** Dashboard-optimized component kütüphanesi
- **TailwindCSS:** Utility-first CSS framework

## Teknoloji Stack

### Frontend
- **React 18** + Vite
- **TypeScript** - Tip güvenli kod
- **TailwindCSS** - Modern CSS framework
- **Tremor** - Dashboard component kütüphanesi
- **Recharts** - Gelişmiş grafik kütüphanesi
- **Socket.io Client** - Gerçek zamanlı iletişim
- **SWR** - Veri fetchinge
- **React Router** - Sayfa yönlendirme

### Backend
- **Node.js 18** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket server
- **TypeScript** - Backend tip güvenliği

## Kurulum

### Gereksinimler
- Node.js >= 18.0.0
- Docker & Docker Compose (opsiyonel)

### Hızlı Başlangıç (Docker)

```bash
git clone https://github.com/Berke-Cimen/sales-analytics-dashboard.git
cd sales-analytics-dashboard
docker-compose up -d
open http://localhost
```

### Manuel Kurulum

```bash
# Backend
cd backend && npm install && npm start

# Frontend (yeni terminal)
cd frontend && npm install && npm run dev
```

## Proje Yapısı

```
sales-analytics-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── stream/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Dashboard
| Endpoint | Açıklama |
|----------|----------|
| `GET /api/dashboard/kpis` | KPI kartları |
| `GET /api/dashboard/revenue` | Gelir verileri |
| `GET /api/dashboard/orders` | Sipariş verileri |
| `GET /api/dashboard/regions` | Bölgesel performans |

### Raporlar
| Endpoint | Açıklama |
|----------|----------|
| `GET /api/reports/sales` | Detaylı satış raporları |
| `GET /api/reports/export` | CSV/PDF export |

## WebSocket Olayları

```javascript
io.connect('/dashboard');
socket.on('kpi-update', (data) => { ... });
socket.on('revenue-update', (data) => { ... });
```

## Konfigürasyon

### Ortam Değişkenleri
```env
# Backend
PORT=3001
NODE_ENV=production
CLIENT_URL=http://localhost

# Frontend
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

## Lisans

MIT License

---

**Yapımcı:** Berke Çimen
