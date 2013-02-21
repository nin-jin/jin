this.$jin_build4web_doc_dev= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.stage= 'dev'
    
    var index= ( new $node.xmldom.DOMParser ).parseFromString( '<?xml-stylesheet href="../../doc/-mix/index.stage=dev.xsl" type="text/xsl"?><doc_list/>' )
    
    pack.index( vary )
    .filter( function( src ){
        return /\.doc\.xhtml$/.test( src.file.name() )
    } )
    .forEach( function( src ){
        var link= index.createElement( 'doc_root' )
        link.setAttribute( 'doc_link', '../../' + src.file.relate('').replace( /\\/g, '/' ) )
        link.setAttribute( 'doc_title', src.file.name().replace( /\.doc\.xhtml$/, '') )
        index.documentElement.appendChild( link )
    } )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.doc.xhtml' )
    .content( ( new $node.xmldom.XMLSerializer ).serializeToString( index ) )
}
