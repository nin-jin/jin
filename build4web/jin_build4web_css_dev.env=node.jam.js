this.$jin_build4web_css_dev= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'dev'
    
    var all= pack.index( vary )
    .filter( function( src ){
        return /\.css$/.test( src.file.name() )
    } )
    
    if( all.length > 30  ){
        var index= []
        var p= 0;
        var page= []
        
        function makePage( ){
            var pageFile= pack.file.child( '-mix' ).child( $jin_vary2string( 'page=' + p, vary ) + '.css' )
            pageFile.content( page.join( '\n' ) )
            index.push( '@import url( "../../' + pageFile.uri() + '" );' )
            ++p
            page= []
        }
        
        all.forEach( function( src ){
            page.push( '@import url( "../../' + src.file.uri() + '" );' )
            if( page.length > 30 ) makePage()
        })
        if( page.length ) makePage()
        
        return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.css' )
        .content( index.join( '\n' ) )
    } else {
        var index= all.map( function( src ){
            return '@import url("../../' + src.file.uri() + '");'
        } )
    }
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.css' )
    .content( index.join( '\n' ) )
}
