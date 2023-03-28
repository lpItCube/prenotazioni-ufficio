import React from 'react'
import Select from '../Ui/Select'
import Option from '../Ui/Option'


interface CreateActionProps {
    refState: any,
    label: string,
    defaultSelect: string,
    selectObj: {
        label: string,
        value: string
    },
    handleSelect: () => any,
    openOption: boolean,
    setSelect: (selectObj: { label: string, value: string }) => void,
    optionList: any
}

function CreateAction(props:CreateActionProps) {
    const {
        refState,
        label,
        defaultSelect,
        selectObj,
        handleSelect,
        openOption,
        setSelect,
        optionList
    } = props
    return (
        <>
            <Select
                label={label}
                value={selectObj ? selectObj.label : defaultSelect}
                onClick={() => handleSelect}
                openOption={openOption}
                refState={refState}
            >
                <Option
                    key="domain-empty"
                    onClick={() => setSelect({label: defaultSelect, value:''})}
                    label={defaultSelect}
                    className=""
                />
                {optionList.map((domain: any, key: number) =>
                    <Option
                        key={key}
                        onClick={() => setSelect({ label: domain.name, value: domain.id })}
                        label={domain.name}
                        className=""
                    />
                )}
            </Select>
        </>
    )
}

export default CreateAction