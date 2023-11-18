import { APerformance, Invoice, Play, PlayType, PlaysConfig } from '../data';

export type EnrichedPerformance = APerformance & {
  play: Play;
  amount: number;
  volumeCredits: number;
};

export type StatementData = {
  customerId: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};

export function createStatementData(invoice: Invoice, plays: PlaysConfig) {
  const data = {} as StatementData;
  data.customerId = invoice.customerId;
  data.performances = invoice.performances.map(enrichPerformance);
  data.totalAmount = totalAmount(data);
  data.totalVolumeCredits = totalVolumeCredit(data);

  return data;

  function enrichPerformance(aPerformance: APerformance): EnrichedPerformance {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance),
    );
    const result = {
      ...aPerformance,
      play: calculator.play,
      amount: calculator.amount / 100,
      volumeCredits: calculator.volumeCredit,
    };
    return result;
  }

  function totalVolumeCredit(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function totalAmount(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function playFor(aPerformance: APerformance) {
    return plays[aPerformance.playId];
  }
}

function createPerformanceCalculator(performance: APerformance, play: Play) {
  switch (play.type) {
    case PlayType.tragedy:
      return new TragedyCalculator(performance, play);
    case PlayType.comedy:
      return new ComedyCalculator(performance, play);
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
}

abstract class PerfomanceCalculator {
  constructor(public performance: APerformance, public play: Play) {}

  abstract get amount(): number;

  get volumeCredit() {
    let result = Math.max(this.performance.audience - 30, 0);
    return result;
  }
}

class TragedyCalculator extends PerfomanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerfomanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  override get volumeCredit() {
    return super.volumeCredit + Math.floor(this.performance.audience / 5);
  }
}
