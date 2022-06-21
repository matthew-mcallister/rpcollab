import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './TabColumn.css';

export interface TabDef<K> {
  name: K;
  icon?: IconDefinition;
  tooltip?: string;
}

interface TabColumnProps<K = string> {
  selected: K;
  tabs: TabDef<K>[];
  onChange(selected: K): void;
  collapsed?: boolean;
  onCollapse?(): void;
}

export default function TabColumn<K>(props: TabColumnProps<K>) {
  return (
    <div className="TabFlex">
      <div className="TabSection">
        {props.tabs.map((tab, i) => {
          let className = 'Tab';
          if (tab.name === props.selected) {
            className += ' Selected';
          }
          return (
            <div
              key={i}
              className={className}
              onClick={() => props.onChange(tab.name)}
              title={tab.tooltip}
            >
              <FontAwesomeIcon className="Icon" icon={tab.icon} />
            </div>
          );
        })}
      </div>
      <div className="TabSection">
        <div className="Tab" onClick={props.onCollapse}>
          <FontAwesomeIcon
            className="Icon"
            icon={props.collapsed ? faAngleLeft : faAngleRight}
          />
        </div>
      </div>
    </div>
  );
}
