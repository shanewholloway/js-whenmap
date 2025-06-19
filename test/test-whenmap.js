import {describe, it} from '#test_bdd'
import {expect} from 'chai'

import {WhenMap} from 'whenmap'

describe('WhenMap', () => {
  it('shape', () => {
    expect(WhenMap).to.be.a('function')

    let when_db = new WhenMap()
    expect(when_db.has).to.be.a('function')
    expect(when_db.get).to.be.a('function')
    expect(when_db.set).to.be.a('function')
    expect(when_db.delete).to.be.a('function')
    expect(when_db.clear).to.be.a('function')

    expect(when_db.keys).to.be.a('function')
    expect(when_db.values).to.be.a('function')
    expect(when_db.entries).to.be.a('function')
    expect(when_db[Symbol.iterator]).to.be.a('function')

    expect(when_db.when).to.be.a('function')
    expect(when_db.when).to.equal(when_db.get)
  })

  it('has returns false for untracked keys', () => {
    let when_db = new WhenMap()

    expect(when_db.has('test_item')).to.be.false
    expect(when_db.has('test_item')).to.be.false
  })

  it('has returns true for resolved tracked keys', () => {
    let when_db = new WhenMap()

    expect(when_db.has('test_item')).to.be.false
    when_db.set('test_item', 42)
    expect(when_db.has('test_item')).to.be.true
  })

  it('has returns 1 for unresolved tracked keys', () => {
    let when_db = new WhenMap()

    expect(when_db.has('test_item')).to.be.false

    let p = when_db.get('test_item')
    expect(p).to.be.a('promise')

    expect(when_db.has('test_item')).to.equal(1)
  })

  it('when() before set() usecase', async () => {
    let when_db = new WhenMap()

    expect(when_db.has('test_item')).to.be.false

    let p = when_db.when('test_item')
    expect(p).to.be.a('promise')
    expect(when_db.has('test_item')).to.equal(1)

    let v = Symbol('test_answer')
    let self = when_db.set('test_item', v)
    expect(self).to.equal(when_db)

    expect(when_db.has('test_item')).to.true
    expect(await p).to.equal(v)
  })

  it('set() before when() usecase', async () => {
    let when_db = new WhenMap()

    expect(when_db.has('test_item')).to.be.false

    let v = Symbol('test_answer')
    let self = when_db.set('test_item', v)
    expect(self).to.equal(when_db)

    expect(when_db.has('test_item')).to.true

    let p = when_db.when('test_item')
    expect(p).to.be.a('promise')
    expect(await p).to.equal(v)
  })

  it('when() identity', async () => {
    let when_db = new WhenMap()
    let p0 = when_db.when('test_item')
    let p1 = when_db.when('test_item')
    let p2 = when_db.get('test_item')

    when_db.set('test_item', 2142)
    let p3 = when_db.when('test_item')
    let p4 = when_db.get('test_item')

    expect(p0 === p1).to.be.true
    expect(p0 === p2).to.be.true
    expect(p0 === p3).to.be.true
    expect(p0 === p4).to.be.true
  })

  it('delete returns false for untracked keys', () => {
    let when_db = new WhenMap()

    let r = when_db.delete('test_item')
    expect(r).to.equal(false)
  })

  it('delete returns true for resolved tracked keys', () => {
    let when_db = new WhenMap()

    when_db.set('test_item', 42)
    let r = when_db.delete('test_item')
    expect(r).to.equal(true)
  })

  it('delete returns true for unresolved tracked keys', async () => {
    let when_db = new WhenMap()

    expect(when_db.has('test_item')).to.be.false

    let p = when_db.when('test_item')
    expect(p).to.be.a('promise')
    expect(when_db.has('test_item')).to.equal(1)

    let r = when_db.delete('test_item')
    expect(r).to.equal(true)

    expect(when_db.has('test_item')).to.false
    expect(await p).to.be.undefined
  })

  it('clear resolves outstanding tracked keys', async () => {
    let when_db = new WhenMap()

    let p_a = when_db.when('a')
    expect(p_a).to.be.a('promise')

    let bv = {'BBB': 1942}
    when_db.set('b', bv)
    let p_b = when_db.when('b')
    expect(p_b).to.be.a('promise')
    expect(await p_b).to.equal(bv)

    let p_c = when_db.when('c')
    expect(p_c).to.be.a('promise')

    let r = when_db.clear()
    expect(r).to.be.undefined

    expect(await p_a).to.be.undefined
    expect(await p_b).to.equal(bv)
    expect(await p_c).to.be.undefined
  })
})
