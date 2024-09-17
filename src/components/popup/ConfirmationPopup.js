import './PersonPopup.css';

const ConfirmationPopup = ( {props, onConfirmationClicked} ) =>
{
    const { person, type } = props;

    return <div key='confirmation-popup' className='confirmation-popup'>
        <div>{`Are you sure you want to delete ${person.Name}?`}</div>
        <div className="button bottom">
            <button onClick={() => onConfirmationClicked(true)}>Confirm</button>
            <button onClick={() => onConfirmationClicked(false)}>Cancel</button>
        </div>
    </div>
}

export default ConfirmationPopup;