this.$jin_mongoDB_collection=
$jin_wrapper( function( $jin_mongoDB_collection, mongoDB_collection ){
    
    mongoDB_collection.select= function( mongoDB_collection, query ){
        var cursor= mongoDB_collection.$.find( query )
        return $jin_async2sync( cursor.toArray ).call( cursor )
    }
    
    mongoDB_collection.get= function( mongoDB_collection, query ){
        return $jin_sync2async( mongoDB_collection.$.findOne ).call( mongoDB_collection.$, query )
    }
    
    mongoDB_collection.put= $jin_async2sync( function( mongoDB_collection, query, task, done ){
        mongoDB_collection.$.update( query, task, { safe: true, upsert: true }, done )
    }, 'now' )
    
} )