// Copyright 2015-2017, University of Colorado Boulder

/**
 * Class that represents the DNA molecule in the view.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DnaMoleculeCanvasNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeCanvasNode' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GeneNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/GeneNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var geneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene' );

  /**
   *
   * @param {DnaMolecule} dnaMolecule
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} backboneStrokeWidth
   * @param {boolean} showGeneBracketLabels
   * @constructor
   */
  function DnaMoleculeNode( dnaMolecule, modelViewTransform, backboneStrokeWidth, showGeneBracketLabels ) {
    Node.call( this );

    // Add the layers onto which the various nodes that represent parts of the dna, the hints, etc. are placed.
    var geneBackgroundLayer = new Node();
    this.addChild( geneBackgroundLayer );

    // Layers for supporting the 3D look by allowing the "twist" to be depicted.
    this.dnaBackboneLayer = new DnaMoleculeCanvasNode( dnaMolecule, modelViewTransform, backboneStrokeWidth, {
      canvasBounds: new Bounds2(
        dnaMolecule.getLeftEdgeXPosition(),
        dnaMolecule.getBottomEdgeYPosition() + modelViewTransform.viewToModelDeltaY( 10 ),
        dnaMolecule.getRightEdgeXPosition(),
        dnaMolecule.getTopEdgeYPosition() - modelViewTransform.viewToModelDeltaY( 10 )
      ),
      matrix: modelViewTransform.getMatrix()
    } );

    this.addChild( this.dnaBackboneLayer );

    // Put the gene backgrounds and labels behind everything.
    for ( var i = 0; i < dnaMolecule.getGenes().length; i++ ) {
      geneBackgroundLayer.addChild( new GeneNode(
        modelViewTransform,
        dnaMolecule.getGenes()[ i ],
        dnaMolecule,
        StringUtils.fillIn( geneString, { geneID: i + 1 } ),
        showGeneBracketLabels
      ) );
    }
  }

  geneExpressionEssentials.register( 'DnaMoleculeNode', DnaMoleculeNode );

  return inherit( Node, DnaMoleculeNode, {

    /**
     * @public
     */
    step: function() {
      this.dnaBackboneLayer.step();
    }
  } );
} );

