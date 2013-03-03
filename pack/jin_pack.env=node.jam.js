this.$jin_pack=
$jin_class( function( $jin_pack, pack ){
    
    $jin_registry.scheme( $jin_pack, pack )
    $jin_wrapper.scheme( $jin_pack, pack )
    
    pack.file= null
    
    pack.toString= function( pack ){
        return String( pack.file )
    }
    
    pack.init= function( pack, path ){
        pack.file= $jin_file( path )
        pack.require()
    }
    
    pack.pms= function( pack ){
        return $jin_pms( pack.file.parent() )
    }
    
    pack.mod= function( pack, name ){
        return $jin_mod( pack.file.child( name || pack.file.name() ) )
    }
    
    pack.mods= function( pack ){
        return pack.file.childs()
        .filter( function( file ){
            return file.isDir() && /^[a-zA-Z]/.test( file.name() )
        } )
        .map( function( file ){
            return $jin_mod( file )
        } )
    }
    
    pack.require= function( pack ){
        if( pack.file.exists() ) return pack
        
        console.log( 'Package [' + pack + '] not found. Search in repository...' )
        
        var repoSource= $jin_request({ uri: 'https://raw.github.com/nin-jin/pms/master/repos.tree' }).body
        var repo= $jin_tree.parse( repoSource ).select( pack.file.name() + ' / ').values().toString()
        
        if( !repo ) throw new Error( 'Package [' + pack + '] not found in repository' )
        
        console.log( 'Installing [' + pack + '] from [' + repo + ']...' )
        //if( !$jin_confirm( 'Install [' + pack + '] from [' + repo + ']?' ) )
        //    throw new Error( 'Package [' + pack + '] is required' )
        
        $jin_execute( 'git', [ 'clone', repo, pack.file.name() ] )
        
        return pack
    }
    
    pack.index= function( pack, vary ){
        if( !vary ) vary= {}
        var varyFilter= []
        for( var key in vary ){
            var val= vary[ key ]
            varyFilter.push( '\\.' + key + '=(?!' + val + '\\.)' )
        }
        varyFilter= RegExp( varyFilter.join( '|' ) || '^$' )
        
        var indexSrcs= []
        var indexMods= []
        
        pack.mods().forEach( function processMod( mod ){
            if( ~indexMods.indexOf( mod ) ) return
            indexMods.push( mod )
            
            mod.pack().require()
            
            var srcs= mod.srcs().filter( function( src ){
                return !varyFilter.test( src.file )
            } )
            
            if( !srcs.length ) return
            
            srcs.sort()
            
            var mainMod= mod.pack().mod()
            if( mainMod.file.exists() ) processMod( mainMod )
            
            srcs.forEach( function( src ){
                src.uses().forEach( processMod )
            } )
            
            indexSrcs= indexSrcs.concat( srcs )
        } )
        
        return indexSrcs
    }
    
    pack.load= function( pack, vary ){
        if( !vary ) vary= {}
        vary.env= 'node'
        vary.stage= vary.stage || 'release'
        
        var file= pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.js' )
        return file.load()
    }
    
} )
