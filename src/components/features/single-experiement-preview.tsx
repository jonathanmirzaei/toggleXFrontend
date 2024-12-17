import React, { useState } from "react";
import { updateExperiement, addNewExperiement } from "../../api-client.ts";
import Variations from "./variations.tsx";
import Rules from "./rules.tsx";

const SingelExperiementPreview = ({ feature, isNew, onClick }) => {
    // const [isChecked, setIsChecked] = useState(feature.enable);
    const [formData, setFormData] = useState(feature);
    const [error, setError] = useState("");

    const handleInputChange = (event, path) => {
        const { name, value, type, checked } = event.target;
        const updatedValue = type === "checkbox" ? checked : type === "number" ? Number(value) : value;
        // console.log("name: " + name + " value: " + value + " updatedValue: " + updatedValue);

        if (name == "percentage") {
            if (value > 100 || value < 0) {
                setError("Total percentage (" + value + "%) must be between 0-100%");
            } else {
                setError(""); // Clear the error if valid
            }
        }
        const updatedFormData = { ...formData };
        let current = updatedFormData;
        // console.log("current");
        // console.log(current);
        // console.log("path");
        // console.log(path);
        for (let i = 0; i < path.length - 1; i++) {
            if (current[path[i]] != undefined)
                current = current[path[i]];
        }
        // console.log("current");
        // console.log(current);
        // console.log("path");
        // console.log(path);
        // console.log("path.length");
        // console.log(path.length);
        current[path[path.length - 1]] = updatedValue;

        setFormData(updatedFormData);
    };
    
    const handleFeatureEnable = (event, value) => {
        event.preventDefault();
        const updatedFormData = { ...formData };
        updatedFormData.enable = value
        setFormData(updatedFormData);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log("formData");
        console.log(formData);

        isNew ? (
            await addNewExperiement({
                name: formData.name,
                title: formData.title,
                description: formData.description,
                enable: formData.enable,
                variations: formData.variations,
                type: formData.type,
                rules: formData.rules,
                percentage: formData.percentage,
                dependent: formData.dependent,
                end_date: formData.end_date,
                start_date: formData.start_date,
                environment: formData.environment,
                project: formData.project,
            }),
            onClick("Experiment List", "", true)
        ) : (
            setFormData(await updateExperiement({
                id: formData._id,
                name: formData.name,
                title: formData.title,
                description: formData.description,
                enable: formData.enable,
                variations: formData.variations,
                rules: formData.rules,
                percentage: formData.percentage,
                dependent: formData.dependent,
                end_date: formData.end_date,
                start_date: formData.start_date,
            }))
        )
        // setIsChecked(updatedFeature.enable);
    };

    function parsDate(date) {
        return date ? new Date(date).toISOString().slice(0, 19) : ""
    }
    return (
        <div className="col-md-9">
            <div className="card card-primary card-outline mb-4">
                <div className="card-header">
                    <div className="card-titles">Edit: {formData.title}</div>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <tbody>
                                <tr className="align-middle">
                                    <th>Feature Title</th>
                                    <td>
                                        {/* <label for="featureTitle" className="form-label">Feature Title</label> */}
                                        <input id="featureTitle" className="form-control" type="text" name="title" value={formData.title} onChange={(e) => handleInputChange(e, ["title"])} /></td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Feature Name</th>
                                    <td>
                                        <input id="featureName" className="form-control" type="text" name="name" value={formData.name} disabled={!isNew} onChange={(e) => handleInputChange(e, ["name"])} />
                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Description</th>
                                    <td>
                                        <div className="input-group">
                                            <span className="input-group-text">description</span>
                                            <textarea className="form-control" aria-label="With textarea" value={formData.description} onChange={(e) => handleInputChange(e, ["description"])} />
                                        </div>
                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Feature Type</th>
                                    <td>{formData.type}</td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Feature Enable</th>
                                    <td>
                                        <div className="dropdown" role="group">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                {formData.enable ? "True" : "False"}
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li> <a className="dropdown-item" href="#" onClick={(e) => handleFeatureEnable(e, true)}>True</a> </li>
                                                <li> <a className="dropdown-item" href="#" onClick={(e) => handleFeatureEnable(e, false)}>False</a> </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Percentage</th>
                                    <td>
                                        <div className="input-group mb-3">
                                            {/* <span className="input-group-text">$</span>  */}
                                            <input min="0" max="100" id="percentage" className="form-control" type="number" name="percentage" value={formData.percentage} onChange={(e) => handleInputChange(e, ["percentage"])} />
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Dependency</th>
                                    <td>
                                        <input id="Dependency" className="form-control" type="text" name="Dependency" placeholder="Add flag dependency" value={formData.dependent ? formData.dependent : ""} onChange={(e) => handleInputChange(e, ["dependent"])} />

                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Last Modified Date</th>
                                    <td>
                                        <input disabled id="last_modified_date" className="form-control" type="datetime-local" name="last_modified_date" value={parsDate(formData.last_modified_date)} onChange={(e) => handleInputChange(e, ["last_modified_date"])} />
                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>Start Date</th>
                                    <td>
                                        <input id="start_date" className="form-control" type="datetime-local" name="start_date" value={parsDate(formData.start_date)} onChange={(e) => handleInputChange(e, ["start_date"])} />
                                    </td>
                                </tr>
                                <tr className="align-middle">
                                    <th>End Date</th>
                                    <td>
                                        <input id="end_date" className="form-control" type="datetime-local" name="end_date" value={parsDate(formData.end_date)} onChange={(e) => handleInputChange(e, ["end_date"])} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Variations initialVariations={formData.variations} handleInputChange={handleInputChange} updateFormData={setFormData} updateError={setError} />

                        <Rules initialRules={formData.rules} handleInputChange={handleInputChange} updateFormData={setFormData} updateError={setError} />
                    </div>
                    <div className="card-footer">
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button type="submit" className="btn btn-primary" disabled={!!error}>Save</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SingelExperiementPreview;