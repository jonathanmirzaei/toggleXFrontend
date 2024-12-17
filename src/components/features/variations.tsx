import React from "react";
const Variations = ({ initialVariations, handleInputChange, updateFormData, updateError }) => {


    const changeVariationType = (event, path) => {
        event.preventDefault();
        const updatedVariations = [...initialVariations];

        updatedVariations[path[1]].attributes.value = ""
        handleInputChange(event, path)
    }

    const checkPrecentage = (event, path) => {
        event.preventDefault();
        const { name, value, type } = event.target;

        const updatedVariations = [...initialVariations];

        updatedVariations[path[1]].percentage = Number(value);

        const totalPercentage = updatedVariations.reduce(
            (total, variation) => total + variation.percentage,
            0
        );

        // Check if the total percentage is valid
        if (totalPercentage > 100 || totalPercentage < 100) {
            updateError("Total percentage (" + totalPercentage + "%) must equal 100%");
        } else {
            updateError(""); // Clear the error if valid
        }

        handleInputChange(event, path)
    }

    const addNewVariation = () => {
        const newVariation = {
            name: "",
            percentage: 0,
            attributes: {
                type: "JSON", // Default type, change as needed
                value: ""
            }
        };

        updateFormData((prevFormData) => ({
            ...prevFormData,
            variations: [...prevFormData.variations, newVariation]
        }));
    };
    return (<div className="feature-list">
        <>
            {initialVariations && (

                <div className="card card-outline card-success">
                    <div className="card-header">
                        <div className="title">Variations</div>
                    </div>
                    <div className="card-body">
                        {initialVariations.length > 0 ? (
                            <div className="row">
                                {initialVariations.map((variation, index) => (
                                    <fieldset className="col-lg-5 col-5" key={index}>
                                        <legend>Variation: {variation.name}</legend>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Name:</span>
                                            <input
                                                id="newName"
                                                className="form-control"
                                                type="text"
                                                placeholder="Add new variation.."
                                                name="newName"
                                                value={variation.name}
                                                onChange={(e) => handleInputChange(e, ["variations", index, "name"])}
                                            />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">percentage:</span>
                                            <input
                                                id="percentage"
                                                className="form-control"
                                                type="number"
                                                placeholder="Add new variation.."
                                                name="percentage"
                                                value={variation.percentage ? variation.percentage : ""}
                                                onChange={(e) => checkPrecentage(e, ["variations", index, "percentage"])}
                                                min="0"
                                                max="100"
                                            />
                                            <span className="input-group-text">%</span>
                                        </div>
                                        <div className="input-group">
                                            <span className="input-group-text dropdown">
                                                <select className="nav-link dropdown-toggle" value={variation.attributes.type} onChange={(e) => changeVariationType(e, ["variations", index, "attributes", "type"])}>
                                                    <option className="dropdown-item" value="String" >String</option>
                                                    <option className="dropdown-item" value="JSON">JSON</option>
                                                    {/* <option>
                                                        <hr className="dropdown-divider" />
                                                    </option> */}
                                                    <option className="dropdown-item" value="boolean">Boolean</option>
                                                </select>
                                            </span>
                                            {variation.attributes.type === "boolean" ? (
                                                <span className="input-group-text dropdown">
                                                <select className="btn btn-success dropdown-toggle" value={variation.attributes.value} onChange={(e) => handleInputChange(e, ["variations", index, "attributes", "value"])}>
                                                    <option className="dropdown-item" value={true} >True</option>
                                                    <option className="dropdown-item" value={false}>False</option>
                                                </select>
                                            </span>
                                            ) : (
                                                <textarea
                                                    className="form-control"
                                                    aria-label="With textarea"
                                                    // rows="4"
                                                    name="variation.attribut.value"
                                                    value={
                                                        typeof variation.attributes.value === "string"
                                                            ? variation.attributes.value
                                                            : JSON.stringify(variation.attributes.value)
                                                    }
                                                    onChange={(e) => handleInputChange(e, ["variations", index, "attributes", "value"])}/>
                                            )}
                                        </div>
                                    </fieldset>
                                ))}
                            </div>
                        ) : (
                            <div className="empty">
                                <input type="text" name="newName" placeholder="Add new variation.." />
                                <button type="submit">Submit</button>
                            </div>
                        )}
                    </div>
                    <div className="card-footer">
                        <button
                            className="btn btn-outline-success col-lg-2 col-2"
                            type="button"
                            onClick={addNewVariation}>
                            Add
                        </button>
                    </div>
                </div>
            )}
        </>
    </div>);
};

export default Variations;