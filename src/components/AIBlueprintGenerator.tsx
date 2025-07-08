
import { IntelligenceCores } from './IntelligenceCores';

interface AIBlueprintGeneratorProps {
  className?: string;
}

export const AIBlueprintGenerator = ({ className = "" }: AIBlueprintGeneratorProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <IntelligenceCores />
    </div>
  );
};
