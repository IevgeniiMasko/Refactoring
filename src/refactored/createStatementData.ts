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
  data.totalAmount = totalAmount(data) / 100;
  data.totalVolumeCredits = totalVolumeCredit(data);

  return data;

  function totalVolumeCredit(data: StatementData) {
    let result = 0;
    for (let perf of data.performances) {
      result += volumeCreditFor(perf);
    }
    return result;
  }

  function volumeCreditFor(aPerformance: APerformance) {
    return new PerfomanceCalculator(aPerformance, playFor(aPerformance))
      .volumeCredit;
  }

  function totalAmount(data: StatementData) {
    let result = 0;
    for (let perf of data.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  function enrichPerformance(aPerformance: APerformance): EnrichedPerformance {
    const calculator = new PerfomanceCalculator(
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

  function amountFor(aPerformance: APerformance) {
    return new PerfomanceCalculator(aPerformance, playFor(aPerformance)).amount;
  }

  function playFor(aPerformance: APerformance) {
    return plays[aPerformance.playId];
  }
}

class PerfomanceCalculator {
  constructor(public performance: APerformance, public play: Play) {}

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case PlayType.tragedy:
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case PlayType.comedy:
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }

  get volumeCredit() {
    let result = Math.max(this.performance.audience - 30, 0);
    if (this.play.type === PlayType.comedy) {
      result += Math.floor(this.performance.audience / 5);
    }
    return result;
  }
}
