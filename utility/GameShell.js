/** @constructor */
function GameShellSettings()
{
  this.width   = 0;
  this.height  = 0;
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

  this.game = new Phaser.Game( width, height, Phaser.AUTO, "", gameCallBacks );
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

GameShell.prototype.logic  = function(){};
GameShell.prototype.input  = function(){};
GameShell.prototype.resize = function(){};
GameShell.prototype.postInitialize = function(){};
