import { useState, useEffect } from 'react'
import Select from '../Ui/Select'
import Option from '../Ui/Option'
import Button from '../Ui/Button'
import { TbEdit } from "react-icons/tb";
import { Colors } from '../Ui/Colors';
import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, DirectionMode, StepperState } from '../../_shared';
import { motion, AnimatePresence } from 'framer-motion';
import TabBar from '../Ui/TabBar';
import { ITabButton } from '../../types';
import Input from '../Ui/Input';
import { IoAddCircleOutline } from "react-icons/io5";
import { RiDeleteBin3Line } from "react-icons/ri"


type OptionItem = {
  value: string,
  label: string
}

interface CreateActionProps {
  refState: any,
  label: string,
  defaultSelect: string,
  selectObj: {
    label: string,
    value: string
  },
  openOption: boolean,
  optionList: any,
  isActive: boolean,
  currentStepper: number,
  stepperState: number,
  createName: string,
  direction: number,
  setDirection: (num: number) => void,
  setCreateName: (name: string) => void,
  handleCreation: (type: number) => any,
  handleSelect: () => any,
  setSelect: (selectObj: { label: string, value: string }) => void,
  setStepperState: (num: number) => void,
  setSelectedDomain: (item: OptionItem) => void,
  setSelectedOffice: (item: OptionItem) => void,
  setSelectedRoom: (item: OptionItem) => void,
}

const enum FormMethod {
  SELEZIONA,
  AGGIUNGI
}

function CreateAction(props: CreateActionProps) {
  const {
    refState,
    label,
    defaultSelect,
    selectObj,
    openOption,
    optionList,
    isActive,
    currentStepper,
    stepperState,
    createName,
    direction,
    setDirection,
    handleCreation,
    setCreateName,
    handleSelect,
    setSelect,
    setStepperState,
    setSelectedDomain,
    setSelectedOffice,
    setSelectedRoom
  } = props

  const [method, setMethod] = useState<number>(FormMethod.SELEZIONA)
  const [isDisabledSelect, setIsDisabledSelect] = useState<boolean>(false)

  useEffect(() => {
    console.log('OPT',optionList)
    if(optionList.length > 0) {
      setIsDisabledSelect(false)
      setMethod(FormMethod.SELEZIONA)
    } else {
      setIsDisabledSelect(true)
      setMethod(FormMethod.AGGIUNGI)
    }
  }, [optionList])

  const containerVariants = {
    initial: {
      opacity: 0,
      x: direction === DirectionMode.POSITIVE ? '100%' : '-100%',
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      x: direction === DirectionMode.POSITIVE ? '-100%' : '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const labelVariants = {
    initial: {
      opacity: 0,
      y: direction === DirectionMode.POSITIVE ? -8 : 8,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      y: direction === DirectionMode.POSITIVE ? 8 : -8,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const buttonEnter = {
    initial: {
      scale: 0,
      opacity:0
    },
    animate: {
      scale: 1,
      opacity:1,
      transition: {
        delay:0.2,
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      scale: 0,
      opacity:0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    }
  }

  const tabButton: ITabButton[] = [
    { text: 'Seleziona', value: FormMethod.SELEZIONA, disabled:isDisabledSelect }, 
    { text: 'Aggiungi', value: FormMethod.AGGIUNGI, disabled:false }
  ]

  const toggleMethod = (tab: number) => {
    setMethod(tab)
  }

  const placeholder: string = stepperState === StepperState.DOMAIN
    ? 'Aggiungi un dominio'
    : stepperState === StepperState.OFFICE
      ? 'Aggiungi un ufficio'
      : stepperState === StepperState.ROOM
        ? 'Aggiungi una stanza'
        : ''

  return (
    <AnimatePresence>
      
      {isActive
        ? (
          <div
            className="creation-stepper__modal-wrapper"
            key={currentStepper}
          >
            <motion.div
              className='creation-stepper__modal-container'
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h3
                className='creation-stepper__modal-title'
              >
                {label}
              </h3>
              <div className='creation-stepper__actions-wrapper'>
                <TabBar
                  tabButton={tabButton}
                  onClick={toggleMethod}
                  currentTab={method}
                />
                <div className={`creation-stepper__actions-container${createName ? ' w-cta' : ''}`}>
                  {method === FormMethod.SELEZIONA
                    ? (
                      <Select
                        label={''}
                        value={selectObj ? selectObj.label : defaultSelect}
                        onClick={() => handleSelect}
                        openOption={openOption}
                        refState={refState}
                      >
                        {optionList.map((domain: any, key: number) =>
                          <Option
                            key={key}
                            onClick={() => setSelect({ label: domain.name, value: domain.id })}
                            label={domain.name}
                            className=""
                          />
                        )}
                      </Select>
                    )
                    : (
                      <>
                        <Input
                          label={''}
                          value={createName}
                          onChange={setCreateName}
                          placeholder={placeholder}
                        />
                        <AnimatePresence>
                          {createName &&
                            <motion.div
                              className='creation-stepper__actions-cta'
                              variants={buttonEnter}
                              key='cta'
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            >
                              <Button
                                onClick={() => handleCreation(currentStepper)}
                                className={`cta cta--primary cta__icon${!createName ? ' disabled' : ''}`}
                                type='button'
                                icon={<IoAddCircleOutline size={20} color={Colors.white} />}
                                text={''}
                                disabled={!createName}
                              />
                            </motion.div>
                          }
                        </AnimatePresence>
                      </>
                    )
                  }


                </div>
              </div>
            </motion.div>
          </div>
        )
        : selectObj.label !== defaultSelect && stepperState >= currentStepper
          ? (
            <motion.div
              variants={labelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className='creation-stepper__box'
            >
              <RiDeleteBin3Line 
                className="creation-stepper__box--remove" 
                size={32} 
                color={Colors.white} 
                onClick={() => {
                  setDirection(DirectionMode.NEGATIVE)
                  setMethod(FormMethod.SELEZIONA)
                  setTimeout(() => {
                    setStepperState(currentStepper)
                    if (currentStepper === StepperState.DOMAIN) {
                      setSelectedDomain(DEFAULT_DOMAIN_VALUE)
                    } else if (currentStepper === StepperState.OFFICE) {
                      setSelectedOffice(DEFAULT_OFFICE_VALUE)
                      setSelectedRoom(DEFAULT_ROOM_VALUE)
                    } else if (currentStepper === StepperState.ROOM) {
                      setSelectedRoom(DEFAULT_ROOM_VALUE)
                    }
                  },100)
                }}
              />
              <div className='creation-stepper__box--title'>
                <p
                  className="select__label label"
                >
                  {label}
                </p>
                <p>
                  {selectObj.label}
                </p>
              </div>
            </motion.div>
          )
          : (
            null
          )
      }

    </AnimatePresence>
  )
}

export default CreateAction