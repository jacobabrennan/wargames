

//== Credentials Table =========================================================

//-- Project constants ---------------------------
const TABLE_CREDENTIALS = 'credentials';
const FIELD_ID = 'id';
const FIELD_HASH = 'hash';
const LIMIT_HASH = 256;

//-- Create Table --------------------------------
exports.up = function(knex, Promise) {
    return knex.schema.createTable(TABLE_CREDENTIALS, table => {
        table.increments(FIELD_ID).primary();
        table
            .string(FIELD_HASH, LIMIT_HASH)
            .notNullable();
    });
};

//-- Destroy Table--------------------------------
exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(TABLE_CREDENTIALS);
};
