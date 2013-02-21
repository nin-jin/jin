this.$jin_execute=
$jin_async2sync( function( command, args, done ){
    var proc= $node.child_process.spawn( command, args, { stdio: 'inherit' } )
    proc.on( 'exit', function( code ){
        if( code ) throw new Error( 'Execution of [' + command + ' ' + args.join( ' ' ) + '] ends with code ' + code )
        done( code )
    })
}, 'now' )