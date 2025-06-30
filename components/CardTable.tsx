
import React from 'react';
import { Card } from '../types';

interface CardTableProps {
  period: string;
  cards: Card[];
  checkedCards: Record<string, boolean>;
  onCheckChange: (cardId: string, isChecked: boolean) => void;
  highlightedCardId: string | null;
}

const CheckIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
);

const CardTable: React.FC<CardTableProps> = ({ period, cards, checkedCards, onCheckChange, highlightedCardId }) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4 pb-2 border-b-2 border-gray-700">{period}</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div>
          <table className="w-full text-left table-fixed">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="p-3 sm:p-4 text-center whitespace-nowrap w-[70px]">所持</th>
                <th className="p-3 sm:p-4 whitespace-nowrap w-[130px]">カード番号</th>
                <th className="py-3 px-2 sm:py-4 sm:px-2">カード名</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {cards.map((card) => (
                <tr 
                  key={card.id} 
                  id={`card-row-${card.id}`}
                  className={`transition-all duration-300 ${highlightedCardId === card.id ? 'bg-amber-500/20' : 'hover:bg-gray-700/50'}`}
                  >
                  <td className="p-3 sm:p-4 align-middle text-center">
                    <label htmlFor={`checkbox-${card.id}`} className="flex justify-center items-center cursor-pointer">
                      <input
                        id={`checkbox-${card.id}`}
                        type="checkbox"
                        className="appearance-none h-6 w-6 border-2 border-gray-600 rounded-md bg-gray-700 checked:bg-amber-500 checked:border-transparent focus:outline-none transition-all duration-200"
                        checked={!!checkedCards[card.id]}
                        onChange={(e) => onCheckChange(card.id, e.target.checked)}
                      />
                      <span className="absolute opacity-0 pointer-events-none check-1 transition-opacity">
                        <CheckIcon />
                      </span>
                      <style>{`
                        #checkbox-${card.id}:checked + .check-1 {
                          opacity: 1;
                        }
                      `}</style>
                    </label>
                  </td>
                  <td className="p-3 sm:p-4 font-mono text-gray-400 whitespace-nowrap">{card.id}</td>
                  <td className="py-3 px-2 sm:py-4 sm:px-2 font-semibold text-gray-100 break-words">{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CardTable;