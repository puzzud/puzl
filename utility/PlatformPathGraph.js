/** @constructor */
PuzL.PlatformPathGraphNode = function( x, y, type, tile )
{
  this.x = x;
  this.y = y;

  // TODO: Get tile width / height from tilemap.
  this.sx = x * 32;
  this.sy = y * 32;

  this.type = ( type === null ) ? this.TYPE_NONE : type;

  if( tile !== null )
  {
    tile.properties.pathode = type;
  }
  
  this.nodeList = [];
};

PuzL.PlatformPathGraphNode.prototype.TYPE_NONE = 0;
PuzL.PlatformPathGraphNode.prototype.TYPE_WALK = 1;
PuzL.PlatformPathGraphNode.prototype.TYPE_DROP = 2;
PuzL.PlatformPathGraphNode.prototype.TYPE_LAND = 3;

/** @constructor */
PuzL.PlatformPathGraph = function( tilemapLayer )
{
  PuzL.PlatformPathGraphNode.call( this, 0, 0, this.TYPE_NONE, null );

  this.tilemapLayer = tilemapLayer;
  this.layerObject = this.tilemapLayer.layer;

  this.tilemap = tilemapLayer.map;
  
  this.layerIndex = this.tilemap.getLayerIndex( this.layerObject.name );

  //this.tileSet = this.tilemap.tilesets[0];

  this.nodeList = [];

  this.build();
};
extend( PuzL.PlatformPathGraph, PuzL.PlatformPathGraphNode );

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
          // Determine if the previous tile *is* the previous working node.
          if( tile.properties.pathNode !== undefined )
          {
            // In which case, just use it (don't create a new one).
            node = tile.properties.pathNode;
          }
          else
          {
            // Create a node for the previous working node.
            node = this.connect( node, x - 1, y, this.TYPE_WALK );
          }

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
            leftFallNode = this.connect( null, x - 1, y, this.TYPE_DROP );
          }

          // Create a new node (for new walkable path).
          node = this.connect( leftFallNode, x, y, this.TYPE_WALK );

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
            this.connect( node, x, y, this.TYPE_WALK );

            node = null; // NOTE: Redundant
          }
        }
        else
        {
          // Create a node for the last walkable tile (to the left).
          node = this.connect( node, x - 1, y, this.TYPE_WALK );

          // Create a new node for fall point.
          node = this.connect( node, x, y, this.TYPE_DROP );

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

PuzL.PlatformPathGraph.prototype.connect = function( rootNode, x, y, type )
{
  var layerData = this.layerObject.data;
  var tile = layerData[y][x];

  var tileProperties = tile.properties;
  if( tileProperties.pathNode !== undefined )
  {
    // Tile is already associated with a path node.
    return tileProperties.pathNode;
  }

  var newNode = new PuzL.PlatformPathGraphNode( x, y, type, tile );
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

  var node = rootNode;

  while( ++y < height )
  { 
    tile = layerData[y][x];
    if( tile.index > -1 )
    {
      break;
    }

    // Check left and right (this may be a future drop point).
    tile = layerData[y][x - 1];
    if( tile.index > -1 )
    {
      node = this.connect( node, x, y - 1, this.TYPE_DROP );
      continue;
    }

    tile = layerData[y][x + 1];
    if( tile.index > -1 )
    {
      node = this.connect( node, x, y - 1, this.TYPE_DROP );
      continue;
    }
  }

  // Make end of drop path.
  return this.connect( node, x, y - 1, this.TYPE_LAND );
};
