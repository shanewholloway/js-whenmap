import {describe, it} from '#test_bdd'
import {expect} from 'chai'

import {whenstream, whenmap_watch} from '../esm/observe_when.js'

describe('whenstream', () => {
  it('shape', () => {
    expect(whenstream).to.be.a('function')
    expect(whenmap_watch).to.be.a('function')
  })
})


