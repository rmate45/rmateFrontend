export const QuizComplete = ({
  currentQuestion,
  loading,
  conversationLength,
}) => {
  if (currentQuestion || loading || conversationLength === 0) return null;

  return (
    <div className="mt-4 text-center">
      <div className="px-4 py-2 bg-green-100 border-2 border-secondary rounded-xl text-sm text-green-800 font-semibold">
        🎉 Quiz Complete! Thank you for participating.
      </div>
    </div>
  );
};

