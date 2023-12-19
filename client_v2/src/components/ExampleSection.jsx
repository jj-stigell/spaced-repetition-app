const ExampleSection = ({ examples }) => {
  return (
      <div>
          {examples.map((example, index) => (
              <div key={index} className="mb-2">
                  <div>{example.word}</div>
                  <div>{example.sentence}</div>
              </div>
          ))}
      </div>
  );
};

export default ExampleSection;
