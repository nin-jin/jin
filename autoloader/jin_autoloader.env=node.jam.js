this.$jin_autoloader=
$jin_proxy( { get: function( prefix, name ){
    var path= ( prefix || '' ) + name
    
    try {
        path= require.resolve( path )
    } catch( error ){
        if( error.code !== 'MODULE_NOT_FOUND' ) throw error
        if( name === 'constructor' ) return function(){ return function(){} }
        
        if( name === 'inspect' ) return function(){ return '$jin_autoloader( "' + prefix + '" )' }
        
        if( !$jin_confirm( 'Module [' + path + '] not found. Try to install them via NPM?' ) )
            throw error
        
        var npm= $jin_autoloader().npm
        $jin_async2sync( npm.load , 'now' ).call( npm, {} )
        $jin_async2sync( npm.commands.install, 'now' ).call( npm, [ path ] )
    }
    
    return require( path )
} } )
