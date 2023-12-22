/*
import { groupFurigana } from './Furigana'

describe('groupFurigana', () => {
  it('groups single character with its furigana', () => {
    expect(groupFurigana('行', '1:こう')).toEqual([['行', 'こう']])
  })

  it('handles multiple characters with furigana', () => {
    expect(groupFurigana('今日は', '1-2:きょう')).toEqual([['今日', 'きょう'], ['は']])
  })

  it('mixes characters with and without furigana', () => {
    expect(groupFurigana('今日は晴れ', '1-2:きょう')).toEqual([['今日', 'きょう'], ['は'], ['晴'], ['れ']])
  })

  it('handles no furigana case', () => {
    expect(groupFurigana('ありがとう', '')).toEqual([['あ'], ['り'], ['が'], ['と'], ['う']])
  })

  it('groups multiple characters under one furigana', () => {
    expect(groupFurigana('富士山', '1-3:ふじさん')).toEqual([['富士山', 'ふじさん']])
  })

  it('handles empty strings', () => {
    expect(groupFurigana('', '')).toEqual([])
  })

  it('handles furigana index beyond word length', () => {
    // expect(groupFurigana('山', '2:さん')).toEqual([['山']])
  })

  it('handles consecutive furigana ranges', () => {
    expect(groupFurigana('東京都', '1-2:とうきょう;3:と')).toEqual([['東京', 'とうきょう'], ['都', 'と']])
  })

  it('handles gaps between furigana', () => {
    expect(groupFurigana('昨日は晴れた', '1-2:きのう;4:は')).toEqual([['昨日', 'きのう'], ['は'], ['晴', 'は'], ['れ'], ['た']])
  })

  it('handles overlapping furigana ranges', () => {
    // expect(groupFurigana('学校', '1-2:がっこう;2:こう')).toEqual([['学校', 'がっこう']])
  })

  it('ignores incorrectly formatted furigana', () => {
    // expect(groupFurigana('学校', '1がっこう')).toEqual([['学'], ['校']])
  })

  it('applies furigana to non-kanji characters', () => {
    expect(groupFurigana('あいうえお', '3:い')).toEqual([['あ'], ['い'], ['う', 'い'], ['え'], ['お']])
  })

  it('handles special characters in the sentence', () => {
    expect(groupFurigana('こんにちは!', '1-5:こんにちは')).toEqual([['こんにちは', 'こんにちは'], ['!']])
  })

  it('handles reverse index range', () => {
    // expect(groupFurigana('学校', '2-1:がっこう')).toEqual([['学校', 'がっこう']])
  })

  it('handles non-sequential furigana', () => {
    // expect(groupFurigana('学校', '1:がく;3:こう')).toEqual([['学', 'がく'], ['校', 'こう']])
  })

  it('handles repeated characters with different furigana', () => {
    expect(groupFurigana('行行行', '1:い;2:ぎょう;3:こう')).toEqual([['行', 'い'], ['行', 'ぎょう'], ['行', 'こう']])
  })

  it('handles furigana index exceeding sentence length', () => {
    expect(groupFurigana('学校', '1-3:がっこう')).toEqual([['学校', 'がっこう']])
  })
})
*/
