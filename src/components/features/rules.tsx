import React from "react";

const Rules = ({ initialRules, handleInputChange, updateFormData, updateError }) => {

    const getInitialConditionKey = (rules) => {
        return Object.keys(rules).find((key) => key.endsWith("Condition"));
    };

    const initialConditionKey = getInitialConditionKey(initialRules || {});

    const addNewRule = (event, path, type) => {
        event.preventDefault();
        const newRule = {
            description: "",
            key: "",
            condition: type == "string" ? "equals" : "=", 
            value: "",
            type: type, // or "integer", depending on your use case
        };

        const updatedRules = { ...initialRules };
        let current = updatedRules;

        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }

        if (Array.isArray(current[path[path.length - 1]])) {
            current[path[path.length - 1]].push(newRule);
        }

        updateFormData((prevFormData) => ({
            ...prevFormData,
            rulse: [...prevFormData.rules, updatedRules]
        }));
    };

    const addNewGroup = (event, path, conditionKey, newConditionKey) => {
        event.preventDefault();

        const newGroup = { [`${newConditionKey}`]: [] };

        const updatedRules = { ...initialRules };
        let current = updatedRules;

        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }

        if (Array.isArray(current[conditionKey])) {
            current[conditionKey].push(newGroup);
        } else {
            current[newConditionKey] = [];
        }

        updateFormData((prevFormData) => ({
            ...prevFormData,
            rules: updatedRules,
        }));
    };
    const operation_options = (condition) => {
        return condition.type === "string" ? (
            <>
                <option className="dropdown-item" value="equals" >equals</option>
                <option className="dropdown-item" value="not_equals">not equals</option>
                <option className="dropdown-item" value="end_with">end with</option>
                <option className="dropdown-item" value="start_with">start with</option>
                <option className="dropdown-item" value="include_in">include in</option>
                <option className="dropdown-item" value="exclude_from">exclude from</option>
            </>
        ) : (
            <>
                <option className="dropdown-item" value="=" >equal</option>
                <option className="dropdown-item" value="!=">not equal</option>
                <option className="dropdown-item" value=">">greater</option>
                <option className="dropdown-item" value="<">smaller</option>
                <option className="dropdown-item" value="<=">smaller equal</option>
                <option className="dropdown-item" value=">=">greater equal</option>
            </>
        )
    }
    const renderCondition = (condition, path) => (
        <div className="row" key={path.join("-")}>
            <div className="mb-3 col-3">
                <div className="input-group">
                    <span className="input-group-text">Key:</span>
                    <input id="key" className="form-control" type="text" placeholder="Add new variation.." name="key" value={condition.key} onChange={(e) => handleInputChange(e, [path.unshift("rules"), ...path, "key"])} />
                </div>
            </div>
            <div className="mb-3 col-3">
                <div className="input-group ">
                    <span className="input-group-text">op:</span>
                    <select id="condition" className="form-control dropdown-toggle" value={condition.condition} onChange={(e) => handleInputChange(e, [path.unshift("rules"), ...path, "condition"])}>
                        {operation_options(condition)}
                    </select>

                    {/* <span className="input-group-text">{condition.type}</span> */}
                </div>
            </div>
            <div className="mb-3 col-3">
                <div className="input-group">
                    <span className="input-group-text">value:</span>
                    <input id="value" className="form-control" type={condition.type === "integer" ? "number" : "text"} placeholder="Add new variation.." name="value" value={condition.value} onChange={(e) => handleInputChange(e, [path.unshift("rules"), ...path, "value"])} />
                </div>
            </div>
        </div>
    );

    const addNewRuleButton = (currentPath, conditionKey) => {
        return <>
            <div className="dropdown" role="group">
                <button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Add Rule
                </button>
                <ul className="dropdown-menu">
                    <li> <a className="dropdown-item" href="#" onClick={(e) => addNewRule(e, [...currentPath, conditionKey], "string")}>String</a> </li>
                    <li> <a className="dropdown-item" href="#" onClick={(e) => addNewRule(e, [...currentPath, conditionKey], "integer")}>Integer</a> </li>
                </ul>
            </div>
        </>
    }

    const addNewGroupButton = (currentPath, conditionKey) => {
        return <>
            <div className="dropdown" role="group">
                <button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Add Group
                </button>
                <ul className="dropdown-menu">
                    <li> <a className="dropdown-item" href="#" onClick={(e) => addNewGroup(e, [...currentPath, conditionKey], conditionKey, "andCondition")}>And Condition</a> </li>
                    <li> <a className="dropdown-item" href="#" onClick={(e) => addNewGroup(e, [...currentPath, conditionKey], conditionKey, "orCondition")}>Or Condition</a> </li>
                </ul>
            </div>
        </>
    }

    const renderConditions = (conditions, path = []) => {
        return conditions.map((condition, index) => {
            const currentPath = [...path, index];
            const conditionKey = Object.keys(condition).find((key) =>
                key.endsWith("Condition")
            );

            if (conditionKey) {
                return (
                    <fieldset className="" key={currentPath.join("-")}>
                        <legend>{conditionKey.replace("Condition", "").toUpperCase()} Condition</legend>
                        {renderConditions(condition[conditionKey], [...currentPath, conditionKey])}
                        <div className="btn-group">
                            {addNewRuleButton(currentPath, conditionKey)}
                            {addNewGroupButton(currentPath, conditionKey)}
                        </div>
                    </fieldset>
                );
            } else {
                return renderCondition(condition, currentPath);
            }
        });
    };

    return (<div className="feature-list">
        <>
            {initialConditionKey ? (
                <div className="card card-outline card-warning">
                    <div className="card-header">
                        <div className="card-title">Criteria</div>
                    </div>
                    <div className="card-body">
                        <fieldset className="">
                            <legend>{initialConditionKey.replace("Condition", "").toUpperCase()} Condition</legend>
                            {renderConditions(initialRules[initialConditionKey], [initialConditionKey])}
                            <div className="btn-group">
                                {addNewRuleButton(initialRules, initialConditionKey)}
                                {addNewGroupButton(initialRules, initialConditionKey)}
                            </div>
                        </fieldset>
                    </div>
                </div>
            ) : (
                <div className="card card-outline card-warning">
                    <div className="card-header">
                        <div className="card-title">Criteria</div>
                    </div>
                    <div className="card-body">
                        <fieldset className="">
                            <div className="">
                                <div>No conditions available. Add a new group to start:</div>
                                {addNewGroupButton([], "")}
                            </div>
                        </fieldset>
                    </div>
                </div>
            )}
        </>
    </div>);
};

export default Rules;