import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface StepperProps {
  stepperState?: number
}

const StepOne: React.FC = (): JSX.Element => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? {} : { duration: 0.5 }
    },
    hidden: {
      opacity: 0,
      y: 50,
      transition: shouldReduceMotion ? {} : { duration: 0.5 }
    }
  };
  
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="hidden">
      <h2>Step One</h2>
      <p>This is the first step</p>
    </motion.div>
  );
};

const StepTwo : React.FC = (): JSX.Element => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? {} : { duration: 0.5 }
    },
    hidden: {
      opacity: 0,
      y: 50,
      transition: shouldReduceMotion ? {} : { duration: 0.5 }
    }
  };
  
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="hidden">
      <h2>Step Two</h2>
      <p>This is the second step</p>
    </motion.div>
  );
};

const Stepper: React.FC<StepperProps> = (props): JSX.Element => {
  const { stepperState } = props
  
  return (
    <div>
      <AnimatePresence>
        {stepperState === 1 && <StepOne key="step-one" />}
        {stepperState === 2 && <StepTwo key="step-two" />}
      </AnimatePresence>
    </div>
  );
};

export default Stepper