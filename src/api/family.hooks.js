import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddChild, AddParent, AddSpouse, DeletePerson, GetAll, UpdatePerson } from "./family.api";

const queryKey = ['qkFamily'];

export const useFamily = () => {
    const queryClient = new useQueryClient();
    const query = useQuery(queryKey, () => GetAll(),
    {
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const FamilyResponse = (messageAction, invalidateQuery = true) => {
        return {
            onSuccess: () => { invalidateQuery && queryClient.invalidateQueries({ queryKey: queryKey }); },
            onError: (error) => { console.log(messageAction + 'ing Failed:'); console.log(error); invalidateQuery && queryClient.invalidateQueries({ queryKey: queryKey}); },
        };
    }

    const mutationAddChild = useMutation(queryKey, (data) => AddChild(data.Id, data.child), FamilyResponse('Child Add'));
    const mutationAddParent = useMutation(queryKey, (data) => AddParent(data.Id, data.parent), FamilyResponse('Parent Add'));
    const mutationAddSpouse = useMutation(queryKey, (data) => AddSpouse(data.Id, data.spouse), FamilyResponse('Spouse Add'));
    const mutationUpdatePerson = useMutation(queryKey, (person) => UpdatePerson(person), FamilyResponse('Person Updat'));
    const mutationDeletePerson = useMutation(queryKey, (personId) => DeletePerson(personId), FamilyResponse('Person Remov'));

    return { query, mutationAddChild, mutationAddParent, mutationAddSpouse, mutationUpdatePerson, mutationDeletePerson };
}   