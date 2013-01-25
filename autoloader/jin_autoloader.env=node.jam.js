this.$jin_autoloader=
$jin_proxy( { get: function( prefix, name ){
    var path= ( prefix || '' ) + name
    
    try {
        path= require.resolve( path )
    } catch( error ){
        if( error.code !== 'MODULE_NOT_FOUND' ) throw error
        if( name === 'constructor' ) return function(){ return function(){} }
        
        if( name === 'inspect' ) return function(){ return '$jin_autoloader( "' + prefix + '" )' }
        
        console.info( '$.jin.loader: Autoinstall( ' + path + ' )')
        
        var $= $jin_autoloader()
        $.npm.loadSyncNow( {} )
        $.npm.commands.installSyncNow([ path ])
    }
    
    return /*$jin_fiberizer*/( require( path ) )
} } )
