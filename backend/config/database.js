const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sqliteInstance = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false,
});

let postgresInstance = null;

if (process.env.DATABASE_URL && process.env.USE_SQLITE !== 'true') {
    try {
        postgresInstance = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
                keepAlive: true,
            },
            pool: {
                max: 10,
                min: 0,
                acquire: 15000,
                idle: 10000,
                evict: 1000
            },
            logging: false,
        });
    } catch (e) {
        console.warn('⚠️ Could not construct PostgreSQL instance:', e.message);
        postgresInstance = null;
    }
}

let activeSequelize = postgresInstance || sqliteInstance;

const defineModel = (name, attributes, options = {}) => {
    const pgModel = postgresInstance ? postgresInstance.define(name, attributes, options) : null;
    const sqliteModel = sqliteInstance.define(name, attributes, options);

    return new Proxy({}, {
        get(target, prop, receiver) {
            const currentModel = (activeSequelize === postgresInstance && pgModel) ? pgModel : sqliteModel;
            const val = Reflect.get(currentModel, prop, currentModel);
            if (typeof val === 'function') {
                return val.bind(currentModel);
            }
            return val;
        },
        set(target, prop, value, receiver) {
            const currentModel = (activeSequelize === postgresInstance && pgModel) ? pgModel : sqliteModel;
            return Reflect.set(currentModel, prop, value, currentModel);
        }
    });
};

async function initDatabase() {
    if (postgresInstance) {
        try {
            console.log('🔌 Testing PostgreSQL database connection...');
            await postgresInstance.authenticate();
            console.log('✅ PostgreSQL database connection established successfully.');
            activeSequelize = postgresInstance;
        } catch (err) {
            console.error('⚠️ PostgreSQL connection failed (' + err.message + ').');
            console.log('🔄 Automatically falling back to local SQLite database (database.sqlite)...');
            activeSequelize = sqliteInstance;
        }
    } else {
        console.log('ℹ️ Using local SQLite database (database.sqlite).');
        activeSequelize = sqliteInstance;
    }

    try {
        await activeSequelize.sync();
        console.log(`✅ Database synced successfully (${activeSequelize.getDialect()})`);
    } catch (syncErr) {
        console.error('❌ Sync error on active DB, falling back to SQLite:', syncErr.message);
        activeSequelize = sqliteInstance;
        await activeSequelize.sync();
        console.log('✅ SQLite fallback database synced successfully');
    }

    return activeSequelize;
}

const sequelizeProxy = new Proxy({}, {
    get(target, prop, receiver) {
        if (prop === 'define') {
            return defineModel;
        }
        if (prop === 'initDatabase') {
            return initDatabase;
        }
        if (prop === 'getActiveSequelize') {
            return () => activeSequelize;
        }
        const val = Reflect.get(activeSequelize, prop, activeSequelize);
        if (typeof val === 'function') {
            return val.bind(activeSequelize);
        }
        return val;
    },
    set(target, prop, value, receiver) {
        return Reflect.set(activeSequelize, prop, value, activeSequelize);
    }
});

module.exports = sequelizeProxy;
module.exports.initDatabase = initDatabase;
