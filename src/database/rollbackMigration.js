const { rollbackMigration } = require('.');
const { NODE_ENV } = require('../util/config');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (NODE_ENV === 'production') {
  console.log('\x1b[31m%s\x1b[0m', 'Be careful when rolling back, this is production version');
  readline.question('Type \x1b[41m ROLLBACK \x1b[0m to rollback migration in production:', input => {
    if (input === 'ROLLBACK') {
      console.log('Rolling back one migration in production');
      readline.close();
      rollbackMigration();
      return;
    }
    console.log('Rolling back migration canceled');
    readline.close();
    return;
  });
} else {
  console.log('Rolling back migration on:', NODE_ENV);
  rollbackMigration();
}
