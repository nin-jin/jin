this.$jin_build4web_xsl_release= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'release'
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">' )
    
    pack.index( vary )
    .filter( function( src ){
        return /\.xsl$/.test( src.file.name() )
    } )
    .forEach( function( src ){
        var comment= index.createComment( '../../' + src.file.uri() )
        index.documentElement.appendChild( comment )
        var doc= ( new $node.xmldom.DOMParser ).parseFromString( src.file.content() + '', 'text/xml' ).documentElement
        for( var i= 0; i < doc.childNodes.length; ++i )
            index.documentElement.appendChild( index.importNode( doc.childNodes[ i ], true ) )
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.xsl' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
