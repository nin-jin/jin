this.$jin_sourceWatcher=
function( onChange, path, options ){
    if( !path ) path= '.'
    if( !options ) options= { exclude: [ /(\\|\/|^)[^a-zA-Z]/, 'node_modules' ] }
    
    onChange= $jin_throttle( 250, onChange )
    
    $node['fs-watch-tree'].watchTree
    (   path
    ,   options
    ,   function( event ){
            if( event.isMkdir() ) return
            onChange( event )
        }
    )
}