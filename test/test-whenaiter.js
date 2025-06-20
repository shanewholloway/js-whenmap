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
    expect(aiter.size).to.equal(0)
  })


  it('from one value', async () => {
    let aiter = WhenAiter.from(['single'])
    expect( await Array.fromAsync(aiter) ).to.deep.equal(['single'])
  })

  it('from one promise', async () => {
    let aiter = WhenAiter.from([Promise.resolve('one promise')])
    expect( await Array.fromAsync(aiter) ).to.deep.equal(['one promise'])
  })

  it('from list with a rejected', async () => {
    let err_res = []
    let aiter = WhenAiter.from(
      [
        Promise.reject('some mock error'),
        Promise.resolve('working'),
      ],
      { on_error(e) { err_res.push(e) },
      })
    expect( await Array.fromAsync(aiter) ).to.deep.equal(['working'])
    expect( err_res ).to.deep.equal(['some mock error'])
  })

  it('from list of mixed promises', async () => {
    let first = Promise.withResolvers()
    let middle = Promise.withResolvers()
    let last = Promise.withResolvers()
    let aiter = WhenAiter.from([
      'start',
      first.promise,
      middle.promise,
      last.promise,
      'end',
    ])

    await middle.resolve('middle promise')
    await last.resolve('last promise')
    await first.resolve('first promise')

    let outcome = [
      'start', 'end',
      'middle promise',
      'last promise',
      'first promise',
    ]

    expect( await Array.fromAsync(aiter) ).to.deep.equal( outcome)
  })


  it('from function', async () => {
    let v=1
    let aiter = new WhenAiter(send => {
      let tid = setInterval(
        () => {
          let arg = `step ${v++}`
          send(arg)
          if (v >= 10) {
            clearInterval(tid)
            send.stop()
          }
        }, 1)
    })
    let res_array = Array.fromAsync(aiter)


    expect( await res_array ).to.deep.equal([
      'step 1', 'step 2', 'step 3',
      'step 4', 'step 5', 'step 6',
      'step 7', 'step 8', 'step 9', ])
  })


  it('with event target', async () => {
    let v=1
    let evt_tgt = new EventTarget()
    let aiter = new WhenAiter(send => {
      expect(send.signal.aborted).to.equal(false)
      evt_tgt.addEventListener('some_event',
        evt => send(evt.detail),
        {signal: send.signal})
    })
    let res_array = Array.fromAsync(aiter)

    let tid = setInterval(
      () => {
        evt_tgt.dispatchEvent(
          new CustomEvent('some_event',
            {detail: `step ${v++}`}))
      }, 1)
    setTimeout(aiter.return, 20)

    res_array = await res_array
    expect( res_array.slice(0,5) ).to.deep.equal([
      'step 1', 'step 2', 'step 3', 'step 4', 'step 5' ])

    clearInterval(tid)
  })
})

