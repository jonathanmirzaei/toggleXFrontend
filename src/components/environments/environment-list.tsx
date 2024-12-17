import { useEffect, useState } from "react";
import { fetchEnvironmentList, updateEnvironment, addEnvironment, deleteEnvironmentById } from "../../api-client.ts"
import React from "react";

const EnvironmentList = ({ }) => {
   const [environments, setEnvironments] = useState([]);
   const [editingEnvironmentId, setEditingEnvironmentId] = useState(null); // Track the environment being edited

   const addNewEnvironment = () => {
      const newEnvironment = {
         _id: `temp-${Date.now()}`, // Temporary ID
         name: "",
         last_modified_date: new Date().toISOString(),
         isNew: true, // Mark as new
      };

      setEnvironments((prevEnvironments) => [...prevEnvironments, newEnvironment]);
      setEditingEnvironmentId(newEnvironment._id); // Focus on the new environment
   };

   const deleteEnvironment = async (event, id) => {
      event.preventDefault();

      try {
         console.log("id: " + id);
         await deleteEnvironmentById(id);
         setEnvironments((prevEnvironments) =>
            prevEnvironments.filter((environment) => environment._id !== id)
         );
      } catch (error) {
         console.error("Error deleting environment:", error);
      }
   };

   const handleInputChange = (event, id) => {
      const { name, value } = event.target;
      setEnvironments((prevEnvironments) =>
         prevEnvironments.map((environment) =>
            environment._id === id
               ? { ...environment, [name]: value }
               : environment
         )
      );
   };

   const handleEditToggle = async (event, id, type) => {
      event.preventDefault();

      if (type === "Save") {
         const environmentToSave = environments.find((environment) => environment._id === id);

         if (environmentToSave) {
            try {
               let savedEnvironment;
               if (environmentToSave.isNew) {
                  // Add new environment
                  savedEnvironment = await addEnvironment({ name: environmentToSave.name });
                  setEditingEnvironmentId(null); // Exit edit mode
                  return
               } else {
                  // Update existing environment
                  savedEnvironment = await updateEnvironment({
                     id: environmentToSave._id,
                     name: environmentToSave.name,
                  });
               }


               // Update environment list with saved environment
               setEnvironments((prevEnvironments) =>
                  prevEnvironments.map((environment) =>
                     environment._id === id ? savedEnvironment : environment
                  )
               );
            } catch (error) {
               console.error("Error saving environment:", error);
            }
         }
         setEditingEnvironmentId(null); // Exit edit mode
      } else if (type === "Edit") {
         setEditingEnvironmentId(id); // Enable edit mode for the selected environment
      }
   };

   useEffect(() => {
      fetchEnvironmentList()
         .then((environments) => setEnvironments(environments))
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
                     onClick={addNewEnvironment}
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
                        {environments.map((environment) => (
                           <tr className="align-middle" key={environment._id}>
                              <td className="">
                                 <input
                                    id="environmentName"
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    value={environment.name}
                                    disabled={editingEnvironmentId !== environment._id} // Enable only if it's being edited
                                    onChange={(e) => handleInputChange(e, environment._id)}
                                 />
                              </td>
                              <td className="">{environment.last_modified_date}</td>
                              <td className="">
                                 <div className="btn-group">
                                    {editingEnvironmentId === environment._id ? (
                                       <button
                                          className="btn nav-icon bi bi-pencil-square"
                                          onClick={(e) =>
                                             handleEditToggle(e, environment._id, "Save")
                                          }
                                       >
                                          Save
                                       </button>
                                    ) : (
                                       <button
                                          className="btn nav-icon bi bi-pencil-square"
                                          onClick={(e) =>
                                             handleEditToggle(e, environment._id, "Edit")
                                          }
                                       >
                                          Edit
                                       </button>
                                    )}
                                    <button
                                       className="btn nav-icon bi bi-trash"
                                       onClick={(e) => deleteEnvironment(e, environment._id)}
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

export default EnvironmentList;
