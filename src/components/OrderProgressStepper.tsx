import React from 'react';
import { CheckCircle2, ChefHat, Truck, PackageCheck, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface Step {
  name: string;
  icon: LucideIcon;
}

const defaultSteps: Step[] = [
  { name: "Order Confirmed", icon: CheckCircle2 },
  { name: "Processing", icon: ChefHat },
  { name: "Out for Delivery", icon: Truck },
  { name: "Delivered", icon: PackageCheck },
];

interface OrderProgressStepperProps {
  /** Zero-based index of the current active step. E.g., 0 for the first step. */
  currentStepIndex: number;
  /** Optional array of steps. Defaults to a standard 4-step order process. */
  steps?: Step[];
}

const OrderProgressStepper: React.FC<OrderProgressStepperProps> = ({
  currentStepIndex,
  steps = defaultSteps,
}) => {
  console.log('OrderProgressStepper loaded, current step index:', currentStepIndex);

  if (!steps || steps.length === 0) {
    return null; // Or a placeholder for empty steps
  }

  return (
    <div className="flex w-full items-center justify-between p-2 sm:p-4" aria-label="Order Progress">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;
        const isPending = index > currentStepIndex;
        const isLastStep = index === steps.length - 1;

        return (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center text-center min-w-[60px] sm:min-w-[80px] md:min-w-[100px]">
              <div
                className={clsx(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 mb-1 sm:mb-2 transition-all duration-300 ease-in-out",
                  {
                    "bg-green-500 border-green-600 text-white": isCompleted,
                    "bg-indigo-600 border-indigo-700 text-white ring-4 ring-indigo-300/50 scale-105": isActive,
                    "bg-gray-100 border-gray-300 text-gray-400": isPending,
                  }
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p
                className={clsx("text-xs sm:text-sm font-medium leading-tight", {
                  "text-green-700": isCompleted,
                  "text-indigo-700 font-semibold": isActive,
                  "text-gray-500": isPending,
                })}
              >
                {step.name}
              </p>
            </div>

            {!isLastStep && (
              <div
                className={clsx(
                  "flex-1 h-0.5 sm:h-1 rounded mx-1 sm:mx-2", // Line connecting steps
                  {
                    "bg-green-500": isCompleted, // Line is green if emanating from a completed step
                    "bg-gray-300": isActive || isPending, // Line is gray if emanating from an active or pending step
                  }
                )}
                role="separator"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderProgressStepper;