import './TabColumn.css';

export interface TabDef<K> {
  name: K;
  icon?: any;
  tooltip?: string;
}

interface TabColumnProps<K = string> {
  selected: K;
  tabs: TabDef<K>[];
  onChange(selected: K): void;
}

export default function TabColumn<K>(props: TabColumnProps<K>) {
  return (
    <div className="TabColumn">
      {props.tabs.map((tab) => {
        let className = 'Tab';
        if (tab.name === props.selected) {
          className += ' Selected';
        }
        return (
          <div
            className={className}
            onClick={() => props.onChange(tab.name)}
          ></div>
        );
      })}
    </div>
  );
}
