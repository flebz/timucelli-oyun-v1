import { Boss, Girlfriend, Upgrade } from './types';

export const BOSS_LIST: Boss[] = [
  { id: 1, name: "Azad Barzanî", baseHealth: 500, rewardKP: 10, rewardTP: 1000, description: "Kadıköy Rıhtım'ın girişini tutuyor." },
  { id: 2, name: "Aram Şêxmûs", baseHealth: 1200, rewardKP: 25, rewardTP: 2500, description: "Boğa heykelinin yanında tespih sallıyor." },
  { id: 3, name: "Baran Xelîl", baseHealth: 2500, rewardKP: 45, rewardTP: 5000, description: "Metro çıkışında bekleyen sert abi." },
  { id: 4, name: "Botan Ehmed", baseHealth: 4000, rewardKP: 70, rewardTP: 8500, description: "Moda sahilde nargile içiyor." },
  { id: 5, name: "Ciwan Reşîd", baseHealth: 6500, rewardKP: 100, rewardTP: 15000, description: "Akmar Pasajı'nın eski sahibi." },
  { id: 6, name: "Dilan Selîm", baseHealth: 10000, rewardKP: 150, rewardTP: 25000, description: "Sokak müzisyenlerinin korkulu rüyası." },
  { id: 7, name: "Hejar Mistefa", baseHealth: 15000, rewardKP: 220, rewardTP: 40000, description: "Bahariye caddesinin hızlısı." },
  { id: 8, name: "Jiyan Mele", baseHealth: 22000, rewardKP: 300, rewardTP: 60000, description: "Eski Salı Pazarı'nın fenomeni." },
  { id: 9, name: "Kawa Hesen", baseHealth: 32000, rewardKP: 400, rewardTP: 90000, description: "Fenerbahçe stadının kapısında bekler." },
  { id: 10, name: "Rojan Seydo", baseHealth: 45000, rewardKP: 550, rewardTP: 130000, description: "Rexx Sineması önünde buluşma noktası." },
  { id: 11, name: "Rojhat Îbrahîm", baseHealth: 60000, rewardKP: 750, rewardTP: 200000, description: "Barlar sokağının gece bekçisi." },
  { id: 12, name: "Serhat Osman", baseHealth: 80000, rewardKP: 1000, rewardTP: 350000, description: "Caferağa spor salonunun şampiyonu." },
  { id: 13, name: "Viyan Ali", baseHealth: 110000, rewardKP: 1300, rewardTP: 500000, description: "Yeldeğirmeni mahallesinin muhtarı." },
  { id: 14, name: "Zana Şêrko", baseHealth: 150000, rewardKP: 1700, rewardTP: 750000, description: "Kadıköy vapur iskelesinin kaptanı." },
  { id: 15, name: "Zinar Cudi", baseHealth: 200000, rewardKP: 2200, rewardTP: 1000000, description: "Haydarpaşa garının gölgesi." },
  { id: 16, name: "Siyar Mahmud", baseHealth: 280000, rewardKP: 3000, rewardTP: 1500000, description: "Hasanpaşa Gazhanesi'nin müdürü." },
  { id: 17, name: "Helin Mihemed", baseHealth: 400000, rewardKP: 4000, rewardTP: 2500000, description: "Kurbağalıdere'nin kraliçesi." },
  { id: 18, name: "Renas Serhed", baseHealth: 600000, rewardKP: 5500, rewardTP: 5000000, description: "Söğütlüçeşme metrobüs durağının sahibi." },
  { id: 19, name: "Şiyar Şemo", baseHealth: 900000, rewardKP: 7500, rewardTP: 10000000, description: "Kalamış Parkı'nın efendisi." },
  { id: 20, name: "Ronahî Hacî", baseHealth: 1500000, rewardKP: 10000, rewardTP: 25000000, description: "Tüm Kadıköy'ün Efsanevi Patronu." },
];

export const UPGRADES: Upgrade[] = [
  { id: 'u1', name: 'Protein Tozu', description: 'Tıklama gücünü artırır.', baseCost: 50, costMultiplier: 1.5, effectType: 'click', effectValue: 2, icon: '💪' },
  { id: 'u2', name: 'Eski Klavye', description: 'Daha hızlı yazarsın. Tık gücü +5.', baseCost: 200, costMultiplier: 1.6, effectType: 'click', effectValue: 5, icon: '⌨️' },
  { id: 'u3', name: 'Stajyer Çocuk', description: 'Senin yerine tıklar. (1 oto/sn)', baseCost: 500, costMultiplier: 1.4, effectType: 'auto', effectValue: 1, icon: '👶' },
  { id: 'u4', name: 'Espresso Makinesi', description: 'Enerji patlaması! Tık gücü +20.', baseCost: 1500, costMultiplier: 1.7, effectType: 'click', effectValue: 20, icon: '☕' },
  { id: 'u5', name: 'Bot Hesaplar', description: 'Sosyal medyada beğeni kasar. (10 oto/sn)', baseCost: 3500, costMultiplier: 1.5, effectType: 'auto', effectValue: 10, icon: '🤖' },
  { id: 'u6', name: 'Gaming Mouse', description: 'RGB ışıklı. Tık gücü +100.', baseCost: 8000, costMultiplier: 1.8, effectType: 'click', effectValue: 100, icon: '🖱️' },
  { id: 'u7', name: 'Youtuber Ekipman', description: 'Profesyonel prodüksiyon. (50 oto/sn)', baseCost: 20000, costMultiplier: 1.6, effectType: 'auto', effectValue: 50, icon: '📹' },
  { id: 'u8', name: 'Crypto Madenciliği', description: 'Pasif gelir kaynağı. (250 oto/sn)', baseCost: 75000, costMultiplier: 1.5, effectType: 'auto', effectValue: 250, icon: '💎' },
  { id: 'u9', name: 'Yazılım Şirketi', description: 'Timuçelli imparatorluğu. (1000 oto/sn)', baseCost: 300000, costMultiplier: 1.5, effectType: 'auto', effectValue: 1000, icon: '🏢' },
  { id: 'u10', name: 'Kadıköy Tapusu', description: 'Herkes sana çalışır. (5000 oto/sn)', baseCost: 1000000, costMultiplier: 1.6, effectType: 'auto', effectValue: 5000, icon: '📜' },
];

export const GIRLFRIENDS: Girlfriend[] = [
  { id: 'g1', name: 'Ayşe', requiredKP: 20, description: 'Üniversite öğrencisi, notlarını tutar.', multiplierBonus: 1.1, imagePlaceholder: '200/200' },
  { id: 'g2', name: 'Selin', requiredKP: 100, description: 'Yoga eğitmeni, sakin kalmanı sağlar.', multiplierBonus: 1.2, imagePlaceholder: '201/201' },
  { id: 'g3', name: 'Zeynep', requiredKP: 500, description: 'Influencer, popülerliğini artırır.', multiplierBonus: 1.3, imagePlaceholder: '202/202' },
  { id: 'g4', name: 'Elif', requiredKP: 1500, description: 'Yazılımcı, kodlarını debug eder.', multiplierBonus: 1.5, imagePlaceholder: '203/203' },
  { id: 'g5', name: 'Leyla', requiredKP: 5000, description: 'Mimar, geleceğini tasarlar.', multiplierBonus: 2.0, imagePlaceholder: '204/204' },
];