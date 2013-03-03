this.$jin_build4web_doc_release= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'release'
    
    var xslFile= pack.file.child( '-mix' ).child( $jin_vary2string( 'doc', vary ) + '.xsl' )
    .content( '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:include href="../../doc/-mix/index.stage=release.xsl"/><xsl:include href="index.stage=release.xsl"/></xsl:stylesheet>' )
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<?xml-stylesheet href="../-mix/' + xslFile.name() + '" type="text/xsl"?><doc_list/>' )
    
    pack.mods().forEach( function( mod ){
        mod.srcs()
        .filter( function( src ){
            return /\.doc\.xml$/.test( src.file.name() )
        } )
        .forEach( function( src ){
            var comment= index.createComment( '../../' + src.file.relate('').replace( /\\/g, '/' ) )
            index.documentElement.appendChild( index.importNode( comment, true ) )
            var doc= ( new $node.xmldom.DOMParser ).parseFromString( src.file.content() + '' ).documentElement
            index.documentElement.appendChild( doc )
        } )
    })
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.doc.xml' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
