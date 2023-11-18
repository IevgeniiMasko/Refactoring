import { Invoice, PlaysConfig } from '../data';

import { createStatementData } from './createStatementData';
import { renderPlainText } from './views/renderPlainText';

export function statement(invoice: Invoice, plays: PlaysConfig) {
  return renderPlainText(createStatementData(invoice, plays));
}
