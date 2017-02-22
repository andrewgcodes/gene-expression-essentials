// Copyright 2015, University of Colorado Boulder


/**
 * This class defines a synthetic cell. The central dogma is simulated as a Markov process for a single protein.
 * Transcription  Translation
 * DNA   ->    RNA       ->    Protein
 * Simulated using the algorithm from Gillespie, 1977
 *
 * @Author George A. Emanuel
 * @Author Aadish Gupta
 */

define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  var DEFAULT_TRANSCRIPTION_FACTOR_COUNT = 2000;
  var TRANSCRIPTION_FACTOR_COUNT_RANGE = new Range( DEFAULT_TRANSCRIPTION_FACTOR_COUNT / 10, DEFAULT_TRANSCRIPTION_FACTOR_COUNT * 10 );
  var DEFAULT_TF_ASSOCIATION_PROBABILITY = 2.5E-6;
  var TF_ASSOCIATION_PROBABILITY_RANGE = new Range( DEFAULT_TF_ASSOCIATION_PROBABILITY / 10, DEFAULT_TF_ASSOCIATION_PROBABILITY * 10 );
  var DEFAULT_POLYMERASE_ASSOCIATION_PROBABILITY = 9.5E-7;
  var POLYMERASE_ASSOCIATION_PROBABILITY_RANGE = new Range( 0.0, 2 * DEFAULT_POLYMERASE_ASSOCIATION_PROBABILITY );
  var DEFAULT_PROTEIN_DEGRADATION_RATE = 0.0004;
  var PROTEIN_DEGRADATION_RANGE = new Range( DEFAULT_PROTEIN_DEGRADATION_RATE * 0.7, DEFAULT_PROTEIN_DEGRADATION_RATE * 1.3 );
  var DEFAULT_MRNA_DEGRADATION_RATE = 0.01;
  var MRNA_DEGRADATION_RATE_RANGE = new Range( DEFAULT_MRNA_DEGRADATION_RATE / 1000, DEFAULT_MRNA_DEGRADATION_RATE * 1000 );


  function CellProteinSynthesisSimulator(  ribosomeCount ) {
    this.objectCounts = [
      20, //gene count
      DEFAULT_TRANSCRIPTION_FACTOR_COUNT, //free transcription factor count
      5000, //polymerase count
      0, //gene, transcription factor complex count
      0, //gene, TF, polymerase count
      0, //mRNA count
      2000, //ribosome count
      0, //mRNA, ribosome complex count
      0 //protein count
    ];

    this.reactionProbabilities = [
      DEFAULT_TF_ASSOCIATION_PROBABILITY, //gene, TF association
      0.0009, //gene-TF degradation
      DEFAULT_POLYMERASE_ASSOCIATION_PROBABILITY, //gene-TF-polymerase association
      0.00085, //gene-TF-polymerase degradation
      0.003, //transcription
      0.001, //mRNA-ribosome association
      0.0009, //mRNA-ribosome degradation
      0.0009, //translation
      DEFAULT_PROTEIN_DEGRADATION_RATE, //protein degradation
      DEFAULT_MRNA_DEGRADATION_RATE //mRNA degradation
    ];

    this.objectCounts[6] = ribosomeCount;
  }

  geneExpressionEssentials.register( 'CellProteinSynthesisSimulator', CellProteinSynthesisSimulator );
  return inherit( Object, CellProteinSynthesisSimulator, {

    /**
     * Sets the number of transcription factors
     *
     * @param tfCount number of transcription factors
     */
    setTranscriptionFactorCount: function( tfCount ) {
      // Parameter checking.
      assert && assert( TRANSCRIPTION_FACTOR_COUNT_RANGE.contains( tfCount ) );
      this.objectCounts[1] = tfCount;
    },
    /**
     * Sets the number of polymerases
     *
     * @param polymeraseCount number of polymerases
     */
    setPolymeraseCount: function( polymeraseCount ) {
      this.objectCounts[ 2 ] = polymeraseCount;
    },

    /**
    * Sets the rate that transcription factors associate with genes
    *
    * @param newRate
    */
    setGeneTranscriptionFactorAssociationRate: function( newRate ) {
      assert && assert( TF_ASSOCIATION_PROBABILITY_RANGE.contains( newRate ) );
      this.reactionProbabilities[0] = newRate;
    },

    /**
    * Sets the rate constant for the polymerase to bind to the gene
    *
    * @param newRate the rate for polymerase binding
    */
    setPolymeraseAssociationRate: function( newRate ) {
      assert && assert( POLYMERASE_ASSOCIATION_PROBABILITY_RANGE.contains( newRate ) );
      this.reactionProbabilities[2] = newRate;
    },

    /**
    * Sets the rate constant for RNA/ribosome association
    *
    * @param newRate the rate at which RNA binds to a ribosome
    */
    setRNARibosomeAssociationRate: function( newRate ) {
      this.reactionProbabilities[ 5 ] = newRate;
    },

    setProteinDegradationRate: function( proteinDegradationRate ) {
    assert && assert( PROTEIN_DEGRADATION_RANGE.contains( proteinDegradationRate ) );
      this.reactionProbabilities[8] = proteinDegradationRate;
    },

    setMrnaDegradationRate: function( mrnaDegradationRate ) {
    assert && assert( MRNA_DEGRADATION_RATE_RANGE.contains( mrnaDegradationRate ) );
      this.reactionProbabilities[9] = mrnaDegradationRate;
    },

    /**
    * Moves forward one time step of specified length
    *
    * @param dt the length of this step through time
    */
    stepInTime: function( dt ) {
      var accumulatedTime = 0.0;
      var timeIncrement = -1.0;
      while ( accumulatedTime < dt && timeIncrement !== 0.0 ) {
        timeIncrement = this.simulateOneReaction( dt - accumulatedTime );
        accumulatedTime += timeIncrement;
      }
    },

    /**
    * Simulates one reaction if the wait time before that reaction occurs is less than
    * maxTime
    *
    * @param maxTime the maximum of time to wait for this reaction to occur
    * @return the amount of time evolved in the system
    */
    simulateOneReaction: function( maxTime ) {
      var a = this.calculateA();
      var a0 = this.sum( a );

      var r1 = phet.joist.random.nextDouble();
      var r2 = phet.joist.random.nextDouble();
      var tau = ( 1 / a0 ) * Math.log( 1 / r1 );
      if ( tau > maxTime ) {
        return 0.0;
      }

      var mu = 0;
      var sumSoFar = a[0];
      while ( sumSoFar < r2 * a0 ) {
        mu++;
        sumSoFar += a[mu];
      }
      this.conductReaction( mu );
      return tau;
    },

    sum: function( array ){
      var total = 0;
      for ( var i = 0; i< array.length; i++ ){
        total += array[i];
      }
      return total;
    },

    calculateA: function() {
      var h = [
        this.objectCounts[0] * this.objectCounts[1],
        this.objectCounts[3],
        this.objectCounts[2] * this.objectCounts[3],
        this.objectCounts[4],
        this.objectCounts[4],
        this.objectCounts[5] * this.objectCounts[6],
        this.objectCounts[7],
        this.objectCounts[7],
        this.objectCounts[8],
        this.objectCounts[5]
      ];

      for ( var i = 0; i < h.length; i++ ) {
        h[i] *= this.reactionProbabilities[i];
      }
      return h;
    },

    conductReaction: function( mu ) {
      switch( mu ) {
        case 0:
          this.objectCounts[0]--;
          this.objectCounts[1]--;
          this.objectCounts[3]++;
          break;
        case 1:
          this.objectCounts[0]++;
          this.objectCounts[1]++;
          this.objectCounts[3]--;
          break;
        case 2:
          this.objectCounts[3]--;
          this.objectCounts[2]--;
          this.objectCounts[4]++;
          break;
        case 3:
          this.objectCounts[3]++;
          this.objectCounts[2]++;
          this.objectCounts[4]--;
          break;
        case 4:
          this.objectCounts[0]++;
          this.objectCounts[1]++;
          this.objectCounts[2]++;
          this.objectCounts[4]--;
          this.objectCounts[5]++;
          break;
        case 5:
          this.objectCounts[5]--;
          this.objectCounts[6]--;
          this.objectCounts[7]++;
          break;
        case 6:
          this.objectCounts[5]++;
          this.objectCounts[6]++;
          this.objectCounts[7]--;
          break;
        case 7:
          this.objectCounts[6]++;
          this.objectCounts[7]--;
          this.objectCounts[8]++;
          break;
        case 8:
          this.objectCounts[8]--;
          break;
        case 9:
          this.objectCounts[5]--;
          break;
        default:
          assert && assert( false, 'Unhandled mu value' );
          break;
      }
    },

    /**
    * Get the number of proteins currently in this cell.
    *
    * @return protein count
    */
    getProteinCount: function() {
      return this.objectCounts[8];
    }

  }, {// Statics
    DefaultTranscriptionFactorCount: DEFAULT_TRANSCRIPTION_FACTOR_COUNT,
    DefaultProteinDegradationRate: DEFAULT_PROTEIN_DEGRADATION_RATE,
    DefaultTFAssociationProbability: DEFAULT_TF_ASSOCIATION_PROBABILITY,
    DefaultPolymeraseAssociationProbability: DEFAULT_POLYMERASE_ASSOCIATION_PROBABILITY,
    DefaultMRNADegradationRate: DEFAULT_MRNA_DEGRADATION_RATE,
    MRNADegradationRateRange: MRNA_DEGRADATION_RATE_RANGE,
    PolymeraseAssociationProbabilityRange: POLYMERASE_ASSOCIATION_PROBABILITY_RANGE,
    ProteinDegradationRange: PROTEIN_DEGRADATION_RANGE,
    TFAssociationProbabilityRange: TF_ASSOCIATION_PROBABILITY_RANGE,
    TranscriptionFactorCountRange: TRANSCRIPTION_FACTOR_COUNT_RANGE
  } );
} );