

//== Knex Database Settings ====================================================

module.exports = {
    development: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './database/dev.sqlite3'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './database/migrations',
        },
        seeds: {
            directory: './database/seeds',
        },
    }
};
