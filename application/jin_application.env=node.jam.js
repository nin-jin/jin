this.$jin_application= function( app, done ){
    var $= $jin_autoloader()
    app= $.jin.sync2async( app )
    return app( $, done )
}