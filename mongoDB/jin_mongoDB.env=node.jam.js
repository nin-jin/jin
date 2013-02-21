this.$jin_mongoDB=
$jin_registry( function( $jin_mongoDB, mongoDB ){
    
    mongoDB.uri= null
    mongoDB.driver= null
    
    mongoDB.init= function( mongoDB, uri ){
        mongoDB.uri= $jin_uri( uri )
        mongoDB.driver= $jin_async2sync( $node.mongodb.MongoClient.connect )( String( mongoDB.uri ) )
    }
    
    mongoDB.toString= function( mongoDB ){
        return String( mongoDB.uri )
    }
    
    mongoDB.collection= function( mongoDB, name ){
        return $jin_mongoDB_collection( mongoDB.driver.collection( name ) )
    }
    
} )