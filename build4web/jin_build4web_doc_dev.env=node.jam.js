this.$jin_build4web_doc_dev= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'dev'
    
    var xslFile= pack.file.child( '-mix' ).child( $jin_vary2string( 'doc', vary ) + '.xsl' )
    .content( '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:include href="../../doc/-mix/index.stage=dev.xsl"/><xsl:include href="index.stage=dev.xsl"/></xsl:stylesheet>' )
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<?xml-stylesheet href="../-mix/' + xslFile.name() + '" type="text/xsl"?><doc_list/>' )
    
    pack.mods().forEach( function( mod ){
        mod.srcs()
        .filter( function( src ){
            return /\.doc\.xml$/.test( src.file.name() )
        } )
        .forEach( function( src ){
            var link= index.createElement( 'doc_root' )
            link.setAttribute( 'doc_link', '../../' + src.file.relate('').replace( /\\/g, '/' ) )
            link.setAttribute( 'doc_title', src.file.name().replace( /\.doc\.xml$/, '') )
            index.documentElement.appendChild( link )
        } )
    })
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.doc.xml' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
