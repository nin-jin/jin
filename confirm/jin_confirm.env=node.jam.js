this.$jin_confirm= $jin_async2sync( function( question, done ){
    $node.promptly.confirm( question, done )
}, 'now' )