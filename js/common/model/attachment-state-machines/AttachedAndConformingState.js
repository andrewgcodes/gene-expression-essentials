// Copyright 2015-2019, University of Colorado Boulder

/**
 * One of the states for RnaPolymeraseAttachmentStateMachine. RnaPolymerase enters this state when it is attached to DNA
 * and ready to conform
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {RnaPolymeraseAttachmentStateMachine} rnaPolymeraseAttachmentStateMachine
   * @constructor
   */
  function AttachedAndConformingState( rnaPolymeraseAttachmentStateMachine ) {
    AttachmentState.call( this );

    // @public (read-ony) {RnaPolymeraseAttachmentStateMachine}
    this.rnaPolymeraseAttachmentStateMachine = rnaPolymeraseAttachmentStateMachine;

    // @private
    this.conformationalChangeAmount = 0;
  }

  geneExpressionEssentials.register( 'AttachedAndConformingState', AttachedAndConformingState );

  return inherit( AttachmentState, AttachedAndConformingState, {

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt - delta time
     * @public
     */
    step: function( asm, dt ) {

      const biomolecule = this.rnaPolymeraseAttachmentStateMachine.biomolecule;
      const dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;
      const attachedAndTranscribingState = this.rnaPolymeraseAttachmentStateMachine.attachedAndTranscribingState;

      // Verify that state is consistent.
      assert && assert( asm.attachmentSite !== null );
      assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === biomolecule );

      this.conformationalChangeAmount = Math.min( this.conformationalChangeAmount +
                                                  GEEConstants.CONFORMATIONAL_CHANGE_RATE * dt, 1 );
      biomolecule.changeConformation( this.conformationalChangeAmount );
      dnaStrandSeparation.setProportionOfTargetAmount( this.conformationalChangeAmount );
      if ( this.conformationalChangeAmount === 1 ) {
        // Conformational change complete, time to start actual transcription.
        this.rnaPolymeraseAttachmentStateMachine.attachedState = attachedAndTranscribingState;
        this.rnaPolymeraseAttachmentStateMachine.setState( this.rnaPolymeraseAttachmentStateMachine.attachedState );
      }
    },

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @public
     */
    entered: function( asm ) {
      const rnaPolymerase = this.rnaPolymeraseAttachmentStateMachine.rnaPolymerase;
      const dnaStrandSeparation = this.rnaPolymeraseAttachmentStateMachine.dnaStrandSeparation;

      // Prevent user interaction.
      asm.biomolecule.movableByUserProperty.set( false );

      // Insert the DNA strand separator.
      dnaStrandSeparation.setXPosition( rnaPolymerase.getPosition().x );
      rnaPolymerase.getModel().getDnaMolecule().addSeparation( dnaStrandSeparation );
      this.conformationalChangeAmount = 0;
    }
  } );
} );


