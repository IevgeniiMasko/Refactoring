import { statement } from '../src/original';
import { invoices, plays } from '../src/data';

test('statement function should return the expected result', () => {
  // Expected output string
  const statementOne = 'Statement for BigCo\n';
  const statementTwo = '  Hamlet: $650.00 (55 seats)\n';
  const statementThree = '  As You Like It: $580.00 (35 seats)\n';
  const statementFour = '  Othello: $500.00 (40 seats)\n';
  const statementFive = 'Amount owed is $1730.00\n';
  const statementSix = 'You earned 47 credits\n';

  const expectedOutput =
    statementOne +
    statementTwo +
    statementThree +
    statementFour +
    statementFive +
    statementSix;

  // Call the statement function and compare the actual output with the expected output
  const actualOutput = statement(invoices[0], plays);
  expect(actualOutput).toBe(expectedOutput);
});
