const cards = [
  {
    title: "Clarity in minutes, not months",
    text: "It takes most people 4 months to find the right financial advisor. RetireMate delivers personalized answers in minutes."
  },
  {
    title: "A retirement roadmap, built around you",
    text: "With so much information out there, it’s hard to know where to start. RetireMate tailors a roadmap to your goals – so you know what to do now and what’s next."
  },
  {
    title: "Always with you, every step of the way",
    text: "Retirement isn’t just about planning – it’s about doing. RetireMate coaches you to build the habits that will build your dream retirement."
  }
];

const RetireMateAdvantage = () => {
  return (
    <section className="py-15 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-introPrimary font-medium text-2xl ">
          The RetireMate Advantage
        </h2>

        {/* Loop over cards */}
        <div className="grid gap-8 lg:grid-cols-3 mt-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-introPrimary mb-4">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 export default RetireMateAdvantage