import { DingDingBot as DummyClass } from '../src/dingdingbot'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new DummyClass('null', 'null')).toBeInstanceOf(DummyClass)
  })
})
