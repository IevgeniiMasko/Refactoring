import { APerformance, Invoice, Play, PlayType, PlaysConfig } from './data';

export function statement(invoice: Invoice, plays: PlaysConfig) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customerId}\n`;
  const format = (amount: number) => `$${amount}.00`;

  for (let perf of invoice.performances) {
    let thisAmount = amountFor(perf, playFor(perf));

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (playFor(perf).type === PlayType.comedy) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // print line for this order
    result += `  ${playFor(perf).name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  function playFor(aPerformance: APerformance) {
    return plays[aPerformance.playId];
  }

  function amountFor(aPerformance: APerformance, play: Play) {
    let result = 0;
    switch (play.type) {
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
        throw new Error(`unknown type: ${play.type}`);
    }
    return result;
  }
}
