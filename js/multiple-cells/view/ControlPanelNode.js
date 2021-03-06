// Copyright 2016-2019, University of Colorado Boulder

/**
 * Class for constructing control panels that allow users to alter some of the parameters of the multi-cell protein
 * synthesis model. This class makes sure fonts, colors, etc. are consistent consistent across panels.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Color = require( 'SCENERY/util/Color' );
  const ControllerNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/ControllerNode' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {String} title
   * @param {Array<Object>}controllers
   * @constructor
   */
  function ControlPanelNode( title, controllers ) {

    const controllerNodes = [];

    for ( let i = 0; i < controllers.length; i++ ) {
      const controller = controllers[ i ];
      const label = new Text( controller.label, {
        font: new PhetFont( { size: 13 } ),
        maxWidth: 200
      } );
      const controllerNode = new ControllerNode(
        controller.controlProperty,
        controller.minValue,
        controller.maxValue,
        controller.minLabel,
        controller.maxLabel,
        {
          logScale: controller.logScale
        }
      );
      controllerNodes[ i ] = new VBox( {
        spacing: 5,
        children: [
          label,
          controllerNode
        ]
      } );
    }

    const contentNode = new VBox( {
      spacing: 5,
      children: controllerNodes
    } );

    this.expandedProperty = new Property( false );
    AccordionBox.call( this, contentNode, {
      titleNode: new Text( title, {
        font: new PhetFont( { size: 16, weight: 'bold' } ),
        maxWidth: 200
      } ),
      cornerRadius: GEEConstants.CORNER_RADIUS,
      titleAlignX: 'left',
      contentAlign: 'center',
      fill: new Color( 220, 236, 255 ),
      buttonXMargin: 6,
      buttonYMargin: 6,
      contentYMargin: 8,
      expandedProperty: this.expandedProperty,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 8,
        touchAreaYDilation: 8
      },
      minWidth: 200
    } );
  }

  geneExpressionEssentials.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( AccordionBox, ControlPanelNode, {} );
} );
