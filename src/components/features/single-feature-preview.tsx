import React, { useState } from "react";
import { updateFeature, addNewFeature } from "../../api-client";
import Rules from "./rules";

const SingelFeaturesPreview = ({ feature, isNew, onClick }) => {
    // const [isChecked, setIsChecked] = useState(feature.enable);
    const [formData, setFormData] = useState(feature);
    const [error, setError] = useState("");
    
    console.log("SingelFeaturesPreview feature");
    console.log(feature);
    
    const changeAttributeType = (event, path) => {
        event.preventDefault();
        const updatedVariations = feature;

        updatedVariations.attributes.value = ""
        handleInputChange(event, path)
    }
    const handleFeatureEnable = (event, value) => {
        event.preventDefault();
        const updatedFormData = { ...formData };
        updatedFormData.enable = value
        setFormData(updatedFormData);
    }

    const handleFeatureValue = (event, attribute, value) => {
        event.preventDefault();
        const updatedFormData = { ...formData };
        attribute.value = value
        setFormData(updatedFormData);
    }
    const handleInputChange = (event, path) => {
        const { name, value, type, checked } = event.target;
        const updatedValue = type === "checkbox" ? checked : value;
        // console.log("name: " + name + " value: " + value + " type: " + type + " checked: " + checked);

        if (name == "percentage") {
            if (value > 100 || value < 0) {
                setError("Total percentage (" + value + "%) must be between 0-100%");
            } else {
                setError(""); // Clear the error if valid
            }
        }

        const updatedFormData = { ...formData };
        let current = updatedFormData;

        for (let i = 0; i < path.length - 1; i++) {
            if (current[path[i]] != undefined)
                current = current[path[i]];
        }
        current[path[path.length - 1]] = updatedValue;

        setFormData(updatedFormData);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log("formData");
        console.log(formData);

        isNew ? (
            await addNewFeature({
                name: formData.name,
                title: formData.title,
                description: formData.description,
                enable: formData.enable,
                type: formData.type,
                attribute_type: formData.attributes.type,
                attribute_value: formData.attributes.value,
                rules: formData.rules,
                percentage: formData.percentage,
                dependent: formData.dependent,
                end_date: formData.end_date,
                start_date: formData.start_date,
                environment: formData.environment,
                project: formData.project,
            }),
            onClick("Flag List", "", true)
        ) : (
            setFormData(await updateFeature({
                name: formData.name,
                title: formData.title,
                description: formData.description,
                enable: formData.enable,
                attribute_type: formData.attributes.type,
                attribute_value: formData.attributes.value,
                rules: formData.rules,
                percentage: formData.percentage,
                dependent: formData.dependent,
                end_date: formData.end_date,
                start_date: formData.start_date,
            }))
        )


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
                                        <input id="featureTitle" className="form-control" type="text" name="title" value={formData.title} onChange={(e) => handleInputChange(e, ["title"])} />
                                    </td>
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
                                {formData.attributes && (
                                    <>
                                        <tr className="align-middle">
                                            <th>attributes</th>
                                            <td>
                                                <div className="input-group">
                                                    <span className="input-group-text dropdown">
                                                        <select className="nav-link dropdown-toggle" value={formData.attributes.type} onChange={(e) => changeAttributeType(e, ["attributes", "type"])}>
                                                            <option className="dropdown-item" value="String" >String</option>
                                                            <option className="dropdown-item" value="JSON">JSON</option>
                                                            <option className="dropdown-item" value="boolean">Boolean</option>
                                                        </select>
                                                    </span>
                                                    {formData.attributes.type === "boolean" ? (
                                                        <div className="dropdown" role="group">
                                                            <button style={{ "marginLeft": "20px" }} type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                {formData.attributes.value == true ? "True" : "False"}
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li> <a className="dropdown-item" href="#" onClick={(e) => handleFeatureValue(e, formData.attributes, true)}>True</a> </li>
                                                                <li> <a className="dropdown-item" href="#" onClick={(e) => handleFeatureValue(e, formData.attributes, false)}>False</a> </li>
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <textarea
                                                            className="form-control"
                                                            aria-label="With textarea"
                                                            // rows="4"
                                                            name="variation.attribut.value"
                                                            value={
                                                                typeof formData.attributes.value === "string"
                                                                    ? formData.attributes.value
                                                                    : JSON.stringify(formData.attributes.value)
                                                            }
                                                            onChange={(e) => handleInputChange(e, ["attributes", "value"])}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )}
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

export default SingelFeaturesPreview;