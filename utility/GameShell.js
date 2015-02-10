/** @constructor */
function GameShellSettings()
{
  this.width   = 0;
  this.height  = 0;

  this.pixelPerfect = true;
}
window['GameShellSettings'] = GameShellSettings;

var GlobalGameShell = null;

/** @constructor */
function GameShell( gameShellSettings )
{
  // Constructor.
  //console.log( "GameShell::constructor()" );
  GlobalGameShell = this;

  if( gameShellSettings !== undefined )
  {
    this.gameShellSettings = gameShellSettings;
  }
  else
  {
    this.gameShellSettings = new GameShellSettings();
  }
  
  this.initialized = false;
  
  this.quit = false;

  this.game = null;

  this.keyboard = null;

  this.fullScreen = false;
}
window['GameShell'] = GameShell;

GameShell.prototype.run = function()
{
  //console.log( "GameShell::run()" );

  var gameCallBacks =
  {
    preload: this.shellInitialize.bind( this ),
    create: this.shellPostInitialize.bind( this ),
    update: this.shellLogic.bind( this )
  };

  var width = this.gameShellSettings.width;
  var height = this.gameShellSettings.height;

  var renderType = this.gameShellSettings.pixelPerfect ? Phaser.CANVAS : Phaser.AUTO;
  this.game = new Phaser.Game( width, height, renderType, "", gameCallBacks );
};
GameShell.prototype['run'] = GameShell.prototype.run;

GameShell.prototype.shellInitialize = function()
{
  //console.log( "GameShell::shellInitialize()" );

  this.pageParameters = GeneralUtil.getPageParameters();

  this.keyboard = this.game.input.keyboard;

  this.initialize();
};

GameShell.prototype.shellPostInitialize = function()
{
  //console.log( "GameShell::shellPostInitialize()" );
  this.postInitialize();
};

GameShell.prototype.shellShutdown = function()
{
  //console.log( "GameShell::shellShutdown()" );
};

GameShell.prototype.shellLogic = function()
{
  //console.log( "GameShell::shellLogic()" );
  if( !this.quit )
  {
    this.input();
    this.logic();
  }
  else
  {
    this.shutdown();
    this.shellShutdown();
  }
};

GameShell.prototype.initialize = function(){};
GameShell.prototype.logic  = function(){};
GameShell.prototype.input  = function(){};
GameShell.prototype.resize = function(){};
GameShell.prototype.postInitialize = function(){};
GameShell.prototype.shutdown = function(){};

GameShell.prototype.toggleFullScreen = function()
{
  this.fullscreen = !this.fullscreen;
  this.setFullScreen( this.fullscreen );
};

GameShell.prototype.setFullScreen = function( fullscreen )
{
  if( fullscreen )
  {
    // Change game dimensions to match screen.
    //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

    // Scale to user specified scale ratio.
    //this.game.scale.setUserScale( 1.0, 1.0 );
    //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;

    // Stretch to fill.
    //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Keep original size.
    //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    // Maintain aspect ratio.
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    this.game.scale.startFullScreen( this.gameShellSettings.pixelPerfect );
  }
  else
  {
    this.game.scale.stopFullScreen();
  }
};
