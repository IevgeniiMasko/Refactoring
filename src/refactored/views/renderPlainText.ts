import { StatementData } from '../createStatementData';
import { usd } from '../utils';

export function renderPlainText(data: StatementData) {
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
