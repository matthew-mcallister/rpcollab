import {useState} from 'react';
import MapTabState, {MapCommonProps} from './MapTab';
import {PaintbrushUi} from './tool/Paintbrush';
import './Sidebar.css';
import TabColumn, {TabDef} from './TabColumn';
import {faMap, faPaintbrush} from '@fortawesome/free-solid-svg-icons';
import MapSettingsUi from './MapSettings';

interface SidebarProps extends MapCommonProps {
  tabState: MapTabState;
}

type Tab = 'map-settings' | 'paintbrush';

export default function Sidebar(props: SidebarProps) {
  const [selected, setSelected] = useState<Tab>('paintbrush');

  const state = props.tabState.state;

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
                return <MapSettingsUi state={state} {...props} />;
              case 'paintbrush':
                return <PaintbrushUi state={state} {...props} />;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
