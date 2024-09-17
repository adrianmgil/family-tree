import { get, post, put, remove } from './query';

const baseApiUrl = 'https://localhost:44318/family';

export const GetAll = async () => {
    return await get(baseApiUrl);
}

export const AddChild = async (parentId, person) => {
    return await post(baseApiUrl + `/child/${parentId}`, person);
}

export const AddParent = async (childId, person) => {
    return await post(baseApiUrl + `/parent/${childId}`, person);
}

export const AddSpouse = async (personId, spouse) => {
    return await post(baseApiUrl + `/spouse/${personId}`, spouse);
}

export const UpdatePerson = async (person) => {
    return await put(baseApiUrl + `/person/${person.Id}`, person);
}

export const DeletePerson = async (personId) => {
    return await remove(baseApiUrl + `/person/${personId}`);
}