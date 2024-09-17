import React, { useRef } from 'react';
import './person.css';

const Person = (props) => {

    const person = props.person;
    const timer = useRef(null);

    const onPersonClicked = () => {
        clearTimeout(timer.current);
        if (props.onPersonClicked) {
            props.onPersonClicked(person.Id);
        }
    }
    
    const onEditClicked = (e) => {
        clearTimeout(timer.current);
        if (props.onEditClicked)
            props.onEditClicked(e);
    }

    const onPersonPopup = (e) => {
        clearTimeout(timer.current);
        if (props.onPersonPopup) {
            props.onPersonPopup(e);
        }
    }

    return person && person.Id &&
        <div key={person.id} className={`person ${person.Gender}`} style={ props.styles }>
            <div
                className="icon"
                id={`p${person.Id}`}
                onClick={onPersonClicked}
                onMouseEnter={(e) => { timer.current = setTimeout(() => onPersonPopup(e), 1000); } }
                onMouseLeave={() => clearTimeout(timer.current)}
            />
            <div className='name' onClick={onEditClicked}>{person.Nickname}</div>
            <div className='Box' id={`b${person.Id}`}>
                <div></div>
                <div></div>
            </div>
        </div>;
}

export default Person;