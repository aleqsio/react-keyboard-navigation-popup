import React, {
  useState,
  useMemo,
  KeyboardEvent,
  useCallback,
  useEffect
} from "react";
import BasicActionRow from "./BasicActionRow";
// import BasicActionRow from "./BasicActionRow";
import { distance } from "./stringDistance";
import styles from "./styles.css";
export interface BasicAction {
  label?: string;
  image?: string;
  onClick?: () => void;
}
export type AddtionalResultProps = {
  rating: number;
  keyShortcut: string;
};

type KeyShortcut = () => {
  label: string;
  isPressed: (e: KeyboardEvent) => boolean;
};

type ActionKeyShortcut<MyAction> = (result: {
  index: number;
  action: MyAction;
}) => { label: string; isPressed: (e: KeyboardEvent) => boolean };

export interface Props<MyAction extends BasicAction> {
  renderResultRow?: (result: MyAction & AddtionalResultProps) => Element;
  actions: MyAction[];
  getSearchKeywordsForAction?: (action: MyAction) => string[];
  onActionPress?: (action: MyAction) => void;
  getKeyShortcutForResult?: ActionKeyShortcut<MyAction>;
  getKeyShortcutForOpen?: KeyShortcut;
  getKeyShortcutForClose?: KeyShortcut;
  getRatingForKeywords?: (keywords: string[], searchQuery: string) => number;
  showTopNResults?: number;
}
var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

const defaultGetKeyShortcutForResult = ({
  index
}: {
  index: number;
  action: BasicAction;
}) => {
  return {
    label: (isMac ? "⌘ + " : "ctrl + ") + (index + 1),
    isPressed: (e: KeyboardEvent) =>
      e.key === String(index + 1) && (e.metaKey || e.ctrlKey)
  };
};

const defaultGetKeyShortcutForOpen = () => {
  return {
    label: isMac ? "⌘ + k" : "ctrl + k",
    isPressed: (e: KeyboardEvent) =>
      e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)
  };
};

const defaultGetKeyShortcutForClose = () => {
  return {
    label: "esc",
    isPressed: (e: KeyboardEvent) =>
      (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) ||
      e.key.toLowerCase() === "escape"
  };
};

const defaultGetRatingForKeywords = (
  keywords: string[],
  searchQuery: string
) => {
  const table = searchQuery
    .toLowerCase()
    .split(" ")
    .reduce(
      (acc: number[], query: string) =>
        acc.concat(
          keywords.map(
            keyword =>
              distance(keyword.toLowerCase(), query) /
              Math.max(keyword.length, query.length)
          )
        ),
      []
    );
  const score =
    table.reduce((acc, val) => acc + Math.pow(val, 1 / 10), 0) / table.length;

  return score;
};

export const ShortcutPopup: <MyAction extends BasicAction = BasicAction>(
  p: Props<MyAction>
) => React.ReactElement | null = ({
  renderResultRow = (result: BasicAction & AddtionalResultProps) => (
    <BasicActionRow {...result} />
  ),
  actions,
  getSearchKeywordsForAction = action => (action.label || "").split(" "),
  getKeyShortcutForResult = defaultGetKeyShortcutForResult,
  getKeyShortcutForOpen = defaultGetKeyShortcutForOpen,
  getKeyShortcutForClose = defaultGetKeyShortcutForClose,
  getRatingForKeywords = defaultGetRatingForKeywords,
  onActionPress = (action: BasicAction) => action.onClick?.(),
  showTopNResults = 5
}) => {
  const [shown, setShown] = useState(false);
  const [search, setSearch] = useState("");

  const getItemsForSearchQuery = (searchQuery: string) => {
    if (!searchQuery) return [];
    return actions
      .map(item => ({
        ...item,
        rating: getRatingForKeywords(
          getSearchKeywordsForAction(item),
          searchQuery
        )
      }))
      .sort((a, b) => -b.rating + a.rating)
      .slice(0, showTopNResults);
  };

  const foundResults = useMemo(() => {
    return getItemsForSearchQuery(search).map((action, index) => ({
      ...action,
      keyShortcut: getKeyShortcutForResult({ index, action }).label
    }));
  }, [search]);

  useEffect(() => {
    !shown && setSearch("");
  }, [shown]);

  const executeResultAction = (result: any) => {
    setShown(false);
    onActionPress(result);
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<Element>) => {
      if (!shown && getKeyShortcutForOpen().isPressed(e)) {
        setShown(shown => !shown);
        e.preventDefault();
        return;
      }
      if (!shown) return;
      if (shown && getKeyShortcutForClose().isPressed(e)) {
        setShown(false);
        e.preventDefault();
        return;
      }
      foundResults.forEach((value, index) => {
        if (
          getKeyShortcutForResult({
            index: index,
            action: value
          }).isPressed(e)
        ) {
          executeResultAction(value);
          e.preventDefault();
          return;
        }
      });
      if (e.key === "Enter" && !document?.querySelector(".result:focus")) {
        if (foundResults[0]) {
          executeResultAction(foundResults[0]);
        } else {
          setShown(false);
        }
      }
      if (e.keyCode === 38 || e.keyCode === 40) {
        if (document?.querySelector(".result:focus")) {
          (document?.querySelector(".result:focus")?.[
            e.keyCode === 38 ? "previousSibling" : "nextSibling"
          ] as HTMLElement)?.focus();
        } else {
          if (e.keyCode === 40) {
            (document
              ?.querySelectorAll(".result")
              .item(1) as HTMLElement)?.focus();
          }
        }
        e.preventDefault();
        return;
      }
      if (/^[A-Z0-9]$/i.test(e.key)) {
        (document?.querySelector(".searchInput") as HTMLElement)?.focus();
      }
    },
    [
      foundResults,
      shown,
      getKeyShortcutForOpen,
      getKeyShortcutForClose,
      getKeyShortcutForResult
    ]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress as any);
    return () => window.removeEventListener("keydown", handleKeyPress as any);
  }, [handleKeyPress]);

  if (!shown) return null;
  return (
    <div className={styles.popupContainer} onClick={() => setShown(false)}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          className={`searchInput ${styles.searchInput}`}
          tabIndex={-1}
          onChange={e => setSearch(e.target.value)}
        />
        {foundResults.map((result, index) => (
          <button
            key={index}
            tabIndex={5000 + 1 + index}
            className={`result  ${styles.result}`}
            onClick={() => executeResultAction(result)}
          >
            {renderResultRow(result)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShortcutPopup;
