// Copyright 2015-2019, University of Colorado Boulder

/**
 * Class that represents the collection area, where several different types of protein can be collected.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const kite = require( 'KITE/kite' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ProteinA = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinA' );
  const ProteinB = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinB' );
  const ProteinC = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinC' );
  const ProteinCaptureNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/ProteinCaptureNode' );

  /**
   * @param {ManualGeneExpressionModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ProteinCollectionArea( model, modelViewTransform ) {
    Node.call( this );

    // Get a transform that performs only the scaling portion of the modelViewTransform.
    const scaleVector = modelViewTransform.getMatrix().getScaleVector();
    const scale = modelViewTransform.getMatrix().scaleVector.x;

    // The getScaleVector method of Matrix3 always returns positive value for the scales, even though
    // the modelViewTransform uses inverted scaling for Y, so changing the assertion statement to check for absolute values
    // see issue #7
    assert && assert( scale === Math.abs( scaleVector.y ) ); // This only handles symmetric transform case.
    const transform = Matrix3.scaling( scale, -scale );

    // Figure out the max dimensions of the various protein types so that the capture nodes can be properly laid out.
    const captureNodeBackgroundSize = new Dimension2( 0, 0 );

    const proteinTypes = [ ProteinA, ProteinB, ProteinC ];
    for ( let i = 0; i < proteinTypes.length; i++ ) {
      const protein = new proteinTypes[ i ]();
      const proteinShapeBounds = protein.getFullyGrownShape()
        .transformed( transform )
        .getStrokedBounds( new kite.LineStyles( { lineWidth: 1 } ) );
      captureNodeBackgroundSize.width = ( Math.max(
        proteinShapeBounds.width * ProteinCaptureNode.SCALE_FOR_FLASH_NODE,
        captureNodeBackgroundSize.width
      ) );
      captureNodeBackgroundSize.height = ( Math.max(
          proteinShapeBounds.height * ProteinCaptureNode.SCALE_FOR_FLASH_NODE,
          captureNodeBackgroundSize.height )
      );
    }

    // Add the collection area, which is a set of collection nodes.
    this.addChild( new HBox( {
      children: [
        new ProteinCaptureNode( model, 'ProteinA', transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, 'ProteinB', transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, 'ProteinC', transform, captureNodeBackgroundSize )
      ],
      spacing: 0
    } ) );
  }

  geneExpressionEssentials.register( 'ProteinCollectionArea', ProteinCollectionArea );

  return inherit( Node, ProteinCollectionArea );
} );
