import image from '../../assets/medicareQuiz.jpg'
const MedicareQuiz = () => {
     const handleQuestionClick = () => {
        window.open(`/quiz?type=medicareQuiz`, "_blank");
    };
    return (
        <div className="text-center px-6 pt-10 sm:pt-16">
            <div className="max-w-7xl mx-auto pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    <div className="text-left rounded-2xl" style={{ boxShadow: "0px 0px 15px rgba(0,0,0,10%)" }}>
                        <img src={image} alt="medicare" className='rounded-t-2xl' />

                        <div className='px-4 py-5'>
                            <h4 className="text-wrap font-bold text-lg md:text-[20px] text-[#567257] grow-1 mb-3 text-left">Deciding Medicare Options ?</h4>
                            <p className="text-base jost grow text-[#6B7280] text-left">Ask RetireMate and learn about your Medicare,
                                Medicare Advantage, Medigap & Part D
                            </p>
                            <button onClick={handleQuestionClick} className="mt-5  text-base rounded-lg px-4 py-2 bg-[#567257] text-white">View Answer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MedicareQuiz