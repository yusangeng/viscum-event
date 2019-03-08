# @viscum/event

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/@viscum/event.svg?branch=master)](https://travis-ci.org/yusangeng/@viscum/event) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/@viscum/event/badge.svg?branch=master)](https://coveralls.io/github/yusangeng/@viscum/event?branch=master) [![Npm Package Info](https://badge.fury.io/js/@viscum/event.svg)](https://www.npmjs.com/package/@viscum/event) [![Downloads](https://img.shields.io/npm/dw/@viscum/event.svg?style=flat)](https://www.npmjs.com/package/@viscum/event)

## 综述 | Abstract

Typescript event emitter.

使用typescript实现的事件收发机制.

## 安装 | Install

``` bash
npm install @viscum/event --save
```

## 使用 | Usage

Global emitter & handlers.

``` ts
import { Event, on, emit } from '@viscum/event'

// Define event class
class FoobarEvent extends Event('foobar') {
  foo: string = 'foo'
  bar: string = 'bar'
}

// Add handler.
const off = on(FoobarEvent, (evt: FoobarEvent, from?: Emitter) => {
  console.log(`${evt.foo} - ${evt.bar} - ${from ? from.name : 'nobody'}`)
})

class Emitter { name: 'emitter' }
const emitter = new Emitter()

// Emit event.
emit(new FoobarEvent) //=> print 'foo - bar - nobody'

// Emit event from an emitter.
emit(new FoobarEvent, emitter) //=> print 'foo - bar - emitter'

// Remove handler.
off()
```

HasEventEmitter mixin.

``` ts
import mix from 'mix-with'
import { HasEventEmitter } from 'mix-with'

class MyEvent extends Event('my') {}

class Base {}

class Foobar extends mix(Base).with(HasEventEmitter) {
  name: string = 'foobar'

  action () : void {
    // Emit event from this.
    this.emit(new MyEvent())
  }
}

const foobar = new Foobar()

// Add handler.
on(MyEvent, (evt: MyEvent, from: Foobar) => {
  console.log(from.name)
})

foobar.action() //=> print 'foobar'
```
