const Sequelize = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const { DATABASE_URL, NODE_ENV } = require('../util/config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
  define: {
    timestamps: true,             // Use createdAt and UpdatedAt timestamps
    freezeTableName: true,        // Freeze names, no plural names
    underscored: true,            // Underscore everywhere, no need to declare on model level
  },
  logging: NODE_ENV === 'development'
});


const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
  sequelize.close();
};


const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('database connected to:', NODE_ENV);
  } catch (err) {
    console.log(`connecting to ${NODE_ENV} database failed`, err);
    return process.exit(1);
  }
  return null;
};

module.exports = {
  connectToDatabase,
  runMigrations,
  rollbackMigration,
  sequelize
};
