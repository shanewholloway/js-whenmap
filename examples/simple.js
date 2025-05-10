import { WhenMap } from 'whenmap'

let whenmap = new WhenMap()

let p_example = whenmap.when('example_key')
console.log('p_example', p_example)

p_example.then(v_example => {
  console.log('Ready!', v_example, p_example)
})

whenmap.set('example_key', example_init())

async function example_init() {
  // async initialize process
  console.log('example_init')
  await new Promise(f => setTimeout(f))
  return {example: 42}
}

console.log('end simple.js')
