import API from './axios-client';
import {
  AllWorkspaceResponseType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
} from '@/types/api.type';

export const loginMutationFn = async (data: loginType): Promise<LoginResponseType> => {
  const response = await API.post(`/auth/login`, data);
  console.log(response, '......');

  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/register`, data);

export const logoutMutationFn = async () => await API.post('/auth/logout');

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  const response = await API.get(`/user/current`);
  return response?.data;
};

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async () => {};

export const editWorkspaceMutationFn = async () => {};

export const getWorkspaceByIdQueryFn = async () => {};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceAnalyticsQueryFn = async () => {};

export const changeWorkspaceMemberRoleMutationFn = async () => {};

export const deleteWorkspaceMutationFn = async () => {};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async () => {};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async () => {};

export const editProjectMutationFn = async () => {};

export const getProjectsInWorkspaceQueryFn = async () => {};

export const getProjectByIdQueryFn = async () => {};

export const getProjectAnalyticsQueryFn = async () => {};

export const deleteProjectMutationFn = async () => {};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async () => {};

export const getAllTasksQueryFn = async () => {};

export const deleteTaskMutationFn = async () => {};

