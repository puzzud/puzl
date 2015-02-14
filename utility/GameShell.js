var GlobalGameShell = null;

/** @constructor */
PuzL.GameShell = function( game )
{
  // Constructor.
  //console.log( "GameShell::constructor()" );
  GlobalGameShell = this;
  
  this.initialized = false;
  
  this.quit = false;

  this.game = game;

  this.keyboard = null;

  this.fullScreen = false;
};
//window['GameShell'] = GameShell;

PuzL.GameShell.prototype.gameShellSettings =
{
  width: 0,
  height: 0,

  pixelPerfect: true
}

PuzL.GameShell.prototype.run = function()
{
  var width = this.gameShellSettings.width;
  var height = this.gameShellSettings.height;

  var renderType = ( this.gameShellSettings.pixelPerfect ) ? Phaser.CANVAS : Phaser.AUTO;
  this.game = new Phaser.Game( width, height, renderType, "gameContainer" );

  this.shellInitialize();
};
PuzL.GameShell.prototype['run'] = PuzL.GameShell.prototype.run;

PuzL.GameShell.prototype.shellInitialize = function()
{
  //console.log( "PuzL.GameShell::shellInitialize()" );

  this.pageParameters = GeneralUtil.getPageParameters();

  this.initialize();
  
  this.shellPostInitialize();
};

PuzL.GameShell.prototype.shellPostInitialize = function()
{
  //console.log( "PuzL.GameShell::shellPostInitialize()" );
  //this.keyboard = this.game.input.keyboard;
  
  this.postInitialize();
};

PuzL.GameShell.prototype.shellShutdown = function()
{
  //console.log( "PuzL.GameShell::shellShutdown()" );
};

PuzL.GameShell.prototype.initialize = function(){};
PuzL.GameShell.prototype.postInitialize = function(){};
PuzL.GameShell.prototype.shutdown = function(){};

PuzL.GameShell.prototype.toggleFullScreen = function()
{
  this.fullscreen = !this.fullscreen;
  this.setFullScreen( this.fullscreen );
};

PuzL.GameShell.prototype.setFullScreen = function( fullscreen )
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
