this.$jin_build4web_js_dev= function( pack, vary ){
    pack= $jin_pack( pack )
    vary= vary || {}
    vary.env= 'web'
    vary.stage= 'dev'
    
    var index= pack.index( vary )
    .filter( function( src ){
        return /\.js$/.test( src.file.name() )
    } )
    .map( function( src ){
        return '"../../' + src.file.uri() + '",'
    } )
    
    index.unshift( "\
void function( modules ){                                               \n\
    var scripts= document.getElementsByTagName( 'script' )              \n\
    var script= document.currentScript || scripts[ scripts.length - 1 ] \n\
    var dir= script.src.replace( /[^/]+$/, '' )                         \n\
    try {                                                               \n\
        document.write( '' )                                            \n\
        var writable= true                                              \n\
    } catch( error ){                                                   \n\
        var writable= false                                             \n\
    }                                                                   \n\
    var next= function( ){                                              \n\
        var module= modules.shift()                                     \n\
        if( !module ) return                                            \n\
        if( writable ) {                                                \n\
            document.write( '<script src=\"'+dir+module+'\"></script>' )\n\
            next()                                                      \n\
        } else {                                                        \n\
            var loader= document.createElement( 'script' )              \n\
            loader.parentScript= script                                 \n\
            loader.src= dir + module                                    \n\
            loader.onload= next                                         \n\
            script.parentNode.insertBefore( loader, script )            \n\
        }                                                               \n\
    }                                                                   \n\
    next()                                                              \n\
}.call( this, [                                                         \n\
    " )
    
    index.push( " null ])" )
    
    return pack.file.child( '-mix' ).child( $jin_vary2string( 'index', vary ) + '.js' )
    .content( index.join( '\n' ) )
}
