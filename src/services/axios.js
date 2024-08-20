import axios from 'axios';

const createInstance = (baseURL) => {
    return axios.create({
        baseURL
    });
};

const authApiInstance = createInstance('http://localhost:8080/calendarize/auth')
const userApiInstance = createInstance('http://localhost:8081/calendarize/user')
const projectApiInstance = createInstance('http://localhost:8082/api/projects')
const lifeTasksApiInstance = createInstance('http://localhost:8083/api/life')

export {authApiInstance,userApiInstance,projectApiInstance,lifeTasksApiInstance};
