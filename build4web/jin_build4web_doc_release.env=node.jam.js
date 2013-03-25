this.$jin_build4web_doc_release= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'release'
    
    var xslFile= pack.file.child( '-mix' ).child( $jin_vary2string( 'doc', vary ) + '.xsl' )
    .content( '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:include href="../../doc/-mix/index.stage=release.xsl"/><xsl:include href="index.stage=release.xsl"/></xsl:stylesheet>' )
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<?xml-stylesheet href="' + xslFile.name() + '" type="text/xsl"?><doc_list/>' )
    
    pack.index( vary )
    .filter( function( src ){
        return /\.doc\.xml$/.test( src.file.name() )
    } )
    .forEach( function( src ){
        var link= '../../' + src.file.relate('').replace( /\\/g, '/' )
        var comment= index.createComment( link )
        index.documentElement.appendChild( index.importNode( comment, true ) )
        var doc= ( new $node.xmldom.DOMParser ).parseFromString( src.file.content() + '' ).documentElement
        doc.setAttribute( 'doc_link', link )
        index.documentElement.appendChild( doc )
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.doc.xml' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
