this.$jin_build4web_doc_release= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'release'
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<?xml-stylesheet href="../../doc/-mix/index.stage=release.xsl" type="text/xsl"?><doc_list/>' )
    
    pack.index( vary )
    .filter( function( src ){
        return /\.doc\.xhtml$/.test( src.file.name() )
    } )
    .forEach( function( src ){
        var comment= index.createComment( '../../' + src.file.relate('').replace( /\\/g, '/' ) )
        index.documentElement.appendChild( index.importNode( comment, true ) )
        var doc= ( new $node.xmldom.DOMParser ).parseFromString( src.file.content() + '' ).documentElement
        index.documentElement.appendChild( doc )
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.doc.xhtml' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
