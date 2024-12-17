import { API_SERVER_URL, API_ADMIN_URL } from "./public-config.ts"
import axios from "axios";

export const fetchUserList = async (accessToken, project) => {
    // const headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': `Bearer ${accessToken}`
    // };
    // console.log(headers);
    const AuthStr = 'Bearer '.concat(accessToken); 

    const response = await axios.get(`${API_ADMIN_URL}/admin/realms/toggleX/users`, { headers: { Authorization: AuthStr }})
    // console.log(response);
    return response.data;
}

export const fetchProjectList = async () => {
    const response = await axios.get(`${API_SERVER_URL}/projects`)
    return response.data.projects;
}

export const fetchFeatureList = async (project: string, environment: string) => {
    const response = await axios.get(`${API_SERVER_URL}/features`, {
        params: {
            project,
            environment
        }
    })
    return response.data.features;
}

export const fetchExperiementList = async (project: string, environment: string) => {
    const response = await axios.get(`${API_SERVER_URL}/experiemnts`, {
        params: {
            project,
            environment
        }
    })
    return response.data.features;
}

export const fetchFeature = async (name: string, project: string, environment: string) => {
    const response = await axios.get(`${API_SERVER_URL}/feature/${name}`, {
        params: {
            project,
            environment
        }
    })
    return response.data.features;
}

export const fetchExperiement = async (name: string, project: string, environment: string) => {
    const response = await axios.get(`${API_SERVER_URL}/experiement/${name}`, {
        params: {
            project,
            environment
        }
    })
    return response.data.features;
}

export const deleteFeature = async ({ id }) => {
    const response = await axios.delete(
        `${API_SERVER_URL}/deleteFeature/${id}`);
    return response.data.updatedFeature;
}

export const deleteProjectById = async (id) => {
    const response = await axios.delete(
        `${API_SERVER_URL}/deleteProject/${id}`);
    return response.data.updatedProject;
}

export const updateProject = async ({ id, name }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/project/${id}`,
        {
            name
        }
    );
    return response.data.updatedProject;
}

export const addProject = async ({ name }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/addProject`,
        {
            name
        }
    );
    // console.log(response.data.updatedFeature);
    return response.data.updatedFeature;
}
///
export const fetchEnvironmentList = async () => {
    const response = await axios.get(`${API_SERVER_URL}/environments`)
    return response.data.environments;
}

export const deleteEnvironmentById = async (id) => {
    const response = await axios.delete(
        `${API_SERVER_URL}/deleteEnvironment/${id}`);
    return response.data.updatedEnvironment;
}

export const updateEnvironment = async ({ id, name }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/environment/${id}`,
        {
            name
        }
    );
    return response.data.updatedEnvironment;
}

export const addEnvironment = async ({ name }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/addEnvironment`,
        {
            name
        }
    );
    return response.data.updatedEnvironment;
}
///
export const updateFeature = async ({ name, title, description, enable, attribute_type, attribute_value, rules, percentage, dependent, end_date, start_date }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/feature/${name}`,
        {
            name,
            title,
            description,
            enable,
            attribute_type,
            attribute_value,
            rules,
            percentage,
            dependent,
            end_date,
            start_date,
        }
    );
    // console.log(response.data.updatedFeature);
    return response.data.updatedFeature;
}
export const updateExperiement = async ({ id, name, title, description, enable, variations, rules, percentage, dependent, end_date, start_date }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/experiement/${id}`,
        {
            name,
            title,
            description,
            enable,
            variations,
            rules,
            percentage,
            dependent,
            end_date,
            start_date,
        }
    );


    // console.log(response.data.updatedFeature);
    return response.data.updatedFeature;
}

export const addNewFeature = async ({ name, title, description, enable, type, attribute_type, attribute_value, rules, percentage, dependent, end_date, start_date, environment, project }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/createNewfeature`,
        {
            name,
            title,
            description,
            enable,
            type,
            attribute_type,
            attribute_value,
            rules,
            percentage,
            dependent,
            end_date,
            start_date,
            environment,
            project
        }
    );
    // console.log(response.data.updatedFeature);
    return response.data.updatedFeature;
}

export const addNewExperiement = async ({ name, title, description, enable, variations, type, rules, percentage, dependent, end_date, start_date, environment, project }) => {
    const response = await axios.post(
        `${API_SERVER_URL}/createNewExperiement`,
        {
            name,
            title,
            description,
            enable,
            variations,
            type,
            rules,
            percentage,
            dependent,
            end_date,
            start_date,
            environment,
            project
        }
    );
    // console.log(response.data.updatedFeature);
    return response.data.updatedFeature;
}

export const fetchTotalActiveUsers = async (project: string) => {
    const response = await axios.get(`${API_SERVER_URL}/fetchTotalActiveUsers`, {
        params: {
            project
        }
    })
    return response.data.totalActiveUsers;
}

export const fetchEvents = async (project: string, flagName: string) => {
    const response = await axios.get(`${API_SERVER_URL}/events`, {
        params: {
            project,
            flagName
        }
    })
    return response.data.events;
}

export const fetchAllFeatureList = async (project: string, environment: string) => {
    const response = await axios.get(`${API_SERVER_URL}/fetchAllFeatureList`, {
        params: {
            project,
            environment
        }
    })
    return response.data.features;
}