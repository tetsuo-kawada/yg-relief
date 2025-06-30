
export interface Card {
  id: string;
  name: string;
}

export interface CardPeriod {
  period: string;
  cards: Card[];
}
