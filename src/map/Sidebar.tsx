import './Sidebar.css';

import {useState} from 'react';
import {PaintbrushUi} from './tool/Paintbrush';
import TabColumn, {TabDef} from './TabColumn';
import {faMap, faPaintbrush} from '@fortawesome/free-solid-svg-icons';
import MapSettingsUi from './MapSettings';

interface SidebarProps {}

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
        <div className="ContentContainer">
          {(() => {
            switch (selected) {
              case 'map-settings':
                return <MapSettingsUi />;
              case 'paintbrush':
                return <PaintbrushUi />;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
