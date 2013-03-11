this.$jin_uri=
$jin_class( function( $jin_uri, uri ){
    
    $jin_uri.sep= ';'
    $jin_uri.eq= '='
    
    var make= $jin_uri.make
    $jin_uri.make= function( data ){
        if( typeof data === 'string' ) data= $node.url.parse( data )
        if( typeof data.query === 'string' ) data.query= $node.querystring.parse( data.query, $jin_uri.sep, $jin_uri.eq )
        if( !data.query ) data.query= {}
        
        if( data.auth ){
            var chunks= data.auth.split( ':' )
            data.username= chunks[ 0 ]
            data.password= chunks[ 1 ]
        }
        
        delete data.host
        delete data.path
        delete data.search
        delete data.auth
        
        return make.call( this, data )
    }
    
    $jin_wrapper.scheme( $jin_uri )
    
    $jin_uri.escape= function( str ){
        return str
        .replace
        (   /[^- a-zA-Z\/?:@!$'()*+,._~\xA0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\x{4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD\uE000-\uF8FF\uF0000-\uFFFFD\u100000-\u10FFFD}]+/
        ,   function( str ){
                return $node.querystring.escape( str )
            }
        )
        .replace( / /g, '+' )
    }
    
    uri.toString= function( uri ){
        var chunks= []
        for( var key in uri.$.query ){
            if( !uri.$.query.hasOwnProperty( key ) ) continue
            chunks.push( $jin_uri.escape( key ) + $jin_uri.eq + $jin_uri.escape( uri.$.query[ key ] ) )
        }
        
        var auth= []
        if( uri.$.username ) auth.push( uri.$.username )
        if( uri.$.password ) auth.push( uri.$.password )
        
        return $node.url.format(
        {   protocol: uri.$.protocol
        ,   slashes: uri.$.slashes
        ,   hostname: uri.$.hostname
        ,   port: uri.$.port
        ,   auth: auth.join( ':' )
        ,   pathname: uri.$.pathname
        ,   search: chunks.join( $jin_uri.sep )
        ,   hash: uri.$.hash
        })
    }
    
})
