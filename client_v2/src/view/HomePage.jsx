import React from 'react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <div className="p-8">
        <div className="mb-8 p-6 rounded border border-gray-200 bg-blue-100">
          <h2 className="font-bold text-2xl mb-4">Kanji</h2>
          <ul>
            <li className="mb-2"><Link to="/kanji/recognise" className="text-blue-700 hover:text-blue-900">Recognise</Link></li>
            <li className="mb-2"><Link to="/kanji/recall" className="text-blue-700 hover:text-blue-900">Recall</Link></li>
            <li className="mb-2"><Link to="/kanji/writeout" className="text-blue-700 hover:text-blue-900">Writeout</Link></li>
            <li className="mb-2"><Link to="/keyboard" className="text-blue-700 hover:text-blue-900">keyboard</Link></li>
          </ul>
        </div>
        
        <div className="mb-8 p-6 rounded border border-gray-200 bg-green-100">
          <h2 className="font-bold text-2xl mb-4">Kana</h2>
          <ul>
            <li className="mb-2"><Link to="/kana/recognise" className="text-green-700 hover:text-green-900">Recognise</Link></li>
            <li className="mb-2"><Link to="/kana/recall" className="text-green-700 hover:text-green-900">Recall</Link></li>
            <li className="mb-2"><Link to="/kana/writeout" className="text-green-700 hover:text-green-900">Writeout</Link></li>
          </ul>
        </div>

        <div className="mb-8 p-6 rounded border border-gray-200 bg-yellow-100">
          <h2 className="font-bold text-2xl mb-4">Vocabulary</h2>
          <ul>
            <li className="mb-2"><Link to="/vocabulary/recognise" className="text-yellow-700 hover:text-yellow-900">Recognise</Link></li>
            <li className="mb-2"><Link to="/vocabulary/recall" className="text-yellow-700 hover:text-yellow-900">Recall</Link></li>
            <li className="mb-2"><Link to="/vocabulary/writeout" className="text-yellow-700 hover:text-yellow-900">Writeout</Link></li>
          </ul>
        </div>

        <div className="mb-8 p-6 rounded border border-gray-200 bg-red-100">
          <h2 className="font-bold text-2xl mb-4">Sentences</h2>
          <ul>
            <li className="mb-2"><Link to="/sentence/fill-blank" className="text-red-700 hover:text-red-900">Fill in the Blank</Link></li>
            <li className="mb-2"><Link to="/sentence/select-kanji" className="text-red-700 hover:text-red-900">Select Correct Kanji</Link></li>
            <li className="mb-2"><Link to="/sentence/select-reading" className="text-red-700 hover:text-red-900">Select Correct Reading</Link></li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
