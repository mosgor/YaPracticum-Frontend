import { FC, memo, useEffect, useState } from 'react';
import { CenteringComponentUI } from '../ui/centering-component';
import { TCentering } from './type';
import { useLocation } from 'react-router-dom';

export const CenteringComponent: FC<TCentering> = memo(
  ({ title, children }) => {
    const location = useLocation();
    const [titleStyle, setTitleStyle] = useState('text_type_main-large');

    useEffect(() => {
      if (/feed|profile/i.test(location.pathname)) {
        setTitleStyle('text_type_digits-default');
      }
    }, []);

    return (
      <>
        <CenteringComponentUI
          title={title}
          titleStyle={titleStyle}
          children={children}
        />
      </>
    );
  }
);
