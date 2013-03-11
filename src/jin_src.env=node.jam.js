this.$jin_src=
$jin_class( function( $jin_src, src ){
    
    $jin_registry.scheme( $jin_src )
    $jin_wrapper.scheme( $jin_src )
    
    src.file= null
    
    src.toString= function( src ){
        return String( src.file )
    }
    
    src.init= function( src, path ){
        src.file= $jin_file( path )
    }
    
    src.mod= function( src ){
        return $jin_mod( src.file.parent() )
    }
    
    src._uses= null
    src.uses= function( src ){
        if( src._uses ) return src._uses
        var uses= [ src.mod() ]
        
        if( /\.jam\.js$/.test( src.file ) ){
            String( src.file.content() )
            .replace
            (   /\$([a-zA-Z0-9]+)(?:_([a-zA-Z0-9]+))?(?!\w*:)/g
            ,   function( str, packName, modName ){
                    var mod= src.mod().pack().pms().pack( packName ).mod( modName || packName )
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                }
            )
        }
        
        if( /\.meta\.tree$/.test( src.file ) ){
            var meta= $jin_tree.parse( src.file.content() )
            
            meta.select(' include / module / ').values().forEach( function( moduleName ){
                var mod= src.mod().pack().pms().mod( moduleName )
                if( !~uses.indexOf( mod ) ) uses.push( mod )
            } )
            
            meta.select(' include / package / ').values().forEach( function( packName ){
                src.mod().pack().pms().pack( packName ).mods()
                .forEach( function( mod ){
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                } )
            } )
        }
        
        if( /\.xsl$/.test( src.file ) ){
            String( src.file.content() )
            .replace
            (   /<([a-zA-Z0-9]+)_([a-zA-Z0-9]+)(?!\w*:)/g
            ,   function( str, packName, modName ){
                    var mod= src.mod().pack().pms().pack( packName ).mod( modName )
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                }
            )
            .replace
            (   / ([a-zA-Z0-9]+)_([a-zA-Z0-9]+)(?:_\w+)?="/g
            ,   function( str, packName, modName ){
                    var mod= src.mod().pack().pms().pack( packName ).mod( modName )
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                }
            )
            .replace
            (   /"([a-zA-Z0-9]+)_([a-zA-Z0-9]+)(?:_\w+)?"/g
            ,   function( str, packName, modName ){
                    var mod= src.mod().pack().pms().pack( packName ).mod( modName )
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                }
            )
        }
        
        return src._uses= uses
    }
    
} )
