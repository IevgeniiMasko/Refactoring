import { APerformance, Invoice, Play, PlayType, PlaysConfig } from './data';

type EnrichedPerformance = APerformance & {
  play: Play;
  amount: number;
};

type StatementData = {
  customerId: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolume: number;
};

export function statement(invoice: Invoice, plays: PlaysConfig) {
  const data = {} as StatementData;
  data.customerId = invoice.customerId;
  data.performances = invoice.performances.map(enrichPerformance);
  data.totalAmount = totalAmount(data) / 100;
  data.totalVolume = totalVolumeCredit(data) / 100;

  return renderPlainText(data, plays);

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

export function renderPlainText(data: StatementData, plays: PlaysConfig) {
  let result = `Statement for ${data.customerId}\n`;

  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolume} credits\n`;
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
