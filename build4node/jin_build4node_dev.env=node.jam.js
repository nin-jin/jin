this.$jin_build4node_dev= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.env= 'node'
    vary.stage= 'dev'
    
    var index= pack.index( vary )
    .filter( function( src ){
        return /\.js$/.test( src.file.name() )
    } )
    .map( function( src ){
        return '("' + String( src ).replace( /\\/g, '/' ) + '")'
    } )
    
    index.unshift( "\
void function( path ){                               \n\
    var fs= require( 'fs' )                          \n\
    var source= fs.readFileSync( path )              \n\
    source= 'with(this){' + source + '}'             \n\
    module._compile( source, path )                  \n\
    return arguments.callee                          \n\
}                                                    \n\
    " )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.js' )
    .content( index.join( '\n' ) )
}
