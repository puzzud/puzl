/** @constructor */
PuzL.GameScreen = function( gameShell, parentScreen )
{
  // Constructor.
  this.gameShell    = gameShell;
  //this.parentScreen = parentScreen; // TODO: Check for undefined.

  //this.gameShell = game.gameShell;

  this.subScreen      = null;
  this.nextSubScreen  = null;
  this.resetSubScreen = true;
}

//window['GameScreen'] = PuzL.GameScreen;

PuzL.GameScreen.prototype.setNextSubScreen = function( nextSubScreen, reset )
{
  //console.log( "PuzL.GameScreen::setSubScreenIndex(" + subScreenIndex + ")" );
  if( this.subScreen !== nextSubScreen )
  {
    this.nextSubScreen = nextSubScreen;
  }
  
  if( reset === undefined )
  {
    reset = false;
  }
  
  this.resetSubScreen = reset;
};

PuzL.GameScreen.prototype.initialize = function()
{
  
};

PuzL.GameScreen.prototype.preload = function()
{
  this.initialize();
};

PuzL.GameScreen.prototype.postInitialize = function()
{
  
};

PuzL.GameScreen.prototype.create = function()
{
  this.postInitialize();
};

PuzL.GameScreen.prototype.reset = function()
{
  if( this.subScreen !== null )
  {
    this.resetSubScreen = false;
    this.subScreen.reset();
  }
};

PuzL.GameScreen.prototype.input = function()
{
  if( this.nextSubScreen !== null )
  {
    this.subScreen = this.nextSubScreen;
    this.nextSubScreen = null;
  }
  
  if( this.resetSubScreen ) // NOTE: Should reset run here before logic?
  {
    this.resetSubScreen = false;
    
    if( this.subScreen !== null )
    {
      this.subScreen.reset();
    }
  }
  
  if( this.subScreen !== null )
  {
    this.subScreen.input();
  }
};

PuzL.GameScreen.prototype.logic = function()
{
  if( this.subScreen !== null )
  {
    this.subScreen.logic();
  }
};

PuzL.GameScreen.prototype.update = function()
{
  this.logic();
};
