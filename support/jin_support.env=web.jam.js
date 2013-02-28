this.$jin_support= {}

void function(){
    
    var Switch= function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
    
    var Support= function( state ){
        var sup= function(){ return state }
        sup.select= function( map ){
            return Switch( state, map )
        }
        return sup
    }

    var node= document.createElement( 'html:div' )
    
    $jin_support.xmlModel= Support( ( window.DOMParser && window.XMLSerializer && window.XSLTProcessor ) ? 'w3c' : 'ms' )
    $jin_support.htmlModel= Support( node.namespaceURI !== void 0 ? 'w3c' : 'ms' )
    $jin_support.eventModel= Support( 'addEventListener' in node ? 'w3c' : 'ms' )
    $jin_support.selectionModel= Support( 'createRange' in document ? 'w3c' : 'ms' )
    $jin_support.vml= Support( /*@cc_on!@*/ false )
    
}()
