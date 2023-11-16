import { useQuery, UseQueryResult, UseMutationResult, useMutation } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'

export interface Folder {
    id: number
    name: string
    user_id: number
}

export const fetchFolders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/folder`);
      console.log('Successfully fetched all folders: ', response.data );
      return response.data;
    } catch (error) {
      console.error('Error fetching data: ', error);
      throw error;
    }
  };
  
  export const useFolders = (): UseQueryResult<Folder[], Error> => {
    return useQuery('folders', fetchFolders);
  };


  export const createFolder = async (userId: number, folderName: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/folder/`, { userId, name: folderName });
      console.log('Folder created: ', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating folder: ', error);
      throw error;
    }
  };
  
  export const useCreateFolder = (): UseMutationResult<Folder, Error, { userId: number; folderName: string }> => {
    return useMutation((params: { userId: number; folderName: string }) => createFolder(params.userId, params.folderName));
  };

  export const deleteFolder = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/folder/${id}`);
      console.log('Successfully deleted folder!');
    } catch (error) {
      console.error('Error deleting folder: ', error);
      throw error;
    }
  };
  
  export const useDeleteFolder = (): UseMutationResult<void, Error, number> => {
    return useMutation(deleteFolder);
  };