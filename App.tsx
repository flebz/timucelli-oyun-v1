import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Tab, Upgrade, Boss, Girlfriend } from './types';
import { BOSS_LIST, UPGRADES, GIRLFRIENDS } from './constants';
import { Heart, Trophy, Zap, MapPin, ShoppingBag, Home, User, Swords, ArrowRight } from 'lucide-react';

// --- Helper Components ---

const FloatingText = ({ x, y, text, onComplete }: { x: number, y: number, text: string, onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="pointer-events-none fixed z-50 animate-bounce-short text-2xl font-bold text-white drop-shadow-md select-none"
      style={{ left: x, top: y }}
    >
      {text}
    </div>
  );
};

// --- Main App ---

const INITIAL_STATE: GameState = {
  timucelliPuani: 0,
  karizmaPuani: 0,
  clickPower: 1,
  autoClickPower: 0,
  purchasedUpgrades: {},
  currentBossIndex: 0,
  unlockedGirlfriends: [],
  lifetimeClicks: 0,
};

export default function App() {
  // State
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('timurClickerState_v1');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [clicks, setClicks] = useState<{id: number, x: number, y: number, text: string}[]>([]);
  
  // Combat State
  const [bossHP, setBossHP] = useState(BOSS_LIST[0].baseHealth);
  const [isInCombat, setIsInCombat] = useState(false);
  const [combatFeedback, setCombatFeedback] = useState<string | null>(null);

  // Refs for loop
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Derived Stats
  const currentBoss = BOSS_LIST[Math.min(gameState.currentBossIndex, BOSS_LIST.length - 1)];
  const isGameCompleted = gameState.currentBossIndex >= BOSS_LIST.length;
  
  const totalMultiplier = 1 + GIRLFRIENDS
    .filter(g => gameState.unlockedGirlfriends.includes(g.id))
    .reduce((acc, curr) => acc + (curr.multiplierBonus - 1), 0);

  const effectiveClickPower = Math.floor(gameState.clickPower * totalMultiplier);
  const effectiveAutoClick = Math.floor(gameState.autoClickPower * totalMultiplier);

  // --- Game Loop (Auto Clicker) ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStateRef.current.autoClickPower > 0) {
        setGameState(prev => ({
          ...prev,
          timucelliPuani: prev.timucelliPuani + effectiveAutoClick
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [effectiveAutoClick]);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('timurClickerState_v1', JSON.stringify(gameState));
  }, [gameState]);

  // --- Actions ---

  const handleClick = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const clickId = Date.now();
    
    // Add floating text visual
    setClicks(prev => [...prev, { id: clickId, x: clientX - 20, y: clientY - 40, text: `+${effectiveClickPower}` }]);

    if (activeTab === Tab.ARENA && isInCombat) {
      handleCombatClick(e);
    } else {
      // Normal Resource Gathering
      setGameState(prev => ({
        ...prev,
        timucelliPuani: prev.timucelliPuani + effectiveClickPower,
        lifetimeClicks: prev.lifetimeClicks + 1
      }));
    }
  };

  const removeClick = useCallback((id: number) => {
    setClicks(prev => prev.filter(c => c.id !== id));
  }, []);

  const buyUpgrade = (upgrade: Upgrade) => {
    const currentCount = gameState.purchasedUpgrades[upgrade.id] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentCount));

    if (gameState.timucelliPuani >= cost) {
      setGameState(prev => {
        const newCount = (prev.purchasedUpgrades[upgrade.id] || 0) + 1;
        return {
          ...prev,
          timucelliPuani: prev.timucelliPuani - cost,
          clickPower: upgrade.effectType === 'click' ? prev.clickPower + upgrade.effectValue : prev.clickPower,
          autoClickPower: upgrade.effectType === 'auto' ? prev.autoClickPower + upgrade.effectValue : prev.autoClickPower,
          purchasedUpgrades: {
            ...prev.purchasedUpgrades,
            [upgrade.id]: newCount
          }
        };
      });
    }
  };

  const unlockGirlfriend = (gf: Girlfriend) => {
    if (gameState.karizmaPuani >= gf.requiredKP && !gameState.unlockedGirlfriends.includes(gf.id)) {
      setGameState(prev => ({
        ...prev,
        karizmaPuani: prev.karizmaPuani - gf.requiredKP,
        unlockedGirlfriends: [...prev.unlockedGirlfriends, gf.id]
      }));
    }
  };

  // --- Combat Logic ---
  
  const startBossFight = () => {
    setBossHP(currentBoss.baseHealth);
    setIsInCombat(true);
  };

  const handleCombatClick = (e: React.MouseEvent) => {
    const damage = effectiveClickPower;
    
    // Visual shake effect logic could go here via CSS classes trigger
    setBossHP(prev => {
      const newHP = prev - damage;
      if (newHP <= 0) {
        winBossFight();
        return 0;
      }
      return newHP;
    });
  };

  const winBossFight = () => {
    setIsInCombat(false);
    setCombatFeedback("KAZANDIN!");
    
    setGameState(prev => ({
      ...prev,
      timucelliPuani: prev.timucelliPuani + currentBoss.rewardTP,
      karizmaPuani: prev.karizmaPuani + currentBoss.rewardKP,
      currentBossIndex: prev.currentBossIndex + 1
    }));

    setTimeout(() => setCombatFeedback(null), 2000);
  };

  const forfeitBossFight = () => {
    setIsInCombat(false);
    setBossHP(currentBoss.baseHealth); // Reset for next time
  };

  // --- Views ---

  const renderHeader = () => (
    <div className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-4 z-40 flex justify-between items-center shadow-lg">
      <div className="flex flex-col">
        <div className="flex items-center text-timur-400 font-bold text-lg">
          <Zap className="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" />
          {gameState.timucelliPuani.toLocaleString()} TP
        </div>
        <div className="text-xs text-slate-400">
          +{effectiveAutoClick}/sn
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center text-rose-400 font-bold text-lg">
          {gameState.karizmaPuani.toLocaleString()} KP
          <Heart className="w-5 h-5 ml-1 text-rose-500" fill="currentColor" />
        </div>
        <div className="text-xs text-slate-400">
           x{totalMultiplier.toFixed(2)} Bonus
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center h-full pt-20 pb-24 px-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-timur-400 to-indigo-400">
          TİMUR
        </h1>
        <p className="text-slate-400 text-sm">Timuçelli İmparatorluğu'nu Kur!</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <button 
          onMouseDown={handleClick}
          className="relative w-64 h-64 rounded-full bg-slate-800 border-4 border-timur-500 flex items-center justify-center shadow-2xl active:scale-95 transition-transform duration-75 overflow-hidden"
        >
          <img 
            src="https://hizliresim.com/fkjgah8" 
            alt="Timur Character" 
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
          />
          <div className="absolute bottom-4 bg-black/60 px-3 py-1 rounded-full text-white font-bold backdrop-blur-sm">
            Tıkla!
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
          <span className="text-slate-400 text-xs">Tıklama Gücü</span>
          <span className="text-xl font-bold text-white">+{effectiveClickPower}</span>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
          <span className="text-slate-400 text-xs">Otomatik</span>
          <span className="text-xl font-bold text-white">+{effectiveAutoClick}/sn</span>
        </div>
      </div>
    </div>
  );

  const renderUpgrades = () => (
    <div className="pt-20 pb-24 px-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <ShoppingBag className="mr-2" /> Market
      </h2>
      <div className="grid gap-4">
        {UPGRADES.map(upgrade => {
          const count = gameState.purchasedUpgrades[upgrade.id] || 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count));
          const canAfford = gameState.timucelliPuani >= cost;

          return (
            <button
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade)}
              disabled={!canAfford}
              className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left w-full
                ${canAfford 
                  ? 'bg-slate-800 border-slate-600 hover:border-timur-500 hover:bg-slate-750 active:scale-[0.98]' 
                  : 'bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed'}`}
            >
              <div className="text-4xl mr-4">{upgrade.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white">{upgrade.name}</h3>
                  <span className="bg-slate-700 text-xs px-2 py-1 rounded-full text-white">Lvl {count}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{upgrade.description}</p>
                <div className="flex items-center text-sm font-bold text-yellow-400">
                  {cost.toLocaleString()} TP
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderArena = () => {
    if (isGameCompleted) {
      return (
        <div className="pt-20 pb-24 px-4 flex flex-col items-center justify-center h-full text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-white mb-2">TEBRİKLER!</h2>
          <p className="text-slate-300 mb-4">Kadıköy'ün tek hakimi oldun!</p>
          <div className="bg-slate-800 p-6 rounded-xl border border-yellow-500/50">
             <p>Timuçelli Krallığı kuruldu.</p>
          </div>
        </div>
      );
    }

    if (isInCombat) {
      const hpPercent = Math.max(0, (bossHP / currentBoss.baseHealth) * 100);
      return (
        <div className="pt-20 pb-24 px-4 flex flex-col items-center h-full max-w-md mx-auto">
          <div className="w-full bg-slate-800 rounded-full h-6 mb-2 border border-slate-600 overflow-hidden relative">
            <div 
              className="h-full bg-red-600 transition-all duration-100 ease-out" 
              style={{ width: `${hpPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md">
              {Math.ceil(bossHP)} / {currentBoss.baseHealth}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full relative">
            <div className="text-center mb-8 animate-pulse">
              <h2 className="text-3xl font-bold text-red-500">{currentBoss.name}</h2>
              <p className="text-slate-400 text-sm mt-1">"{currentBoss.description}"</p>
            </div>

            <button 
              onMouseDown={handleClick}
              className="relative w-64 h-64 active:scale-90 transition-transform duration-75 group"
            >
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-active:bg-red-500/40 transition-colors"></div>
              <img 
                src={`https://picsum.photos/seed/${currentBoss.id}/400/400`} 
                className="w-full h-full object-cover rounded-xl border-4 border-red-600 shadow-2xl z-10 relative" 
                alt="Boss"
              />
              <div className="absolute -bottom-6 left-0 right-0 text-center animate-bounce text-red-400 font-bold uppercase tracking-widest">
                Saldır!
              </div>
            </button>
          </div>

          <button 
            onClick={forfeitBossFight}
            className="mt-8 px-6 py-3 rounded-full bg-slate-700 text-white font-bold hover:bg-slate-600"
          >
            Kaç (Savaşı Terk Et)
          </button>
        </div>
      );
    }

    // Arena Menu (Pre-fight)
    return (
      <div className="pt-20 pb-24 px-4 space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MapPin className="mr-2" /> Kadıköy Arena
        </h2>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl text-center">
          <div className="mb-4">
            <span className="bg-red-900/50 text-red-200 px-3 py-1 rounded-full text-sm font-bold border border-red-700">
              BOSS #{currentBoss.id}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{currentBoss.name}</h3>
          <p className="text-slate-400 mb-6 italic">"{currentBoss.description}"</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase">Ödül (TP)</div>
              <div className="text-yellow-400 font-bold text-lg">{currentBoss.rewardTP.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase">Ödül (KP)</div>
              <div className="text-rose-400 font-bold text-lg">{currentBoss.rewardKP.toLocaleString()}</div>
            </div>
          </div>
          
          <button 
            onClick={startBossFight}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 transition-all active:translate-y-1 flex items-center justify-center text-xl"
          >
            <Swords className="mr-2" /> SAVAŞ
          </button>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 opacity-75">
          <h4 className="font-bold text-slate-300 mb-2">İlerleme Durumu</h4>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full" 
              style={{ width: `${(gameState.currentBossIndex / BOSS_LIST.length) * 100}%` }}
            />
          </div>
          <div className="text-right text-xs text-slate-500 mt-1">
            {gameState.currentBossIndex} / {BOSS_LIST.length} Fethedildi
          </div>
        </div>
      </div>
    );
  };

  const renderSocial = () => (
    <div className="pt-20 pb-24 px-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Heart className="mr-2 text-rose-500" /> Manitalar
        </h2>
        <div className="text-xs text-slate-400">
          Karizma: {gameState.karizmaPuani}
        </div>
      </div>

      <div className="grid gap-4">
        {GIRLFRIENDS.map(gf => {
          const isUnlocked = gameState.unlockedGirlfriends.includes(gf.id);
          const canUnlock = gameState.karizmaPuani >= gf.requiredKP;

          return (
            <div 
              key={gf.id}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300
                ${isUnlocked 
                  ? 'bg-slate-800 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                  : 'bg-slate-900 border-slate-800'}`}
            >
              <div className="flex p-4">
                <img 
                  src={`https://picsum.photos/${gf.imagePlaceholder}`}
                  alt={gf.name}
                  className={`w-20 h-20 rounded-lg object-cover mr-4 ${!isUnlocked && 'grayscale opacity-50'}`}
                />
                <div className="flex-1 z-10">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-lg ${isUnlocked ? 'text-rose-400' : 'text-slate-500'}`}>
                      {gf.name}
                    </h3>
                    {isUnlocked ? (
                      <span className="bg-rose-900/30 text-rose-300 text-xs px-2 py-1 rounded border border-rose-800">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Kilitli</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{gf.description}</p>
                  
                  {isUnlocked ? (
                     <div className="text-xs font-bold text-green-400">
                       Etki: x{gf.multiplierBonus} Global Çarpan
                     </div>
                  ) : (
                    <button
                      onClick={() => unlockGirlfriend(gf)}
                      disabled={!canUnlock}
                      className={`w-full mt-1 py-1.5 px-3 rounded text-sm font-bold flex items-center justify-center
                        ${canUnlock 
                          ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      Kilidi Aç ({gf.requiredKP} KP)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 relative">
      {renderHeader()}

      {/* Main Content Area */}
      <main className="h-full">
        {activeTab === Tab.HOME && renderHome()}
        {activeTab === Tab.UPGRADES && renderUpgrades()}
        {activeTab === Tab.ARENA && renderArena()}
        {activeTab === Tab.SOCIAL && renderSocial()}
      </main>

      {/* Floating Damage Numbers */}
      {clicks.map(click => (
        <FloatingText 
          key={click.id} 
          x={click.x} 
          y={click.y} 
          text={click.text} 
          onComplete={() => removeClick(click.id)} 
        />
      ))}

      {/* Combat Feedback Overlay */}
      {combatFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md text-yellow-400 text-5xl font-black px-8 py-4 rounded-2xl animate-bounce border-4 border-yellow-500">
            {combatFeedback}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab(Tab.HOME)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === Tab.HOME ? 'text-timur-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Home size={24} />
            <span className="text-[10px] mt-1 font-bold">EV</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(Tab.UPGRADES)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === Tab.UPGRADES ? 'text-timur-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <ShoppingBag size={24} />
            <span className="text-[10px] mt-1 font-bold">MARKET</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(Tab.ARENA)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${activeTab === Tab.ARENA ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`absolute -top-3 bg-red-600 rounded-full p-2 border-4 border-slate-900 shadow-lg ${isInCombat ? 'animate-pulse' : ''}`}>
               <Swords size={24} className="text-white" />
            </div>
            <span className="text-[10px] mt-6 font-bold">SAVAŞ</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(Tab.SOCIAL)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === Tab.SOCIAL ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Heart size={24} />
            <span className="text-[10px] mt-1 font-bold">SOSYAL</span>
          </button>
        </div>
      </nav>
    </div>
  );
}