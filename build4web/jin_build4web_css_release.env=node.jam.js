this.$jin_build4web_css_release= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'release'
    
    var index= pack.index( vary )
    .filter( function( src ){
        return /\.css$/.test( src.file.name() )
    } )
    .map( function( src ){
        return '/* ../../' + src.file.uri() + ' */\n' + src.file.content()
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.css' )
    .content( index.join( '\n' ) )
}
