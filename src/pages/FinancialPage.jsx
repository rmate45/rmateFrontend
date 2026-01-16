
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/api";
import Quiz from "./Quiz";
import SeoHelmet from "../components/Seo/SeoHelmet";

const safeText = (v = "") => String(v || "");


export default function FinancialPage() {
    const { id } = useParams();
    const { href } = useLocation();

    const [card, setCard] = useState(null);
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

                const res = await api.get(`/get-financial-planning/${encodeURIComponent(id)}`);
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
                console.error("FinancialPage error:", err);
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

    const pageTitle = card?.question || card?.title || "Top Financial Planning Questions";
    const pageDesc = safeText(card?.answer || card?.answers?.[0]).replace(/<br\s*\/?>/gi, " ").slice(0, 160);
    const ogImage = "https://retiremate.com/assets/logo-D1t2XXia.png"

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Question",
        name: pageTitle,
        text: pageTitle,
        acceptedAnswer: { "@type": "Answer", text: card?.answer || (card?.answers || []).join("\n") },
    };

    return (
        <>
            <SeoHelmet title={pageTitle} description={pageDesc} image={ogImage} url={href} structuredData={structuredData} />
            <Quiz initialCard={card} initialId={id} initialType="financial" />

        </>
    );
}
