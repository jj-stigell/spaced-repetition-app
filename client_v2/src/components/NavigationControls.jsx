const NavigationControls = ({ onNext, onPrevious }) => {
  return (
      <div className="flex justify-between">
          <button onClick={onPrevious} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
          <button onClick={onNext} className="bg-gray-300 px-4 py-2 rounded">Next</button>
      </div>
  );
};

export default NavigationControls;
