// src/services/projectService.js
import axios from '../utils/axiosInstance';

export const getEditProjects = async () => {
  const response = await axios.get('/client/editProjects');
  return response.data;
};

export const getViewProjects = async () => {
  const response = await axios.get('/client/viewProjects');
  return response.data;
};

export const createProject = async (projectName) => {
  const response = await axios.get(`/project/create/${encodeURIComponent(projectName)}`);
  return response.data;
};

export const deleteProject = async (projectId) => {
  await axios.get(`/project/delete/${projectId}`);
  return projectId;
};