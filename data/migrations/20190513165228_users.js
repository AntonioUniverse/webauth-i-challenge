exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments()
    
        tbl.string('username', 228)
        .notNullable()
        .unique()
    
        tbl.string('password', 228)
        .notNullable()
        
    
    })
      
    };
    
    exports.down = function(knex, Promise) {
      return knex.schema.dropTableIfExist('users')
    };
