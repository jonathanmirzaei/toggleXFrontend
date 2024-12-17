import React from "react";
const SubHeader = ({ projects, environments, pageName, selectedProject, selectedEnvironment, handleProjectSelection, handleEnvironmentSelection }) => {

    return (
        <>
            <div className="app-content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">{pageName}</h3>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-end">
                                <li className="breadcrumb-item">
                                    <span className="input-group-text dropdown">
                                        Project:
                                        {projects?.length > 0 ? (
                                            <select value={selectedProject ? selectedProject : projects[0].name} className="nav-link dropdown-toggle" onChange={(event) => handleProjectSelection(event)}>
                                                {projects.map((project, index) => (
                                                    <option key={index} className="dropdown-item" value={project.name} >{project.name}</option>
                                                ))};
                                            </select>
                                        ) : (
                                            <select className="nav-link dropdown-toggle">
                                                <option className="dropdown-item" value="empty" > empty</option>
                                            </select>
                                        )}
                                    </span>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    <span className="input-group-text dropdown">
                                        env:
                                        {environments?.length > 0 ? (
                                            <select value={selectedEnvironment ? selectedEnvironment : environments[0].name} className="nav-link dropdown-toggle" onChange={(event) => handleEnvironmentSelection(event)}>
                                                {environments.map((environment, index) => (
                                                    <option key={index} className="dropdown-item" value={environment.name} >{environment.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <select className="nav-link dropdown-toggle">
                                                <option className="dropdown-item" value="empty" > empty</option>
                                            </select>
                                        )}
                                    </span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SubHeader