this.$jin_orientDB=
$jin_registry( function( $jin_orientDB, orientDB ){
    
    orientDB.uri= null
    orientDB.driver= null
    
    orientDB.init= function( orientDB, uri ){
        orientDB.uri= uri= $jin_uri( uri )
        
        uri.$.protocol= 'orientdb'
        var adapter= $node[ uri.$.protocol ]
        
        var server= new adapter.Server({ host: uri.$.hostname, port: uri.$.port })
        var auth= { user_name: uri.$.username, user_password: uri.$.password }
        var driver= $jin_fiberizer( new adapter.Db( uri.$.pathname, server, auth ) )
        
        driver.openSyncNow()
        
        orientDB.driver= driver
    }
    
    orientDB.toString= function( orientDB ){
        return String( orientDB.uri )
    }
    
    orientDB.exec= function( orientDB, command, options ){
        command= command.map( function( val, index ){
            if( index % 2 ) val= JSON.stringify( val )
            return val
        }).join( '' )
        console.log( command )
        return orientDB.driver.commandSync( command, options )
    }
    
    orientDB.save= function( orientDB, doc ){
        return orientDB.driver.saveSyncNow( doc )
    }
    
} )