/** @constructor */
PuzL.AStar = function( platformPathGraph )
{
  this.platformPathGraph = platformPathGraph;

  this.openList = [];
  this.closedList = [];

  this.route = [];
};

PuzL.AStar.prototype.distance = function( node1, node0 )
{
  // Manhattan method.
  return Math.abs( node1.x - node0.x ) + Math.abs( node1.y - node0.y );
};

PuzL.AStar.prototype.updateNodeValues = function( node, prevNode, routeCost, endNode )
{
  node.routeCost = routeCost;
  node.estimatedCost = routeCost + this.distance( node, endNode );
  
  node.prevNode = prevNode;
};

PuzL.AStar.prototype.findPath = function( startNode, endNode, route, pathLogicHost )
{
  // Check if resulting route array list was provided.
  if( route === undefined )
  {
    route = this.route;
  }

  if( pathLogicHost === undefined )
  {
    pathLogicHost = null;
  }
  else
  {
    if( pathLogicHost.aStarPathLogic === undefined )
    {
      pathLogicHost = null;
    }
  }

  route.length = 0;

  startNode.routeCost = 0;
  this.openList.push( startNode );
  
  var routeFound = false;
  while( this.openList.length > 0 )
  {
    // The smallest element/
    // TODO: Consider a better way of getting the smallest element.
    var currentNode = this.openList.sort(
      function( a, b )
      {
        return a.estimatedCost - b.estimatedCost;
      }
    )[0];

    if( currentNode == endNode )
    {
      routeFound = true;
      break;
    }

    var connectedNodeList = currentNode.nodeList;
    var connectedNodeWeightList = currentNode.weightList;
    
    var numberOfConnectedNodes = connectedNodeList.length;
    for( var cni = 0; cni < numberOfConnectedNodes; cni++ )
    {
      var node = connectedNodeList[cni];

      var weight = ( pathLogicHost !== null ) ? pathLogicHost.aStarPathLogic( currentNode, node, connectedNodeWeightList[cni] ) : connectedNodeWeightList[cni];
      //var weight = connectedNodeWeightList[cni];

      var newRouteCost = currentNode.routeCost + weight;
      if( this.closedList.indexOf( node ) > -1 )
      {
        // The node is in closed list
        if( newRouteCost <= node.routeCost )
        {
          // Remove from closed list
          this.closedList.splice( this.closedList.indexOf( node ), 1 );
          this.updateNodeValues( node, currentNode, newRouteCost, endNode );
          this.openList.push( node );
        }
      }
      else
      if( this.openList.indexOf( node ) > -1 )
      {
        // The node is in open list
        if( newRouteCost < node.routeCost )
        {
          this.updateNodeValues( node, currentNode, newRouteCost, endNode );
        }
      }
      else
      {
        // The node is not processed
        this.updateNodeValues( node, currentNode, newRouteCost, endNode );
        this.openList.push( node );
      }
    }

    // Remove from open list
    this.openList.splice( this.openList.indexOf( currentNode ), 1 );

    // Add to closed list
    this.closedList.push( currentNode );
  }

  if( routeFound )
  {
    var routeNode = endNode;
    while( routeNode )
    {
      route.push( routeNode );
      routeNode = routeNode.prevNode;
    }

    route.reverse();
  }

  var routeCost = route[route.length - 1].routeCost;

  // Cleanup, so that old values don't mess around.
  var graphNodeList = this.platformPathGraph.nodeList;
  var numberOfNodes = graphNodeList.length;
  for( var ni = 0; ni < numberOfNodes; ni++ )
  {
    graphNodeList[ni].resetNodePathValues();
  }

  this.openList.length = 0;
  this.closedList.length = 0;

  // Return route cost.
  if( route.length < 1 )
  {
    return Number.MAX_SAFE_INTEGER;
  }

  return routeCost;
};
