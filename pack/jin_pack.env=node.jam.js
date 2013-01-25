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
            
            var srcs= mod.srcs().filter( function( src ){
                return !varyFilter.test( src.file )
            } )
            
            srcs.forEach( function( src ){
                src.uses().forEach( processMod )
            } )
            
            indexSrcs= indexSrcs.concat( srcs )
        } )
        
        return indexSrcs
    }
    
    pack.build= function( pack, vary ){
        var filePrefix= vary2string( 'index', vary )
        
        var srcs= pack.index( vary )
        
        var srcsJS= srcs.filter( function( src ){
            return /\.js$/.test( src.file.name() )
        } )
        
        var indexJS= [ "\
void function( path ){                    \n\
    var fs= require( 'fs' )               \n\
    var source= fs.readFileSync( path )   \n\
    source= 'with(this){' + source + '}'  \n\
    module._compile( source, path )       \n\
    return arguments.callee               \n\
}                                         \n\
        "]
        
        indexJS= indexJS.concat( srcsJS.map( function( src ){
            return '("' + String( src ).replace( /\\/g, '\\\\' ) + '")'
        } ) )
        
        pack.file.child( '-mix' ).child( filePrefix + '.stage=dev.js' )
        .content( indexJS.join( '\n' ) )
        
        var contentsJS= srcsJS.map( function( src ){
            return ';//' + src + '\n' + src.file.content()
        } )
        
        pack.file.child( '-mix' ).child( filePrefix + '.stage=release.js' )
        .content( 'with(this){\n' + contentsJS.join( '\n' ) + '}' )
        
        return pack
    }
    
    pack.load= function( pack, vary ){
        if( !vary ) vary= {}
        vary.env= 'node'
        
        var path= String( pack.file.child( '-mix' ).child( vary2string( 'index', vary ) + '.js' ) )
        return require( $.path.resolve( path ) )
    }
    
    var vary2string= function( prefix, vary ){
        if( !vary ) vary= {}
        
        var chunks= []
        for( var key in vary ){
            chunks.push( key + '=' + vary[ key ] )
        }
        chunks.sort()
        chunks.unshift( prefix )
        
        return chunks.join( '.' )
    }
    
} )
