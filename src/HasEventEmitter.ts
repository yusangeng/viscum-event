/**
 * 事件支持mixin
 * 
 * @author Y3G
 */

import { Ctor } from 'mix-with'
import { EventBase, emit } from './EventBus'

export const HasEventEmitter = <T extends Ctor> (superclass: T) => class extends superclass {
  emit<ConcreteEvent extends EventBase> (event: ConcreteEvent) : void {
    emit(event, this)
  }
}