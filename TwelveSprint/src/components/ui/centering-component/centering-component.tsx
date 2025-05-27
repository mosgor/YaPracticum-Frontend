import { FC, memo } from 'react';
import { TCenteringComponentUI } from './type';
import styles from './centering-component.module.css';

export const CenteringComponentUI: FC<TCenteringComponentUI> = memo(
  ({ title, titleStyle, children }) => (
    <>
      <div className={styles.center}>
        <div className={styles.headerCenter}>
          <h3 className={`text ${titleStyle}`}>{title}</h3>
        </div>
        <div>{children}</div>
      </div>
    </>
  )
);
