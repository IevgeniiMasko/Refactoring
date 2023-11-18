import { APerformance, Invoice, Play, PlayType, PlaysConfig } from '../data';

export type EnrichedPerformance = APerformance & {
  play: Play;
  amount: number;
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
    let result = Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === PlayType.comedy) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function totalAmount(data: StatementData) {
    let result = 0;
    for (let perf of data.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  function enrichPerformance(aPerformance: APerformance): EnrichedPerformance {
    const result = {
      ...aPerformance,
      play: playFor(aPerformance),
      amount: amountFor(aPerformance) / 100,
    };
    return result;
  }

  function amountFor(aPerformance: APerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case PlayType.tragedy:
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case PlayType.comedy:
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function playFor(aPerformance: APerformance) {
    return plays[aPerformance.playId];
  }
}
