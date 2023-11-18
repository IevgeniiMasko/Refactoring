import { APerformance, Invoice, Play, PlayType, PlaysConfig } from './data';

type EnrichedPerformance = APerformance & {
  play: Play;
};

type StatementData = {
  customerId: string;
  performances: EnrichedPerformance[];
};

export function statement(invoice: Invoice, plays: PlaysConfig) {
  const data = {} as StatementData;
  data.customerId = invoice.customerId;
  data.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(data, plays);

  function enrichPerformance(aPerformance: APerformance): EnrichedPerformance {
    const result = {
      ...aPerformance,
      play: playFor(aPerformance),
    };
    return result;
  }

  function playFor(aPerformance: APerformance) {
    return plays[aPerformance.playId];
  }
}

export function renderPlainText(data: StatementData, plays: PlaysConfig) {
  let result = `Statement for ${data.customerId}\n`;

  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredit()} credits\n`;
  return result;

  function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  function totalVolumeCredit() {
    let result = 0;
    for (let perf of data.performances) {
      result += volumeCreditFor(perf);
    }
    return result;
  }

  function usd(amount: number) {
    return `$${amount}.00`;
  }

  function volumeCreditFor(aPerformance: APerformance) {
    let result = Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === PlayType.comedy) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function playFor(aPerformance: APerformance) {
    return plays[aPerformance.playId];
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
}
