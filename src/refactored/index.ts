import { Invoice, PlaysConfig } from '../data';
import { usd } from './utils';
import { StatementData, createStatementData } from './createStatementData';

export function statement(invoice: Invoice, plays: PlaysConfig) {
  return renderPlainText(createStatementData(invoice, plays), plays);
}

export function renderPlainText(data: StatementData, plays: PlaysConfig) {
  let result = `Statement for ${data.customerId}\n`;

  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}
