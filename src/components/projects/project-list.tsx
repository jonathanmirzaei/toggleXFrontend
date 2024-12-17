import { useEffect, useState } from "react";
import { fetchProjectList, updateProject, addProject, deleteProjectById } from "../../api-client.ts";
import React from "react";

const ProjectList = ({ }) => {
    const [projects, setProjects] = useState([]);
    const [editingProjectId, setEditingProjectId] = useState(null); // Track the project being edited

    const addNewProject = () => {
        const newProject = {
            _id: `temp-${Date.now()}`, // Temporary ID
            name: "",
            last_modified_date: new Date().toISOString(),
            isNew: true, // Mark as new
        };
        
        setProjects((prevProjects) => [...prevProjects, newProject]);
        setEditingProjectId(newProject._id); // Focus on the new project
    };

    const deleteProject = async (event, id) => {
        event.preventDefault();

        try {
            console.log("id: "+id);
            await deleteProjectById(id);
            setProjects((prevProjects) =>
                prevProjects.filter((project) => project._id !== id)
            );
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleInputChange = (event, id) => {
        const { name, value } = event.target;
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project._id === id
                    ? { ...project, [name]: value }
                    : project
            )
        );
    };

    const handleEditToggle = async (event, id, type) => {
        event.preventDefault();

        if (type === "Save") {
            const projectToSave = projects.find((project) => project._id === id);

            if (projectToSave) {
                try {
                    let savedProject;
                    if (projectToSave.isNew) {
                        // Add new project
                        savedProject = await addProject({ name: projectToSave.name });
                        setEditingProjectId(null); // Exit edit mode
                        return
                    } else {
                        // Update existing project
                        savedProject = await updateProject({
                            id: projectToSave._id,
                            name: projectToSave.name,
                        });
                    }


                    // Update project list with saved project
                    setProjects((prevProjects) =>
                        prevProjects.map((project) =>
                            project._id === id ? savedProject : project
                        )
                    );
                } catch (error) {
                    console.error("Error saving project:", error);
                }
            }
            setEditingProjectId(null); // Exit edit mode
        } else if (type === "Edit") {
            setEditingProjectId(id); // Enable edit mode for the selected project
        }
    };

    useEffect(() => {
        fetchProjectList()
            .then((projects) => setProjects(projects))
            .catch(console.error);
    }, []);

    return (
        <>
            <div className="col-md-9">
                <div className="card mb-4">
                    <div className="card-header">
                        <h3 className="card-title">Flag List</h3>
                        <button
                            type="button"
                            className="btn btn-outline-success breadcrumb float-sm-end"
                            onClick={addNewProject}
                        >
                            Add new
                        </button>
                    </div>

                    <div className="card-body table-responsive p-0">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <td className="">Name</td>
                                    <td className="">Last Modified</td>
                                    <td className="">Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr className="align-middle" key={project._id}>
                                        <td className="">
                                            <input
                                                id="projectName"
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                value={project.name}
                                                disabled={editingProjectId !== project._id} // Enable only if it's being edited
                                                onChange={(e) => handleInputChange(e, project._id)}
                                            />
                                        </td>
                                        <td className="">{project.last_modified_date}</td>
                                        <td className="">
                                            <div className="btn-group">
                                                {editingProjectId === project._id ? (
                                                    <button
                                                        className="btn nav-icon bi bi-pencil-square"
                                                        onClick={(e) =>
                                                            handleEditToggle(e, project._id, "Save")
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn nav-icon bi bi-pencil-square"
                                                        onClick={(e) =>
                                                            handleEditToggle(e, project._id, "Edit")
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    className="btn nav-icon bi bi-trash"
                                                    onClick={(e) => deleteProject(e, project._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectList;
