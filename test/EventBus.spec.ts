/* global describe it */
import chai from 'chai'
import { Event, emit, on } from '../src/EventBus'

chai.should()

class XEvent extends Event('x') {
  x: string = 'xxx'
}

class YEvent extends Event('y') {
  y: string = 'yyy'
}

class Emitter {
  name: string = 'emitter'
}

const emitter = new Emitter()

describe('EventBus', () => {
  it('events should be handled', async () => {
    let str = ''

    on(XEvent, (evt: XEvent) => {
      str += evt.x
    })

    on(YEvent, (evt: YEvent, from?: Emitter) => {
      if (from) {
        str += evt.y + from.name
      }
    })

    emit(new XEvent())
    emit(new YEvent(), emitter)

    str.should.be.eq('xxxyyyemitter')
  })
})
