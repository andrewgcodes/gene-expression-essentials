// Copyright 2015-2019, University of Colorado Boulder

/**
 * Shows a picture of real cells containing fluorescent protein.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const IMAGE_WIDTH = 380; // in screen coordinates, empirically determined to look good

  // images
  const eColiImage = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/ecoli.jpg' );

  // strings
  const imageCaptionNoteString = require( 'string!GENE_EXPRESSION_ESSENTIALS/imageCaptionNote' );
  const imageCaptionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/imageCaption' );

  // constants
  const TEXT_FONT = new PhetFont( 12 );

  /**
   * @constructor
   */
  function FluorescentCellsPictureDialog() {

    const imageNode = new Image( eColiImage, {
      minWidth: IMAGE_WIDTH,
      maxWidth: IMAGE_WIDTH
    } );

    // Add the caption.  Originally the caption and the note were two separate strings that were shown on separate
    // lines, but this was changed (see https://github.com/phetsims/gene-expression-essentials/issues/121) and they are
    // now combined. The strings have been left separate in the strings files so that translations don't need to be
    // modified.
    const captionAndNoteNode = new RichText( imageCaptionString + '  ' + imageCaptionNoteString, {
      font: TEXT_FONT,
      lineWrap: IMAGE_WIDTH,
      centerX: imageNode.centerX,
      top: imageNode.bottom + 10,
      align: 'left'
    } );
    const children = [
      imageNode,
      captionAndNoteNode,
      new Text( 'Image Copyright Dennis Kunkel Microscopy, Inc.', { font: TEXT_FONT } )
    ];

    const content = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

    Dialog.call( this, content, {
      topMargin: 20,
      bottomMargin: 20
    } );
  }

  geneExpressionEssentials.register( 'FluorescentCellsPictureDialog', FluorescentCellsPictureDialog );

  return inherit( Dialog, FluorescentCellsPictureDialog );
} );
