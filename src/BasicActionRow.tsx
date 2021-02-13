import React, {
  FunctionComponent,
} from "react";
import { BasicAction } from "./ShortcutPopup";
import styles from "./styles.css";
interface Props extends BasicAction { rating: number; keyShortcut: string }


const BasicActionRow: FunctionComponent<Props> = ({
  label,
  image,
  keyShortcut
}) => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={image} />

      <div className={styles.keyCombinationIndicator}>{keyShortcut}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};


export default BasicActionRow;
