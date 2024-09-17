import React, { useEffect, useState } from "react";
import './switchButton.css';

const SwitchButton = ({ props }) => {
    const { label, values, defaultValue, name = props.name ?? label, isDisabled } = props;
    const [isChecked, setChecked] = useState(defaultValue === values[1]);

    useEffect(() => {
        document.getElementById(`toggle-switch-label-${name}`).setAttribute(`data-${isChecked ? 'before':'after'}-content`, isChecked ? values[1] : values[0]);
        document.getElementById(`toggle-switch-hidden-${name}`).value = isChecked ? values[1] : values[0];
    }, [isChecked, name, values]);

    return <>
            <div>{label}</div>
            <div className='switch-button-container'>
                <input id={`toggle-switch-${name}`} type='checkbox' onChange={() => setChecked(!isChecked)} defaultChecked={isChecked} disabled={isDisabled ? 'disabled':''} />
                <label id ={`toggle-switch-label-${name}`} htmlFor={`toggle-switch-${name}`}></label>
                <input id={`toggle-switch-hidden-${name}`} type='hidden' name={name} />
            </div>
        </>;
}

export default SwitchButton;