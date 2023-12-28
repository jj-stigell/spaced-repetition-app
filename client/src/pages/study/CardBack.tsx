import React from 'react'

export default function CardBack ({ data, handleNextCard }: any): React.JSX.Element {
  return (
    <>
        <button onClick={handleNextCard} className="bg-blue-500 mt-4 text-white px-4 py-2 w-3/4 rounded">Next Card</button>
    </>
  )
};

/*
    return (
      <>
        <button onClick={handleNextCard} className="bg-blue-500 mt-4 text-white px-4 py-2 w-3/4 rounded">Next Card</button>

        <div className="mt-4 space-y-4">
            <div className="p-4 rounded bg-blue-100">
                <div className="font-bold">Kanji data:</div>
                <div>On'yomi: {data.onyomi} ({data.onyomiRomaji})</div>
                <div>Kun'yomi: {data.kunyomi} ({data.kunyomiRomaji})</div>
                <div>JLPT Level: N{data.jlptLevel}</div>
            </div>

            <div className="p-4 rounded bg-green-100">
                <div className="font-bold mb-4">Example Sentences:</div>
                {data.sentences.length !== 0 && data.sentences.map((sentence, index, array) => (
                    <div key={index} className={`mb-2 grid grid-cols-[50%_50%] ${index < array.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}>
                        <div>
                            <Furigana sentence={sentence.text} reading={sentence.furigana} />
                            <div className="mt-4 text-lg">{sentence.translation}</div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center mb-2">
                                <div className="text-sm font-medium mr-2">Takeshi</div>
                                <AudioPlayer audioUrl={sentence.audioMan} />
                            </div>
                            <div className="flex items-center">
                                <div className="text-sm font-medium mr-2">Hanako</div>
                                <AudioPlayer audioUrl={sentence.audioWoman} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 rounded bg-yellow-100">
                <div className="font-bold mb-4">Example Words:</div>
                {data.words.length !== 0 && data.words.map((word, index, array) => (
                    <div key={index} className={`mb-2 grid grid-cols-[50%_50%] ${index < array.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}>
                        <div>
                            <Furigana sentence={word.text} reading={word.furigana} />
                            <div className="mt-4 text-lg">{word.translation}</div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center mb-2">
                                <div className="text-sm font-medium mr-2">Takeshi</div>
                                <AudioPlayer audioUrl={word.audioMan} />
                            </div>
                            <div className="flex items-center">
                                <div className="text-sm font-medium mr-2">Hanako</div>
                                <AudioPlayer audioUrl={word.audioWoman} />
                            </div>
                        </div>
                    </div>
                ))}
              </div>
          </div>
        </>
    );
*/
