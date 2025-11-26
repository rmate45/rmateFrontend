

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/api";
import Quiz from "./Quiz";
import SeoHelmet from "../components/Seo/SeoHelmet";
import { slugify } from "../utils/slugify";

const safeText = (v = "") => String(v || "");


export default function PersonaPage() {
    const { slug } = useParams();
    const { search, href } = useLocation();
    const params = new URLSearchParams(search);
    const id = params.get("id");
console.log(id,"id");

    const [card, setCard] = useState(null);
    console.log(card,"card");
    
    const [state, setState] = useState({ loading: true, notFound: false });

    useEffect(() => {
        let mounted = true;

        (async () => {
            setState({ loading: true, notFound: false });

            try {
                // 1) try fetch by id (authoritative, fast)
                if (id) {
                    const res = await api.get(`/get-persona/${encodeURIComponent(id)}`);
                    const data = res?.data?.data || res?.data;

                    if (mounted) {
                        if (data) setCard(data);
                        else setState({ loading: false, notFound: true });
                        if (data) setState({ loading: false, notFound: false });
                    }
                    return;
                }

                // 2) fallback to fetch list & match slug
                const listRes = await api.get("/get-personas");
                const items = listRes?.data?.data || [];
                const found = items.find((it) =>
                    slugify(it.question || it.title || it.name) === decodeURIComponent(slug || "")
                );

                if (mounted) {
                    if (found) setCard(found);
                    else setState({ loading: false, notFound: true });
                    if (found) setState({ loading: false, notFound: false });
                }
            } catch (err) {
                // network / unexpected
                console.error("PersonaPage error:", err);
                if (mounted) setState({ loading: false, notFound: true });
            }
        })();

        return () => {
            mounted = false;
        };
    }, [slug, id]);

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
    const ogImage = "https://retiremate.com/assets/logo-D1t2XXia.png"

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
            <Quiz initialCard={card} />

        </>
    );
}
