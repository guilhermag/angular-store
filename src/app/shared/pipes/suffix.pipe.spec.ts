import { SuffixPipe } from './suffix.pipe';

describe('SuffixPipe', () => {
  const pipe = new SuffixPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform total column', () => {
    expect(pipe.transform('32.00', 'total')).toEqual('R$ 32.00');
  });
  it('should transform status column', () => {
    expect(pipe.transform('true', 'status')).toEqual('Fechado');
    expect(pipe.transform('false', 'status')).toEqual('Aberto');
  });
  it('should transform others column', () => {
    expect(pipe.transform('100', 'id')).toEqual('100');
  });
});
