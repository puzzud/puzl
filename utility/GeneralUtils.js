//-----------------------------------------------------------
//-----------------------------------------------------------
CreateArray = function( size, value )
{
  if( value !== undefined )
  {
    var array = new Array( size );
    FillArray( array, value );
    
    return array;
  }
  else
  {
    return new Array( size );
  }
}

//-----------------------------------------------------------
//-----------------------------------------------------------
Create2dArray = function( size0, size1, value )
{
  var array = CreateArray( size0 );
  
  var length = size0 - 1;
  do
  {
    array[length] = CreateArray( size1, value );
  }
  while( --length > -1 );
  
  return array;
}

//-----------------------------------------------------------
//-----------------------------------------------------------
FillArray = function( array, value )
{
  var length = array.length - 1;
  if( length == -1 )
  {
    return;
  }
  else
  {
    do
    {
      array[length] = value;
    }
    while( --length > -1 );
  }
}

//-----------------------------------------------------------
//-----------------------------------------------------------
Fill2dArray = function( array, value )
{
  var length = array.length - 1;

  do
  {
    FillArray( array[length], value );
  }
  while( --length > -1 );
}

//-----------------------------------------------------------
// Copy contents of arrayFrom to arrayTo up to the number
// of common elements (minimum of both array lengths).
//-----------------------------------------------------------
CopyArray = function( arrayFrom, arrayTo )
{
  var length = Math.min( arrayFrom.length, arrayTo.length ) - 1;
  if( length == -1 )
  {
    return;
  }
  
  do
  {
    arrayTo[length] = arrayFrom[length];
  }
  while( --length > -1 );
}

//-----------------------------------------------------------
//-----------------------------------------------------------
LimitValueToRange = function( value, low, high )
{
  if( value < low )
  {
    return low;
  }
  else
  if( value > high )
  {
    return high;
  }

  return value;
}

//-----------------------------------------------------------
// Returns a random integer.
// inputs
//  - bound0: if the only parameter used, this value is one
//            more than the integer number that will be
//            returned.
//  - bound1: (optional) if this parameter is used, bound0
//            represents the lowest possible integer while
//            it represents the highest possible integer
//            returned.
//-----------------------------------------------------------
GetRandomInteger = function( bound0, bound1 )
{
  if( bound1 === undefined )
  {
    // bound0 is high + 1.
    return Math.random() * bound0 | 0;
  }
  else
  {
    // bound0 is low.
    // bound1 is high.
    return ( Math.random() * ( bound1 + 1 - bound0 ) | 0 ) + bound0;
  }
}

//-----------------------------------------------------------
//-----------------------------------------------------------
ParseQueryString = function( queryString )
{
  var queryList = new Array();

  var parameterPropertyList;
  var parameterName;
  var parameterValue;
  
  var queryParameterList = queryString.split( "&" );
  for( var index in queryParameterList )
  {
    parameterPropertyList = queryParameterList[index].split( "=" );
    parameterName  = parameterPropertyList[0];
    parameterValue = parameterPropertyList[1];

    //console.log( "Parameter name: " + parameterName + ", value: " + parameterValue );
    queryList[parameterName] = parameterValue;
  }

  //console.log( queryList );
  return queryList;
}

//-----------------------------------------------------------
//-----------------------------------------------------------
GetPageParameters = function()
{
  return ParseQueryString( location.search.substring( 1 ) );
}

//-----------------------------------------------------------
//-----------------------------------------------------------
GetPageParameterValue = function( pageParameters, parameterName, defaultValue )
{
  var parameterValue = pageParameters[parameterName];
  if( parameterValue === undefined )
  {
    parameterValue = defaultValue;
  }

  //console.log( parameterValue );
  return parameterValue;
}

//-----------------------------------------------------------
GeneralUtilClass = function()
{
  
};

GeneralUtilClass.prototype.getPageParameters = GetPageParameters;
GeneralUtilClass.prototype.getPageParameterValue = GetPageParameterValue;

GeneralUtilClass.prototype.createArray = CreateArray;
GeneralUtilClass.prototype.create2dArray = Create2dArray;
GeneralUtilClass.prototype.fillArray = FillArray;
GeneralUtilClass.prototype.fill2dArray = Fill2dArray;
GeneralUtilClass.prototype.copyArray = CopyArray;

GeneralUtil = new GeneralUtilClass();
