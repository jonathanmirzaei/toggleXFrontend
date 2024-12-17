import { useEffect, useState } from "react";
import FeatureList from "./features/feature-list";
import ExperiemetList from "./features/exp-list";
import Feature from "./features/feature";
import Experiemetn from "./features/experiement";
import ProjectList from "./projects/project-list"
import Users from "./users/users";
import EnvironmentList from "./environments/environment-list";
import Events from "./events/events";
import React from "react";
import Header from "./header";
import SubHeader from "./sub_header";
import SideBar from "./sideBar";
import { fetchProjectList, fetchEnvironmentList } from "../api-client";

export const PageContext = React.createContext();

const App = ({ initialData, keycloak }) => {
   // Default page configuration for server rendering
   const defaultPage = {
      pageName: "",
      feature: initialData.feature,
      feature_name: initialData.feature?.name,
   };

   const [page, setPage] = useState(defaultPage);
   const [projects, setProjects] = useState();
   const [environments, setEnvironments] = useState();
   const [selectedProject, setSelectedProject] = useState();
   const [selectedEnvironment, setSelectedEnvironment] = useState();
   const [loading, setLoading] = useState(true);

   function LoadPage() {
      if (typeof window !== "undefined") {
         const path = window.location.pathname;
         const segments = path.split("/").filter(Boolean);

         const newPage = (() => {
            switch (segments[0]) {
               case "analytics":
                  return { pageName: "Analytics" };
               case "experiemnts":
                     return { pageName: "Experiment List" };
               case "feature":
                  if (segments[1] === "create_new_flag") {
                     return { pageName: "New Feature", feature: null };
                  }
                  return { pageName: "Edit Feature", feature_name: segments[1], feature: initialData.feature };
               case "experiement":
                  return { pageName: "Edit Experiement", feature_name: segments[1], feature: initialData.feature };
               case "projects":
                  return { pageName: "Project List" };
               case "environments":
                  return { pageName: "Environment List" };
               case "users":
                     return { pageName: "Users" };
               default:
                  return { pageName: "Flag List" };
            }
         })();

         setPage(newPage);
      }
   }

   const fetchData = async () => {
      try {
         setLoading(true); // Start loading.
         fetchProjectList()
            .then((projects) => {
               setProjects(projects)
               setSelectedProject(projects[0].name)
            })
            .catch(console.error);
         fetchEnvironmentList()
            .then((environments) => {
               setEnvironments(environments)
               setSelectedEnvironment(environments[0].name)
            })
            .catch(console.error);
      } catch (error) {
         console.error("Error fetching data:", error);
         setProjects(null);
         setEnvironments(null);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData()
      LoadPage();
   }, []); // Runs only once on the client after hydration

   const navigation = (name, feature, refresh) => {
      if (typeof window !== "undefined") {
         switch (name) {
            case "Users":
               window.history.pushState({}, "", `/users`);
               setPage({ pageName: "Users" });
               break;
            case "Experiment List":
               window.history.pushState({}, "", `/experiemnts`);
               setPage({ pageName: "Experiment List" });
               break;
            case "Edit Feature":
               window.history.pushState({ feature: feature }, "", `/feature/${feature.name}`);
               setPage({ pageName: "Edit Feature", feature_name: feature.name, feature: feature });
               break;
            case "Edit Experiement":
               window.history.pushState({ feature }, "", `/experiement/${feature.name}`);
               setPage({ pageName: "Edit Experiement", feature_name: feature.name, feature: feature });
               break;
            case "New Feature":
               window.history.pushState({}, "", `/feature/create_new_flag`);
               setPage({ pageName: "New Feature", feature: refresh });
               break;
            case "New Experiement":
               window.history.pushState({}, "", `/feature/create_new_experiement`);
               setPage({ pageName: "New Experiement", feature: refresh });
               break;
            case "Project List":
               window.history.pushState({}, "", `/projects`);
               setPage({ pageName: "Project List", feature: refresh });
               break;
            case "Environment List":
               window.history.pushState({}, "", `/environments`);
               setPage({ pageName: "Environment List", feature: refresh });
               break;
            case "Analytics":
               window.history.pushState({}, "", `/analytics`);
               setPage({ pageName: "Analytics", feature: refresh });
               break;
            case "Flag List":
            default:
               window.history.pushState({}, "", `/features`);
               setPage({ pageName: "Flag List" });
               break;
         }
      }
   };

   const pageContent = () => {
      switch (page.pageName) {
         case "Users":
            return <Users
               keycloak={keycloak}
               selectedProject={selectedProject}
               setContentClick={navigation} />;
         case "Flag List":
            return <FeatureList
               selectedProject={selectedProject}
               selectedEnvironment={selectedEnvironment}
               setContentClick={navigation} />;
         case "Experiment List":
            return <ExperiemetList
               selectedProject={selectedProject}
               selectedEnvironment={selectedEnvironment}
               setContentClick={navigation} />;
         case "Edit Feature":
            return <Feature
               feature_name={page.feature_name}
               initailFeature={page.feature}
               isNew={false}
               selectedProject={selectedProject}
               selectedEnvironment={selectedEnvironment}
               setContentClick={navigation} />;
         case "Edit Experiement":
            return <Experiemetn
               experiement_name={page.feature_name}
               initailExperiement={page.feature}
               isNew={false}
               selectedProject={selectedProject}
               selectedEnvironment={selectedEnvironment}
               setContentClick={navigation} />;
         case "New Feature":
            return <Feature
               feature_name={page.feature_name}
               initailFeature={page.feature}
               isNew={true}
               selectedProject={selectedProject}
               selectedEnvironment={selectedEnvironment}
               setContentClick={navigation} />;
         case "New Experiement":
            return <Experiemetn
               experiement_name={page.feature_name}
               initailExperiement={page.feature}
               isNew={true}
               selectedProject={selectedProject}
               selectedEnvironment={selectedEnvironment}
               setContentClick={navigation} />;
         case "Project List":
            return <ProjectList />;
         case "Environment List":
            return <EnvironmentList />;
         case "Analytics":
            return <Events
            selectedProject={selectedProject} />;
         default:
            return <div>Unknown page: {page.pageName}</div>;
      }
   };

   const handleProjectSelection = (event) => {
      event.preventDefault();
      const { name, value, type } = event.target;
      // console.log("handleProjectSelection: " + name, " value: " + value + " type: " + type);
      setSelectedProject(value);
   }

   const handleEnvironmentSelection = (event) => {
      event.preventDefault();
      const { name, value, type } = event.target;
      // console.log("handleEnvironmentSelection: " + name, " value: " + value + " type: " + type);
      setSelectedEnvironment(value);
   }
   if (loading) {
      return <div>Loading...</div>;
   }

   return (
      <div className="app-wrapper">
         <nav className="app-header navbar navbar-expand bg-body">
            <Header keycloak={keycloak}/>
         </nav>
         <div className="app-main">
            <SubHeader environments={environments} projects={projects} pageName={page.pageName} selectedProject={selectedProject} selectedEnvironment={selectedEnvironment} handleProjectSelection={handleProjectSelection} handleEnvironmentSelection={handleEnvironmentSelection} />
            {pageContent()}
         </div>
         <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
            <SideBar message="side bar" onClick={navigation} />
         </aside>
         <footer className="app-footer">
            <div className="float-end d-none d-sm-inline">
               2014-2024&nbsp;
               <a href="https://adminlte.io" className="text-decoration-none">AdminLTE.io</a>.
            </div>
            Copyright &copy; Togglex.io All rights reserved.
         </footer>
      </div>
   );
};

export default App;
