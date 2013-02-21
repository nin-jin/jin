this.$jin_vary2string= function( prefix, vary ){
    if( !vary ) vary= {}
    
    var chunks= []
    for( var key in vary ){
        chunks.push( key + '=' + vary[ key ] )
    }
    chunks.sort()
    chunks.unshift( prefix )
    
    return chunks.join( '.' )
}
