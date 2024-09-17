import React, { useState } from "react";
import './PersonPopup.css';
import { useFamily } from "../../api/family.hooks";
import PersonPopupFormType from "./PersonPopupFormType";
import SwitchButton from "../buttons/SwitchButton";

const PersonPopupForm = ({ data, onClose }) => {
  const { mutationAddChild, mutationAddParent, mutationAddSpouse, mutationUpdatePerson } = useFamily();
  const { personInfo, event, type } = data;
  const { person } = personInfo;
  const [spouse, setSpouse] = useState(personInfo.spouse);

  const LabelInputField = (label, value, name, props) => {
    return <div key={`popup-${label}`} className="row" {...props}><div>{label}</div><input type='text' id={name} name={label ?? name} defaultValue={value} /></div>
  }
  const LabelValue = (label, value, buttonEl = null) => {
    return <div key={`popup-${label}`} className="row"><div>{label}</div><div>{value}</div>{buttonEl}</div>
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(e.target).entries());

    if (formObject.Name?.length < 2) {
      console.log('Name is required at least 2 characters.');
      return;
    }

    if (!formObject.Nickname?.length) { formObject.Nickname = formObject.Name.split(' ')[0]; }

    switch (type) {
      case PersonPopupFormType.Child:
        formObject.OtherParentId = spouse?.Id;
        mutationAddChild.mutate({ Id: person.Id, child: formObject});
        break;
      case PersonPopupFormType.Parent:
        mutationAddParent.mutate({ Id: person.Id, parent: formObject });
        break;
      case PersonPopupFormType.Spouse:
        mutationAddSpouse.mutate({ Id: person.Id, spouse: formObject });
        break;
      default:
        const p = {...person};
        Object.keys(formObject).forEach((x) => { p[x] = formObject[x]; });
        mutationUpdatePerson.mutate(p);
        break;
      }

      onClose();
  }
  
  const handleRemoveSingleParent = (e) => {
    e.preventDefault();
    setSpouse(null);
  }

  const handleInputName = () => {
    document.getElementsByName('Nickname')[0].value = document.getElementsByName('Name')[0].value.split(' ')[0];
  }

  const isDisabled = [PersonPopupFormType.Father, PersonPopupFormType.Mother, PersonPopupFormType.Spouse].some((x) => x === type);
  const temp = type === PersonPopupFormType.Self
      ? {...person}
      : type === PersonPopupFormType.Spouse
        ? { Gender: person.Gender === 'M' ? 'F' : 'M' }
        : type !== PersonPopupFormType.Child
          ? { Gender: type === PersonPopupFormType.Father ? 'M' : 'F' }
          : {};

  return (
    <form key='poppup-key' className='popup-container' style={{ left: event.pageX - 220, top: event.pageY - 22}} onSubmit={handleSubmit} >
      <div className='content'>
        {LabelInputField('Name', temp?.Name, null, { onChange: handleInputName} )}
        {LabelInputField('Nickname', temp?.Nickname, null)}
        <div key={`popup-`} className="row"><SwitchButton props={{ label: 'Gender', values: ['M', 'F'], defaultValue: temp?.Gender, isDisabled: isDisabled }}/></div>
        {LabelInputField('Born', temp?.DOB, 'DOB')}
        {type === PersonPopupFormType.Child && spouse && LabelValue(person.Gender === 'M' ? 'Mother':'Father', spouse.Name, <button onClick={handleRemoveSingleParent}>X</button>)}
      </div>
      <div className="button bottom">
        <button type='submit'>Update</button>
        <button type='button' onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default PersonPopupForm;