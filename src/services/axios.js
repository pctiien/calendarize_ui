import axios from 'axios';

const createInstance = (baseURL) => {
    return axios.create({
        baseURL
    });
};

const authApiInstance = createInstance('http://localhost:8071/calendarize/auth')
const userApiInstance = createInstance('http://localhost:8071/calendarize/user')
const projectApiInstance = createInstance('http://localhost:8071/calendarize/projects')
const lifeTasksApiInstance = createInstance('http://localhost:8071/calendarize/life')

export {authApiInstance,userApiInstance,projectApiInstance,lifeTasksApiInstance};
