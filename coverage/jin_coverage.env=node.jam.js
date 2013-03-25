this.$jin_coverage= function( pack ){
    pack= $jin_pack( pack )
    from= pack.mod( '-mix' )
    to= pack.mod( '-cov' )
    
    $jin_execute( 'jscoverage', [ '' + from, '' + to ] )
    
    return to
}
