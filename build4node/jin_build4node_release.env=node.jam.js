this.$jin_build4node_release= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.env= 'node'
    vary.stage= 'release'
    
    var index= pack.index( vary )
    .filter( function( src ){
        return /\.js$/.test( src.file.name() )
    } )
    .map( function( src ){
        return ';//../../' + src.file.uri() + '\n' + src.file.content()
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.js' )
    .content( 'with( this ){\n' + index.join( '\n' ) + '\n}' )
}
