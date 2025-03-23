import {describe, it} from '#test_bdd'
import {expect} from 'chai'

import {whencall, whencall_first, whencall_stream} from '../esm/observe_when.js'
import {as_whenmap_proxy} from '../esm/whenmap_proxy.js'

describe('whencall', () => {
  it('shape', () => {
    expect(whencall).to.be.a('function')
    expect(whencall_first).to.be.a('function')
    expect(whencall_stream).to.be.a('function')
    expect(as_whenmap_proxy).to.be.a('function')
  })
})

