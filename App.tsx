
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CARD_DATA } from './constants/cards';
import CardTable from './components/CardTable';
import { CardPeriod } from './types';

const App: React.FC = () => {
  const [checkedCards, setCheckedCards] = useState<Record<string, boolean>>(() => {
    try {
      const savedState = localStorage.getItem('yugiohReliefChecklist');
      return savedState ? JSON.parse(savedState) : {};
    } catch (error) {
      console.error("Could not load state from localStorage", error);
      return {};
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('yugiohReliefChecklist', JSON.stringify(checkedCards));
    } catch (error) {
      console.error("Could not save state to localStorage", error);
    }
  }, [checkedCards]);

  const handleCheckChange = useCallback((cardId: string, isChecked: boolean) => {
    setCheckedCards(prev => ({ ...prev, [cardId]: isChecked }));
  }, []);
  
  const { totalCards, checkedCount, progress } = useMemo(() => {
    const total = CARD_DATA.reduce((sum, period) => sum + period.cards.length, 0);
    const checked = Object.values(checkedCards).filter(Boolean).length;
    const prog = total > 0 ? (checked / total) * 100 : 0;
    return {
      totalCards: total,
      checkedCount: checked,
      progress: prog,
    };
  }, [checkedCards]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const normalizedSearchTerm = searchTerm.trim().toLowerCase().replace(/・/g, '');
    if (!normalizedSearchTerm) return;

    let foundCard = null;

    for (const period of CARD_DATA) {
      foundCard = period.cards.find(card => 
        card.name.toLowerCase().replace(/・/g, '').includes(normalizedSearchTerm) || 
        card.id.toLowerCase().includes(normalizedSearchTerm)
      );
      if (foundCard) break;
    }

    if (foundCard) {
      const element = document.getElementById(`card-row-${foundCard.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedCardId(foundCard.id);
        setTimeout(() => {
          setHighlightedCardId(null);
        }, 2000); // 2秒後にハイライトを解除
      }
    } else {
      alert('カードが見つかりませんでした。');
    }
  }, [searchTerm]);
  
  const Header = () => (
    <div className="sticky top-0 z-10 bg-[#0b0205]/80 backdrop-blur-md py-4 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-500 my-6">
              日本語版　遊戯王レリーフ
            </h1>
            <form onSubmit={handleSearch} className="my-4 flex justify-center max-w-lg mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="カード名または番号で検索..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-100 transition-colors"
                aria-label="カード検索"
              />
              <button type="submit" className="flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-r-md transition-colors" aria-label="検索実行">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
        </div>
    </div>
  );

  const ProgressMeter = () => (
      <div className="mb-12">
          <div className="text-center text-gray-300 mb-4">
            <span className="font-bold text-xl text-white">{checkedCount}</span> / {totalCards}枚 ({progress.toFixed(1)}%)
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
        <div className="text-center text-gray-300 mb-8 px-4 text-sm sm:text-base leading-relaxed">
            <p>目指せコンプリート！日本語版遊戯王レリーフ（2期～10期）のチェックリストです。</p>
            <p className="mt-2">あなたのコレクションライフの助けになれば幸いです。</p>
        </div>
        <ProgressMeter />
        {CARD_DATA.map((periodData: CardPeriod) => (
          <CardTable
            key={periodData.period}
            period={periodData.period}
            cards={periodData.cards}
            checkedCards={checkedCards}
            onCheckChange={handleCheckChange}
            highlightedCardId={highlightedCardId}
          />
        ))}
        <footer className="text-center text-gray-500 mt-12 pb-8">
            <p className="text-sm mb-2">チェックしたカードの情報は、お使いのブラウザに自動で保存されます。</p>
            <p className="text-sm mb-2">「Cookieと他のサイトデータ」や「サイトデータ」を消去すると、チェックしたデータも一緒に消えてしまいますのでご注意ください。</p>
            <p className="text-sm">Creater：
                <a 
                    href="https://x.com/petsuo1234" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-500 transition-colors"
                >
                    Petsuo
                </a>
            </p>
            <p className="text-sm">© 2025 ぺつお.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
