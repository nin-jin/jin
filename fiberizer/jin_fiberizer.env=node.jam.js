this.$jin_fiberizer=
$jin_proxy( { get: function( base, name ){
    if( !require( 'fibers' ).current )
        return base[ name ]
    
    if( name === 'valueOf' ) return function( ){ return base }
    if( name === 'inspect' ) return function(){ return require( 'util' ).inspect( base ) }
    
    var chunks= /^(.+)Sync(Now)?$/.exec( name )
    if( !chunks ){
        if( typeof base[ name ] !== 'object' )
            return base[ name ]
        
        return fiberizer( base[ name ] )
    }
    
    name= chunks[ 1 ]
    if( typeof base[ name ] !== 'function' )
        return base[ name ]
    
    var now= chunks[ 2 ]
    var value= $jin_async2sync( base[ name ], now )
    
    return value
} } )
