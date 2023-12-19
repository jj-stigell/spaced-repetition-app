import React, { useState, useEffect } from 'react';
import Furigana from './proto/Furigana';
import AudioPlayer from './proto/AudioPlayer';

const KanjiCardRecognise = ({ cardData, handleNextCard }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showBackCard, setShowBackCard] = useState(false);

    useEffect(() => {
        // Reset state when cardData changes
        setSelectedAnswers([]);
        setShowBackCard(false);
    }, [cardData]);

    const handleAnswerSelect = (option) => {
        setSelectedAnswers(prev => [...prev, option]);
        if (option.correct) {
            setShowBackCard(true);
        }
    };

    const getButtonClasses = (option) => {
        const isSelected = selectedAnswers.includes(option);
        if (isSelected) {
            return option.correct ? 'bg-green-200' : 'bg-gray-200';
        }
        return 'bg-white';
    };

    return (
        <div className="p-4 border rounded bg-white">
            <div className="text-center text-8xl my-12">{cardData.kanji}</div>
            <div className="grid grid-cols-2 gap-4">
                {cardData.answerOptions.map((option, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleAnswerSelect(option)}
                        className={`p-2 border rounded ${getButtonClasses(option)}`}
                        disabled={showBackCard}
                    >
                        {option.option}
                    </button>
                ))}
            </div>

            {showBackCard && (
            <>
                <button onClick={handleNextCard} className="bg-blue-500 mt-4 text-white px-4 py-2 w-3/4 rounded">Next Card</button>

                <div className="mt-4 space-y-4">
                    <div className="p-4 rounded bg-blue-100">
                        <div className="font-bold">Kanji data:</div>
                        <div>On'yomi: {cardData.onyomi} ({cardData.onyomiRomaji})</div>
                        <div>Kun'yomi: {cardData.kunyomi} ({cardData.kunyomiRomaji})</div>
                        <div>JLPT Level: N{cardData.jlptLevel}</div>
                    </div>

                    <div className="p-4 rounded bg-green-100">
                        <div className="font-bold mb-4">Example Sentences:</div>
                        {cardData.sentences.length !== 0 && cardData.sentences.map((sentence, index, array) => (
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
                        {cardData.words.length !== 0 && cardData.words.map((word, index, array) => (
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
            )}
        </div>
    );
};

export default KanjiCardRecognise;
