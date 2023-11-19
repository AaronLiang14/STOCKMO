function OtherMessage(message: string, index: number) {
  return (
    <div className="mb-2" key={index}>
      <p className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700">
        {message}
      </p>
    </div>
  );
}

function MyMessage(message: string, index: number) {
  return (
    <div className="mb-2 text-right" key={index}>
      <p className="inline-block rounded-lg bg-cyan-800 px-4 py-2 text-white">
        {message}
      </p>
    </div>
  );
}

export { MyMessage, OtherMessage };
