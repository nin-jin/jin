this.$jin_mixin=
function( schemeMixin ){
    
    var mixin=
    function( scheme ){
        return $jin_class( function( Class, proto ){
            schemeMixin( Class, proto )
            scheme( Class, proto )
        })
    }
    
    mixin.scheme= schemeMixin
    
    return mixin
}


