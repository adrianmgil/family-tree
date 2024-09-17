import React, { useState } from "react";
import './PersonPopup.css';
import PersonPopupFormType from "./PersonPopupFormType";
import { useFamily } from "../../api/family.hooks";
import ConfirmationPopup from "./ConfirmationPopup";

const PersonPopup = ({ data, onPopupCloseClicked, onEditClicked }) => {
  const { mutationDeletePerson } = useFamily();
  const [confirmationPopup, setConfirmationPopup] = useState(null);
  const { person, father, mother, spouse, isEdit } = data;
  const hasBothParent = mother && father;

  const LabelValue = (label, value, buttonEl = null) => {
    return <div key={`popup-${label}`} className="row"><div>{label}</div><div>{value}</div>{isEdit && buttonEl}</div>
  }
  
  const onAddOrRemoveClicked = (e, personSelected, type) => {
    if (personSelected) {
      setConfirmationPopup({ personSelected, type });
      return;
    }

    onEditClicked(e, type);
  }
  
  const onConfirmationClicked = (result) => {
    setConfirmationPopup(null);
    if (result) {
      mutationDeletePerson.mutate(person.Id);
      onPopupCloseClicked();
    }
  }

  return (
    <div key='person-popup' className='popup-container' style={{ left: data.event.pageX, top: data.event.pageY }}>
      <div className='content'>
        <div className='name'><div>{person.Name}</div></div>{isEdit && <button onClick={(e) => onEditClicked(e, PersonPopupFormType.Self)}>Edit</button>}
        {LabelValue('Born', person.DOB)}
        {LabelValue('Father', `${father?.Name ?? ''}`, (!father || hasBothParent || mother) && <button onClick={(e) => onAddOrRemoveClicked(e, father, PersonPopupFormType.Father)}>{father ? '-':'+'}</button>)}
        {LabelValue('Mother', `${mother?.Name ?? ''}`, (!mother || hasBothParent || father) && <button onClick={(e) => onAddOrRemoveClicked(e, mother, PersonPopupFormType.Mother)}>{mother ? '-':'+'}</button>)}
        {LabelValue('Children', person.Children?.length ?? 0, <button onClick={(e) => onAddOrRemoveClicked(e, null, PersonPopupFormType.Child)}>+</button>)}
        {LabelValue('Spouse', `${spouse?.Name ?? ''}`, !spouse && <button onClick={(e) => onAddOrRemoveClicked(e, null, PersonPopupFormType.Spouse)}>+</button>)}
      </div>
      {isEdit && <div className="button bottom"><button onClick={(e) => onAddOrRemoveClicked(e, person, PersonPopupFormType.Self)}>Remove</button></div>}
      <div className="button bottom"><button onClick={onPopupCloseClicked}>Close</button></div>
      {confirmationPopup && <ConfirmationPopup props={confirmationPopup} onConfirmationClicked={onConfirmationClicked} />}
    </div>
  );
};

export default PersonPopup;