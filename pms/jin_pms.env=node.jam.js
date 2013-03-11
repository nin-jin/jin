this.$jin_pms=
$jin_class( function( $jin_pms, pms ){
    
    $jin_registry.scheme( $jin_pms )
    $jin_wrapper.scheme( $jin_pms )
    
    pms.file= null
    
    pms.toString= function( pms ){
        return String( pms.file )
    }
    
    pms.init= function( pms, path ){
        pms.file= $jin_file( path )
    }
    
    pms.pack= function( pms, name ){
        return $jin_pack( pms.file.child( name ) )
    }
    
    pms.mod= function( pms, name ){
        var chunks= /^([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/.exec( name )
        var packName= chunks[ 1 ]
        var modName= chunks[ 2 ]
        
        return pms.pack( packName ).mod( modName )
    }
    
    pms.packs= function( pms ){
        return pms.file.childs()
        .filter( function( file ){
            return file.isDir() && /^[a-zA-Z]/.test( file.name() )
        } )
        .map( function( file ){
            return $jin_pack( file )
        } )
    }
    
} )
