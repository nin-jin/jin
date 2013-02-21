this.$jin_middle4pack=
function( pack ){
    pack= $jin_pack( pack )
    var $= this
    
    return $jin_sync2middle( function( req, res ){
        var uri= $jin_uri( req.originalUrl.substring( 1 ) )
        
        var prefix= '$' + pack.file.name() + '_'
        var keys= Object.keys( uri.$.query )
        
        while( keys.length ){
            var resource= $[ prefix + keys.join( '_' ) ]
            
            if( !resource ){
                keys.pop()
                continue
            }
            
            return resource( uri ).resource_act( 'get', req )
        }
        
        return null
    } )
}