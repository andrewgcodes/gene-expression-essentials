// Copyright 2015-2019, University of Colorado Boulder

/**
 * One of the states for MessengerRnaAttachmentStateMachine
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/AttachmentState' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Vector2 = require( 'DOT/Vector2' );
  const WanderInGeneralDirectionMotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/WanderInGeneralDirectionMotionStrategy' );

  // constants
  const PRE_FADE_TIME = 5;
  const FADE_OUT_TIME = 2;

  /**
   * @param {MessengerRnaAttachmentStateMachine} messengerRnaAttachmentStateMachine
   * @constructor
   */
  function UnattachedAndFadingState( messengerRnaAttachmentStateMachine ) {
    this.messengerRnaAttachmentStateMachine = messengerRnaAttachmentStateMachine; //@public
    this.preFadeCountdown = PRE_FADE_TIME; //@private
  }

  geneExpressionEssentials.register( 'UnattachedAndFadingState', UnattachedAndFadingState );

  return inherit( AttachmentState, UnattachedAndFadingState, {

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     * @param {number} dt
     * @public
     */
    step: function( asm, dt ) {
      if ( this.preFadeCountdown > 0 ) {
        this.preFadeCountdown -= dt;
      }
      else {
        const biomolecule = this.messengerRnaAttachmentStateMachine.biomolecule;
        biomolecule.existenceStrengthProperty.set( Math.max( biomolecule.existenceStrengthProperty.get() - dt / FADE_OUT_TIME, 0 ) );
      }
    },

    /**
     * @override
     * @param {AttachmentStateMachine}  asm
     * @public
     */
    entered: function( asm ) {
      // State checking - should be at full strength.
      assert && assert( this.messengerRnaAttachmentStateMachine.biomolecule.existenceStrengthProperty.get() === 1 );
      this.preFadeCountdown = PRE_FADE_TIME;

      // Move upwards, away from the DNA and polymerase.
      asm.biomolecule.setMotionStrategy( new WanderInGeneralDirectionMotionStrategy( new Vector2( 0, 0.75 ),
        asm.biomolecule.motionBoundsProperty ) );
    }
  } );
} );
