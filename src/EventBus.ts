/**
 * 事件总线
 *
 * @author Y3G
 */

import { Ctor } from 'mix-with'

const { keys } = Object
let currentId = Number.MIN_SAFE_INTEGER

type FOff = () => void

export class EventBase {
  readonly type: symbol
  readonly id: number
  readonly timestamp: number

  constructor (type: string | symbol) {
    if (typeof type === 'string') {
      this.type = Symbol(type)
    } else {
      this.type = type
    }
    
    this.id = currentId++
    this.timestamp = Date.now()
  }
}

const eventTypeMap: {
  [x: string]: boolean
} = {}

export function Event (type: string) {
  if (eventTypeMap[type]) {
    throw new Error(`Duplicate event type name: ${type}.`)
  }

  eventTypeMap[type] = true

  const typeSymbol = Symbol(type)

  return class Event extends EventBase {
    static readonly type = typeSymbol
    static readonly typeString = type

    constructor() {
      super(typeSymbol)
    }
  }
}

export type FCallback<E, F> = (evt: E, from?: F) => void

export class EventBus {
  handlers: any = {}

  clear () {
    this.handlers = {}
  }

  emit<From> (evt: EventBase, from?: From) : void {
    const { type } = evt
    const callbacks = this.handlers[type]

    if (!callbacks) {
      return
    }

    keys(callbacks).forEach(id => {
      const cb = callbacks[id]
      cb(evt, from)
    })
  }

  on<EventClass extends Ctor<EventBase>, From> (eventClass: EventClass,
    callback: FCallback<InstanceType<EventClass>, From>) : FOff {
    const { type } = eventClass as any
    const callbacks = this.handlers[type] || (this.handlers[type] = {})
    const id = currentId++

    callbacks[id] = callback

    return () => delete this.handlers[type][id]
  }
}

export default EventBus

export const globalEventBus  = new EventBus()

export function on <EventClass extends Ctor<EventBase>, From> (eventClass: EventClass,
  callback: FCallback<InstanceType<EventClass>, From>) : FOff {
    return globalEventBus.on(eventClass, callback)
}

export function emit<From> (event: EventBase, from?: From) : void {
  globalEventBus.emit(event, from)
}