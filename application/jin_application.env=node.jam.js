this.$jin_application= function( app, done ){
    return $jin_sync2async( app ).call( this, this, done )
}