import React from 'react';
import KanjiCardRecognise from '../components/KanjiCardRecognise';
import { useState } from 'react';
import { kanjiCards } from '../data/mockdata';
import Modal from '../components/Modal';
import HoverPopover from '../components/HoverPopover';
import SpeedDial from '../components/SpeedDial';

const KanjiLearningSession = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % kanjiCards.length);
    };

    return (
        <div className="p-6 bg-blue-100">
            <SpeedDial/>
            <KanjiCardRecognise 
                cardData={kanjiCards[currentCardIndex]} 
                handleNextCard={handleNextCard}
            />
            <button onClick={() => setShowModal(true)} class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Toggle modal
            </button>
            <Modal setShowModal={setShowModal} showModal={showModal} />
            <HoverPopover/>
        </div>
    );
};

export default KanjiLearningSession;

/*
                <div className="text-center w-56">
                <div className="mx-auto my-4 w-48">
                    <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                    <p className="text-sm text-gray-500">
                    Are you sure you want to delete this item?
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-danger w-full">Delete</button>
                    <button
                    className="btn btn-light w-full"
                    onClick={() => setOpen(false)}
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </Modalx>
*/
