import { data as dataFromFile } from "./data";
import Person from "./components/person/Person";
import { useEffect, useState } from "react";
import PersonPopup from "./components/popup/PersonPopup";
import './familytree.css'
import { useFamily } from "./api/family.hooks";
import PersonPopupForm from "./components/popup/PersonPopupForm";
import PersonPopupFormType from "./components/popup/PersonPopupFormType";

const DrawTree = (selectedId = 1) => {

    const [id, setId] = useState(1);
    const [personPopup, setPersonPopup] = useState(null);
    const [personForm, setPersonForm] = useState(null);
    const { query } = useFamily();
    const [data, setData] = useState([]);
    const html = [];
    const personList = [];

    const BuildParentFromChildren = () => {
        data.forEach((p) => {
            (p.Children ?? []).forEach((childId) => {
                const child = data.find((x) => x.Id === childId);
                if (child) {
                    if (p.Gender === 'M') child.Father = p.Id;
                    if (p.Gender === 'F') child.Mother = p.Id;
                }
            });
        });
    }
           
    const BuildParents = (person, genders = '', divs = []) => {
        if (genders.length === 4) return;

        const father = person && GetPersonById(person.Father);
        const mother = person && GetPersonById(person.Mother)

        divs[genders.length-1] = divs[genders.length-1] ?? [];
        divs[genders.length-1].push(<div key={`${genders}`} genders={`${genders}`} style={{ display: 'inline-flex' }}>{CreatePerson(father)}{CreatePerson(mother)}</div>);

        if (person && genders.length === divs[genders.length-1].length) {
            html.unshift(<div key={`parent${person.Id}`} level={genders.length}>{divs[genders.length-1]}</div>);
         }

         BuildParents(father, genders + 'M', divs);
         BuildParents(mother, genders + 'F', divs);
    }

    const BuildPersonBundle = (person) => {
        const divs = [];

        divs.push(CreatePerson(person));
        if (person.Gender === 'F') divs.unshift(BuildSpouses(person)); else divs.push(BuildSpouses(person));
        divs.push(BuildChildren(person));

        return <div key={`box${person.Id}`} style={{ display: 'inline-block', verticalAlign: 'top', margin: '0px 10px' }}>{divs}</div>;
    }

    const BuildSpouses = (person) => { return CreatePerson(GetPersonById(person.Spouse)); }

    const BuildChildren = (person) => {
        const divs = [];
        (person.Children ?? []).forEach((childId) => {
            const child = GetPersonById(childId);
            if (child) divs.push(BuildPersonBundle(child));
        });
        return <div key={`chidren${person.Id}`} style={{ display: 'block' }}>{divs}</div>;
    }

    const BuildSiblings = (person) => {
        const father = GetPersonById(person.Father);
        const mother = GetPersonById(person.Mother)
        const childrenF = (father && father.Children) ?? [];
        const childrenM = (mother && mother.Children) ?? [];
        const siblings = [...new Set([...childrenF, ...childrenM])].filter((x) => x !== person.Id);

        siblings.forEach((s) => {
            html.push(BuildPersonBundle(GetPersonById(s)));
        });
    }

    const GetPersonById = (id) => { return id ? data.find((x) => x.Id === id) : null; }

    const CreatePerson = (person, styles = {}) => {
        if (!person) return;
        personList.push(person);
        return <Person
                key={`${person.Id}`}
                person={person}
                styles={styles}
                onPersonClicked={() => onPersonClicked(person.Id)}
                onPersonPopup={(e) => ShowPersonPopup(person, false, e)}
                onEditClicked={(e) => ShowPersonPopup(person, true, e)}
            />;
    }

    const DrawLines = () => {
        const lineAdded = [];
        const sortPersonList = [...new Set([...personList.filter((x) => x.Gender === 'M'), ...personList.filter((x) => x.Gender === 'F')])];
        sortPersonList.forEach((person) => {
            const p1 = document.getElementById(`p${person.Id}`)
            if (p1) {
                const rect1 = p1.getBoundingClientRect();
                const personChildren = data.find((x) => x.Id === person.Id)?.Children ?? [];
                const sposeChildren = data.find((x) => x.Id === person.Spouse)?.Children;
                personChildren.forEach((cId) => {
                    const p2 = document.getElementById(`p${cId}`)
                    if (p2 && !lineAdded.some((x) => x === cId)) {
                        lineAdded.push(cId);
                        const rect2 = p2.getBoundingClientRect();
                        const line = document.getElementById(`b${cId}`);
                        const isStepChild = sposeChildren && !sposeChildren.some((x) => x === cId);

                        line.style.display = 'block';
                        if (isStepChild) {
                            line.style.color = 'mediumpurple';
                            line.style.marginTop = '-58px';
                        }

                        if (rect1.x - rect2.x >= -5) { // right side
                            line.style.width = (rect1.x - rect2.x + rect2.width/2 + 1 + (isStepChild ? -10 : 0)) + 'px';
                            line.style.left = `${rect2.x + 10 + document.documentElement.scrollLeft}px`;
                            line.classList.remove('RightSide');
                            line.classList.add('LeftSide');
                        }else {
                            line.style.width = (rect2.x - rect1.x - rect2.width/2 + 6 + (isStepChild ? 10 : 0)) + 'px';
                            line.style.left = (rect1.x + 20 + document.documentElement.scrollLeft+ (isStepChild ? -10 : 0)) + 'px';
                            line.classList.remove('LeftSide');
                            line.classList.add('RightSide');
                        }
                    }
                });
            }
        });
    }

    const onPersonClicked = (id) => {
        setId(id)
        setPersonPopup(null);
    }

    const ShowPersonPopup = (person, isEdit, e) => {
        const father = GetPersonById(person.Father);
        const mother = GetPersonById(person.Mother);
        const spouse = GetPersonById(person.Spouse);
        setPersonPopup({ person: person, father: father, mother: mother, spouse: spouse, isEdit: isEdit, event: e, });
    }

    const onEditClicked = (event, type = PersonPopupFormType.Self) => {
        setPersonForm({ personInfo: personPopup, event: event, type: type });
        setPersonPopup(null);
    }
    
    const BuildTree = () => {
        console.log('render');

        html.length = 0;
        personList.length = 0;
        if (data.length === 0) return null;
        BuildParentFromChildren();

        const person = GetPersonById(id);
        html.push(BuildParents(person, person.Gender));
        html.push(BuildPersonBundle(person));
        BuildSiblings(person);
        html.push(<div key='personPopup'>{personPopup && <PersonPopup data={ personPopup } onPopupCloseClicked={() => setPersonPopup(null)} onEditClicked={(e, type) => onEditClicked(e, type)} />}</div>);
        html.push(<div key='personPopupForm'>{personForm && <PersonPopupForm data={personForm} onClose={() => setPersonForm(null)} />}</div>);
        return html;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => DrawLines(id), [id, data]);
    useEffect(() => {
        if (!query.isLoading) {
            setData(query.data ?? dataFromFile);
            setData((prevState) => { return prevState });
        }
    }, [query]);

    return data?.length ? BuildTree() : null;
}

export default DrawTree;