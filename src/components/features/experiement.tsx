import { useEffect, useState } from "react";
import { fetchExperiement } from "../../api-client.ts";
import SingelExperiementPreview from "./single-experiement-preview.tsx";
import React from "react";

const Experiemetn = ({ experiement_name, initailExperiement, isNew, selectedProject, selectedEnvironment, setContentClick }) => {
    const empty_experiement = {
        title: "",
        name: "",
        description: "",
        enable: true,
        type: "exp",
        percentage: 0,
        rules: {},
        variations: [
            {
                name: "variation_A",
                percentage: 50,
                attributes: {
                    type: "String",
                    value: ""
                }
            },
            {
                name: "variation_B",
                percentage: 50,
                attributes: {
                    type: "String",
                    value: ""
                }
            }
        ],
        last_modified_date: new Date().toISOString().slice(0, 19),
        start_date: new Date().toISOString().slice(0, 19),
        end_date: new Date().toISOString().slice(0, 19),
        dependent: "",
        environment: selectedEnvironment,
        project: selectedProject
    }
    const [experiement, setExperiement] = useState(initailExperiement ? initailExperiement : empty_experiement);

    useEffect(() => {
        if (initailExperiement) { return }
        fetchExperiement(experiement_name, selectedProject, selectedEnvironment).then((feature) => {
            setExperiement(feature);
        }).catch(console.error);
    }, [initailExperiement]);

    return (<div className="feature-list">
        <>
            <SingelExperiementPreview feature={experiement} isNew={isNew} onClick={setContentClick} />
        </>
    </div>);
};

export default Experiemetn