import { type FC } from 'react';

export interface InvalidConfigurationProps {
  className?: string;
}

const InvalidConfiguration: FC<InvalidConfigurationProps> = ({ className }) => {
  return <div className={className}>Please enter a valid setting</div>;
};

InvalidConfiguration.displayName = 'InvalidConfiguration';

export default InvalidConfiguration;
