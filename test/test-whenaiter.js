import {describe, it} from '#test_bdd'
import {expect} from 'chai'

import {WhenAiter} from 'whenmap'

describe('WhenAiter', () => {
  it('shape', () => {
    expect(WhenAiter).to.be.a('function')
    expect(WhenAiter.from).to.be.a('function')

    let aiter = new WhenAiter()
    expect(aiter[Symbol.asyncIterator]).to.be.a('function')
    expect(aiter[Symbol.asyncIterator]()).to.be.equal(aiter)

    expect(aiter.next).to.be.a('function')
    expect(aiter.throw).to.be.a('function')
    expect(aiter.return).to.be.a('function')

    expect(aiter.send).to.be.a('function')
    expect(aiter.when).to.be.a('function')
  })


  it('from list of mixed promises', async () => {
    let control = Array.from({length:3}, () => Promise.withResolvers())
    let mock = ['start', ... control.map(e => e.promise), 'end']
    let aiter = WhenAiter.from(mock)
    await control[1].resolve('middle promise')
    await control[2].resolve('last promise')
    await control[0].resolve('first promise')

    let outcome = [
      'start', 'end',
      'middle promise',
      'last promise',
      'first promise',
    ]

    expect( await Array.fromAsync(aiter) ).to.deep.equal( outcome)
  })
})

