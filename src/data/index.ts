export enum PlayType {
  tragedy = 'tragedy',
  comedy = 'comedy',
}

export class Play {
  constructor(public id: string, public name: string, public type: PlayType) {}
}

export class APerformance {
  constructor(public playId: string, public audience: number) {}
}

export class Invoice {
  constructor(public customerId: string, public performances: APerformance[]) {}
}

const hamlet = new Play('hamlet', 'Hamlet', PlayType.tragedy);
const aslike = new Play('aslike', 'As You Like It', PlayType.comedy);
const othello = new Play('othello', 'Othello', PlayType.tragedy);

export type PlaysConfig = {
  [E in Play as E['id']]: Play;
};

export const plays: PlaysConfig = {
  [hamlet.id]: hamlet,
  [aslike.id]: aslike,
  [othello.id]: othello,
};

export const invoices = [
  new Invoice('BigCo', [
    new APerformance(hamlet.id, 55),
    new APerformance(aslike.id, 35),
    new APerformance(othello.id, 40),
  ]),
];
