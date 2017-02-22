// Copyright 2015, University of Colorado Boulder
/**
 /**
 * Class that defines what the mRNA destroyer does when attached to mRNA.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  var Range = require( 'DOT/Range' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var MessengerRnaFragment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MessengerRnaFragment' );
  var DestroyerTrackingRnaMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/DestroyerTrackingRnaMotionStrategy' );

  // constants

  // Scalar velocity for transcription.
  var RNA_DESTRUCTION_RATE = 750; // Picometers per second.

  // Range of lengths for mRNA fragments.
  var MRNA_FRAGMENT_LENGTH_RANGE = new Range( 100, 400 ); // In picometers.

  /**
   *
   * @param {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
   * @constructor
   */
  function MRnaDestroyerAttachedState(rnaDestroyerAttachmentStateMachine){
    AttachmentState.call(this);
    this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
    this.messengerRnaFragment = null;
    this.targetFragmentLength = 0;
  }

  geneExpressionEssentials.register( 'MRnaDestroyerAttachedState', MRnaDestroyerAttachedState );

  return inherit(AttachmentState,MRnaDestroyerAttachedState,{
    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     */
    stepInTime: function( asm, dt ) {
      var biomolecule = this.rnaDestroyerAttachmentStateMachine.biomolecule;

      // Verify that state is consistent.
      assert && assert( asm.attachmentSite !== null );
      assert && assert( asm.attachmentSite.attachedOrAttachingMoleculeProperty.get() === biomolecule );

      // Grow the mRNA fragment, release it if it is time to do so.
      if ( this.messengerRnaFragment === null ) {
        this.messengerRnaFragment = new MessengerRnaFragment( biomolecule.getModel(), biomolecule.getPosition() );
        this.messengerRnaFragment.movableByUserProperty.set(false);
        biomolecule.getModel().addMobileBiomolecule( this.messengerRnaFragment );
        this.targetFragmentLength = MRNA_FRAGMENT_LENGTH_RANGE.min +
                                    phet.joist.random.nextDouble() * MRNA_FRAGMENT_LENGTH_RANGE.getLength();
      }
      this.messengerRnaFragment.addLength( RNA_DESTRUCTION_RATE * dt );
      if ( this.messengerRnaFragment.getLength() >= this.targetFragmentLength ) {

        // Time to release this fragment.
        this.messengerRnaFragment.releaseFromDestroyer();
        this.messengerRnaFragment = null;
      }

      // Advance the destruction of the mRNA.
      var destructionComplete = this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer
        .advanceMessengerRnaDestruction( RNA_DESTRUCTION_RATE * dt );
      if ( destructionComplete ) {

        // Detach the current mRNA fragment.
        if ( this.messengerRnaFragment !== null ) {
          this.messengerRnaFragment.releaseFromDestroyer();
          this.messengerRnaFragment = null;
        }

        // Remove the messenger RNA that is now destroyed from the model. There should be no visual representation left
        // to it at this point.
        biomolecule.getModel().removeMessengerRna(
          this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer.getMessengerRnaBeingDestroyed() );
        this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer.clearMessengerRnaBeingDestroyed();

        // Release this destroyer to wander in the cytoplasm.
        asm.detach();
      }
    },

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      var mRnaDestroyer = this.rnaDestroyerAttachmentStateMachine.mRnaDestroyer;
      mRnaDestroyer.initiateMessengerRnaDestruction();
      mRnaDestroyer.setMotionStrategy( new DestroyerTrackingRnaMotionStrategy( mRnaDestroyer ) );

      // Turn off user interaction while mRNA is being destroyed.
      asm.biomolecule.movableByUserProperty.set( false );
    }

  });

});