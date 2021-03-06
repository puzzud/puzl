/** @constructor */
PuzL.GameScreen = function( game )
{
  this.gameShell    = null;
  this.parentScreen = null;
};
//window['GameScreen'] = PuzL.GameScreen;

PuzL.GameScreen.prototype.id = "";

PuzL.GameScreen.prototype.initialize = function()
{
  
};

PuzL.GameScreen.prototype.preload = function()
{
  this.stage.disableVisibilityChange = !this.gameShell.gameShellSettings.pauseOnLoseFocus;
  this.stage.smoothed = !this.gameShell.gameShellSettings.pixelPerfect;
  
  if( !this.stage.smoothed )
  {
    Phaser.Canvas.setImageRenderingCrisp( this.game.canvas );
  }

  this.initialize();
};

PuzL.GameScreen.prototype.postInitialize = function()
{
  
};

PuzL.GameScreen.prototype.create = function()
{
  this.postInitialize();
};
