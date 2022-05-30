import {useState} from 'react';
import MapTabState from './MapTab';
import {PaintbrushUi} from './tool/Paintbrush';
import './Sidebar.css';
import TabColumn, {TabDef} from './TabColumn';
import {faMap, faPaintbrush} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  tabState: MapTabState;
}

type Tab = 'map-settings' | 'paintbrush';

export default function Sidebar(props: SidebarProps) {
  const [selected, setSelected] = useState<Tab>('paintbrush');

  const tabs: TabDef<Tab>[] = [
    {
      name: 'map-settings',
      icon: faMap,
      tooltip: 'Map settings',
    },
    {
      name: 'paintbrush',
      icon: faPaintbrush,
      tooltip: 'Paintbrush',
    },
  ];

  return (
    <div className="Sidebar">
      <TabColumn<Tab> selected={selected} onChange={setSelected} tabs={tabs} />
      <div className="ContentColumn">
        {(() => {
          switch (selected) {
            case 'map-settings':
              return <div></div>;
            case 'paintbrush':
              return <PaintbrushUi state={props.tabState.state} />;
          }
        })()}
      </div>
    </div>
  );
}
