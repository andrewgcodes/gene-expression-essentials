// Copyright 2015, University of Colorado Boulder

/**
 *  Use generic state except that interaction is turned off.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericMovingTowardsAttachmentState' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @constructor
   * @param  {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
   */
  function MRnaDestroyerMovingTowardAttachmentState( rnaDestroyerAttachmentStateMachine ) {
    GenericMovingTowardsAttachmentState.call( this, rnaDestroyerAttachmentStateMachine );
    this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
  }

  geneExpressionEssentials.register( 'MRnaDestroyerMovingTowardAttachmentState', MRnaDestroyerMovingTowardAttachmentState );

  return inherit( GenericMovingTowardsAttachmentState, MRnaDestroyerMovingTowardAttachmentState, {

    /**
     * @override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      GenericMovingTowardsAttachmentState.prototype.entered.call( this, asm );
      asm.biomolecule.movableByUserProperty.set( false );
    }
  } );
} );