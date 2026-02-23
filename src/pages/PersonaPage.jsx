

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/api";
import Quiz from "./Quiz";
import SeoHelmet from "../components/Seo/SeoHelmet";

const safeText = (v = "") => String(v || "");


export default function PersonaPage() {
    const { id } = useParams();
    const { href } = useLocation();

    const [card, setCard] = useState(null);
    console.log(card, "card");

    const [state, setState] = useState({ loading: true, notFound: false });

    useEffect(() => {
        let mounted = true;

        (async () => {
            setState({ loading: true, notFound: false });

            try {
                if (!id) {
                    if (mounted) setState({ loading: false, notFound: true });
                    return;
                }

                const res = await api.get(`/get-persona/${encodeURIComponent(id)}`);
                const data = res?.data?.data || res?.data;

                if (mounted) {
                    if (data) {
                        setCard(data);
                        setState({ loading: false, notFound: false });
                    } else {
                        setState({ loading: false, notFound: true });
                    }
                }
            } catch (err) {
                console.error("PersonaPage error:", err);
                if (mounted) setState({ loading: false, notFound: true });
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    const { loading, notFound } = state;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
    if (notFound)
        return (
            <div className="max-w-3xl mx-auto p-8">
                <SeoHelmet title="Card not found — RetireMate" description="The requested question was not found." url={href} noIndex />
                <h2 className="text-xl font-semibold mb-2">Card not found</h2>
                <p>We couldn't find the question you're looking for. Try searching from the homepage.</p>
            </div>
        );

    const pageTitle = card?.persona_question || card?.title || "Top Persona";
    const pageDesc = safeText(card?.persona_description || card?.answers?.[0]).replace(/<br\s*\/?>/gi, " ").slice(0, 160);
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || "https://www.retiremate.com";
    const ogImage = `${websiteUrl}/assets/logo-D1t2XXia.png`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Question",
        name: pageTitle,
        text: pageTitle,
        acceptedAnswer: { "@type": "Answer", text: card?.persona_description || (card?.answers || []).join("\n") },
    };

    return (
        <>
            <SeoHelmet title={pageTitle} description={pageDesc} image={ogImage} url={href} structuredData={structuredData} />
            <Quiz initialCard={card} initialId={id} initialType="persona" />

        </>
    );
}
