import { useEffect, useState } from "react";
import { fetchFeature } from "../../api-client";
import SingelFeaturesPreview from "./single-feature-preview";
import React from "react";

const Feature = ({ feature_name, initailFeature, isNew, selectedProject, selectedEnvironment, setContentClick }) => {
    const empty_feature = {
        title: "",
        name: "",
        description: "",
        enable: true,
        type: "flag",
        percentage: 0,
        rules: {},
        attributes: {
            type: "String",
            value: ""
        },
        last_modified_date: new Date().toISOString().slice(0, 19),
        start_date: new Date().toISOString().slice(0, 19),
        end_date: new Date().toISOString().slice(0, 19),
        dependent: "",
        environment: selectedEnvironment,
        project: selectedProject
    }
    const [feature, setFeature] = useState(initailFeature ? initailFeature : empty_feature);
    const [loading, setLoading] = useState(true);

    function fetchFeatureDetails(feature_name: any, selectedProject: any, selectedEnvironment: any, setFeature: any) {
        fetchFeature(feature_name, selectedProject, selectedEnvironment).then((feature) => {
            setFeature(feature);
        }).catch(console.error);
    }

    useEffect(() => {
        if (initailFeature || isNew) {
            setLoading(false);
            return
        }
        try {
            fetchFeatureDetails(feature_name, selectedProject, selectedEnvironment, setFeature);
        }
        catch (error) {
            console.error("Error fetching data:", error);
            setFeature(empty_feature)
        }
        finally {
            setLoading(false);
        }

    }, [initailFeature]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (<div className="feature-list">
        <>
            {/* <Header message={feature.name} /> */}
            <SingelFeaturesPreview feature={feature} isNew={isNew} onClick={setContentClick} />
        </>
    </div>);
};

export default Feature;

