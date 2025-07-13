import https from 'https';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiKey = 'a1f6ef6b81d5cd95409e38be';
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      const rates = result.conversion_rates;

      console.log(chalk.green('Exchange rates based on USD:\n'));

      // Optional: print a few common currencies
      console.log(`${chalk.cyan("INR")}: ${chalk.yellow(rates["INR"])}`);
      console.log(`${chalk.cyan("EUR")}: ${chalk.yellow(rates["EUR"])}`);
      console.log(`${chalk.cyan("GBP")}: ${chalk.yellow(rates["GBP"])}\n`);

      // Now prompt user
      rl.question('Enter the amount in USD: ', (amountInput) => {
        const amount = parseFloat(amountInput);
        if (isNaN(amount)) {
          console.log(chalk.red('Invalid amount.'));
          rl.close();
          return;
        }

        rl.question('Enter the target currency (e.g., INR, EUR): ', (currency) => {
          const upperCurrency = currency.trim().toUpperCase();

          if (!rates[upperCurrency]) {
            console.log(chalk.red('Currency not found in exchange rates.'));
          } else {
            const converted = amount * rates[upperCurrency];
            console.log(chalk.blueBright(`\n${amount} USD = ${converted.toFixed(2)} ${upperCurrency}`));
          }

          rl.close();
        });
      });

    } catch (err) {
      console.error(chalk.red('Error parsing JSON:'), err.message);
      rl.close();
    }
  });
}).on('error', (err) => {
  console.error(chalk.red('HTTPS request failed:'), err.message);
  rl.close();
});
