// Copyright 2015-2019, University of Colorado Boulder

/**
 * Specific instance of a gene.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Gene = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Gene' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ProteinB = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinB' );
  const Range = require( 'DOT/Range' );
  const TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );

  // constants
  const REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
  const TRANSCRIBED_REGION_COLOR = new Color( 240, 246, 143, 150 );
  const NUM_BASE_PAIRS_IN_REGULATORY_REGION = 28;
  const NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 150;
  const MRNA_WINDING_ALGORITHM_NUMBER = 4;

  /**
   * @param {DnaMolecule} dnaMolecule -  The DNA molecule within which this gene exists
   * @param {number} initialBasePair - Location on the DNA strand where this gene starts
   * @constructor
   */
  function GeneB( dnaMolecule, initialBasePair ) {
    Gene.call( this, dnaMolecule,
      new Range( initialBasePair, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION ),
      REGULATORY_REGION_COLOR,
      new Range(
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1,
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1 + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION
      ),
      TRANSCRIBED_REGION_COLOR,
      MRNA_WINDING_ALGORITHM_NUMBER
    );

    // Add transcription factors that are specific to this gene. Location is pretty much arbitrary, just meant to look
    // decent.
    this.addTranscriptionFactorLocation( 5, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_2_POS_1 );
    this.addTranscriptionFactorLocation( 16, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_2_POS_2 );
    this.addTranscriptionFactorLocation( 11, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_2_NEG );
  }

  geneExpressionEssentials.register( 'GeneB', GeneB );

  return inherit( Gene, GeneB, {

    /**
     * @override
     * @returns {ProteinB}
     */
    getProteinPrototype: function() {
      return new ProteinB();
    }

  }, {

    // statics
    NUM_BASE_PAIRS: NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION

  } );

} );
