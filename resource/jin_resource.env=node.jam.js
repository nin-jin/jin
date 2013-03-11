this.$jin_resource=
$jin_class( function( $jin_resource, resource ){
    
    $jin_registry.scheme( $jin_resource )
    
    resource.uri= null
    resource.cache= null
    resource.type= '.xml'
    
    var init= resource.init
    resource.init= function( resource, uri ){
        resource.uri= $jin_uri( uri )
        init( resource, uri )
    }
    
    resource.resource_act= function( resource, method, req ){
        var res= {}
        res.cache= resource.cache
        res.type= resource.type
        res.content= resource[ 'resource_' + method ]( req )
        return res
    }
    
    resource.toString= function( resource ){
        return String( resource.uri )
    }
    
})