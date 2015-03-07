/** @constructor */
PuzL.PlatformPathGraph = function( tilemapLayer )
{
  this.tilemapLayer = tilemapLayer;
  this.layerObject = this.tilemapLayer.layer;

  this.tilemap = tilemapLayer.map;
  
  this.layerIndex = this.tilemap.getLayerIndex( this.layerObject.name );

  //this.tileSet = this.tilemap.tilesets[0];

  this.nodeList = [];

  this.build();
};

PuzL.PlatformPathGraph.prototype.build = function()
{
  var game = this.tilemapLayer.game;

  var layerData = this.layerObject.data;

  var node = null;

  var tile = null;
  var walkable = false;

  var width  = this.tilemap.width;
  var height = this.tilemap.height;

  for( var y = 0; y < height; y++ )
  {
    node = null;

    for( var x = 0; x < width; x++ )
    {
      if( y + 1 === height )
      {
        // Don't process the bottom row?
        continue;
      }

      tile = layerData[y][x];
      if( tile.index > -1 )
      {
        if( node !== null )
        {
          // TODO: Determine if the previous tile *is* the previous working node.
          // In which case, just use it (don't create a new one).
          
          // Create a node for the previous working node.
          this.connectNewNode( node, x - 1, y, null );

          // Close off this walking path.
          node = null;
        }

        continue;
      }

      // Check to see if this tile has a walkable tile below it.
      walkable = ( layerData[y + 1][x].index > -1 ) ? true : false;

      if( node === null )
      {
        if( walkable )
        {
          // Determine if a fall point is to the left (tile to left must also be open).
          var leftFallNode = null;
          if( ( x > 0 ) &&
              ( layerData[y][x - 1].index < 0 ) )
          {
            // Create a fall point to the left.
            leftFallNode = this.connectNewNode( null, x - 1, y, null );
          }

          // Create a new node (for new walkable path).
          node = this.connectNewNode( leftFallNode, x, y, null );

          if( leftFallNode !== null )
          {
            // Investigate a fall point vertically (to the left).
            this.buildDropPath( leftFallNode );
          }
        }
        else
        {
          continue;
        }
      }
      else
      {
        // We have a working node path.

        if( walkable )
        {
          // Check if this tile is against the right edge of the map.
          if( x === width - 1 )
          {
            // Create a new node (for end of walkable path).
            this.connectNewNode( node, x, y, null );

            node = null; // NOTE: Redundant
          }
        }
        else
        {
          // Create a node for the last walkable tile (to the left).
          node = this.connectNewNode( node, x - 1, y, null );

          // Create a new node for fall point.
          node = this.connectNewNode( node, x, y, null );

          // Investigate a fall point vertically.
          this.buildDropPath( node );

          // Close off the working node path.
          node = null;
        }

        //
      }
    }
  }
};

PuzL.PlatformPathGraph.prototype.connectNewNode = function( rootNode, x, y, type )
{
  var newNode = new PuzL.PlatformPathGraphNode( x, y, null );
  this.nodeList.push( newNode );

  // Connect the working root node to this new node.
  if( rootNode !== null )
  {
    rootNode.nodeList.push( newNode );

    // And vice versa?
    newNode.nodeList.push( rootNode );
  }

  return newNode;
};

PuzL.PlatformPathGraph.prototype.buildDropPath = function( rootNode )
{
  var x = rootNode.x;
  var y = rootNode.y;

  var height = this.tilemap.height;

  var layerData = this.layerObject.data;

  y++;
  var tile = layerData[y][x];
  if( tile.index > -1 )
  {
    // Root node is end of drop path.
    return rootNode;
  }

  y++;
  while( y < height )
  { 
    tile = layerData[y][x];
    if( tile.index > -1 )
    {
      break;
    }

    y++;
  }

  // Make end of drop path.
  return this.connectNewNode( rootNode, x, y - 1, null );
};

/** @constructor */
PuzL.PlatformPathGraphNode = function( x, y, type )
{
  this.x = x;
  this.y = y;

  this.type = this.TYPE_NONE;
  if( type !== null )
  {
    this.type = type;
  }

  this.nodeList = [];
};

PuzL.PlatformPathGraphNode.prototype.TYPE_NONE = 0;
PuzL.PlatformPathGraphNode.prototype.TYPE_DROP = 1;
PuzL.PlatformPathGraphNode.prototype.TYPE_LAND = 2;
