import React from 'react'
import Quiz from './Quiz'
import SeoHelmet from '../components/Seo/SeoHelmet'
import MetaImage from '../assets/retiremate.jpg'

const QuizView = () => {
    const siteUrl = import.meta.env.VITE_WEBSITE_URL;
    const imageUrl = siteUrl ? `${siteUrl}${MetaImage}` : MetaImage;

    return (
        <>
            <SeoHelmet
                title="Quiz"
                description=""
                url={siteUrl}
                image={imageUrl}
            />
            <Quiz />
        </>
    )
}

export default QuizView