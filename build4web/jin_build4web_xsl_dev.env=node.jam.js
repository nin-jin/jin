this.$jin_build4web_xsl_dev= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'dev'
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">' )
    
    pack.index( vary )
    .filter( function( src ){
        return /\.xsl$/.test( src.file.name() )
    } )
    .forEach( function( src ){
        var link= index.createElement( 'xsl:include' )
        link.setAttribute( 'href', '../../' + src.file.uri() )
        index.documentElement.appendChild( link )
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.xsl' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
