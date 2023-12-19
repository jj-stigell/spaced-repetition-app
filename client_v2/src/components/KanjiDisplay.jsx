const KanjiDisplay = ({ kanji }) => {
  return (
      <div className="text-center">
          <div className="text-6xl mb-4">{kanji.character}</div>
          {/* Stroke order animation would be implemented here */}
      </div>
  );
};

export default KanjiDisplay;
