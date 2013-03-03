this.$jin_domx=
$jin_wrapper( function( $jin_domx, domx ){
    
    domx.toDOMDocument=
    function( domx ){
        return domx.$
    }
    
    domx.toString= function( domx ){
        if( $jin_support.xmlModel() === 'w3c' ){
            var serializer= new XMLSerializer
            return serializer.serializeToString( domx.$ )
        } else {
            return String( domx.$.xml ).replace( /^\s+|\s+$/g, '' )
        }
    }
    
    domx.transform= function( domx, stylesheet ){
        if( $jin_support.xmlModel() === 'w3c' ){
            var proc= new XSLTProcessor
            proc.importStylesheet( $jin_unwrap( stylesheet ) )
            var doc= proc.transformToDocument( domx.$ )
            return $jin_domx( doc )
        } else { // works incorrectly =(
            var result= domx.$.transformNode( $jin_unwrap( stylesheet ) )
            return $jin_domx.parse( result )
        }
    }
    
    domx.render= function( domx, from, to ){
        from= $jin_unwrap( from )
        to= $jin_unwrap( to )
        
        if( $jin_support.xmlModel() === 'w3c' ){
            var proc= new XSLTProcessor
            proc.importStylesheet( domx.$ )
            var doc= proc.transformToDocument( from )
            to.innerHTML= $jin_domx( doc )
        } else {
            to.innerHTML= from.transformNode( domx.$ )
        }
        
        return domx
    }
    
    $jin_domx.parse= function( str ){
        if( $jin_support.xmlModel() === 'w3c' ){
            var parser= new DOMParser
            var doc= parser.parseFromString( str, 'text/xml' )
            return $jin_domx( doc )
        } else {
            var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
            doc.async= false
            doc.loadXML( str )
            return $jin_domx( doc )
        }
    }

})
