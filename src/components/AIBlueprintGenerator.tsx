
import { BusinessOSGraph } from './business-os/BusinessOSGraph';

interface AIBlueprintGeneratorProps {
  className?: string;
}

export const AIBlueprintGenerator = ({ className = "" }: AIBlueprintGeneratorProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <BusinessOSGraph />
    </div>
  );
};
