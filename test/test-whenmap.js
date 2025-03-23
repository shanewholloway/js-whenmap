import {describe, it} from '#test_bdd'
import {assert, expect} from 'chai'

import {whenmap} from '../esm/index.js' // 'whenmap'

describe('whenmap', () => {
  it('shape', () => {
    expect(whenmap).to.be.a('function')
  })

  it('shape Map-like api', () => {
    let when_db = whenmap()
    expect(when_db.has).to.be.a('function')
    expect(when_db.get).to.be.a('function')
    expect(when_db.set).to.be.a('function')
    expect(when_db.delete).to.be.a('function')
    expect(when_db.clear).to.be.a('function')

    expect(when_db.keys).to.be.a('function')
    expect(when_db.values).to.be.a('function')
    expect(when_db.entries).to.be.a('function')
    expect(when_db[Symbol.iterator]).to.be.a('function')
  })

  it('shape whenmap api', () => {
    let when_db = whenmap()
    expect(when_db.when).to.be.a('function')
    expect(when_db.set_when).to.be.a('function')
    expect(when_db.subscribe).to.be.a('function')

    expect(when_db.value_stream_at).to.be.a('function')
    expect(when_db.entry_stream_at).to.be.a('function')
    expect(when_db.subscribe_at).to.be.a('function')
  })
})

