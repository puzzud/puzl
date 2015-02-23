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
          var endNode = new PuzL.PlatformPathGraphNode( x - 1, y, null );
          this.nodeList.push( endNode );
          
          node.nodeList.push( endNode );

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
            leftFallNode = new PuzL.PlatformPathGraphNode( x - 1, y, null );
            this.nodeList.push( leftFallNode );
          }

          // Create a new node (for new walkable path).
          node = new PuzL.PlatformPathGraphNode( x, y, null );
          this.nodeList.push( node );

          if( leftFallNode !== null )
          {
            // Connect the left fall node to this new walkable node.
            leftFallNode.nodeList.push( node );

            // Investigate a fall point vertically (to the left).
            // TODO: Call function to go vertical.
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
            var rightmostNode = new PuzL.PlatformPathGraphNode( x, y, null );
            this.nodeList.push( rightmostNode );

            // Connect the working node to this rightmost node.
            node.nodeList.push( rightmostNode );

            node = null; // NOTE: Redundant
          }
        }
        else
        {
          // Create a node for the last walkable tile (to the left).
          var newNode = new PuzL.PlatformPathGraphNode( x - 1, y, null );
          this.nodeList.push( newNode );

          // Connect the working node to this new node.
          node.nodeList.push( newNode );
          node = newNode;

          // Create a new node for fall point.
          newNode = new PuzL.PlatformPathGraphNode( x, y, null );
          this.nodeList.push( newNode );

          // Connect the working node to this node.
          node.nodeList.push( newNode );
          node = newNode;

          // Investigate a fall point vertically.
          // TODO: Call function to go vertical.

          // Close off the working node path.
          node = null;
        }

        //
      }
    }
  }
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
