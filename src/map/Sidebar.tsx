import './Sidebar.css';
import {useState} from 'react';
import {PaintbrushUi} from './tool/Paintbrush';
import TabColumn, {TabDef} from './TabColumn';
import {faFill, faMap, faPaintbrush} from '@fortawesome/free-solid-svg-icons';
import MapSettingsUi from './MapSettings';
import {PaintBucketUi} from './tool/PaintBucket';
import {ToolName} from './tool/Toolbox';
import useMapContext from './hooks/useMapContext';

interface SidebarProps {}

type Tab = {
  tool?: ToolName;
};

const MAP_SETTINGS: TabDef<Tab> = {
  icon: faMap,
  tooltip: 'Map settings',
  value: {},
};
const PAINTBRUSH: TabDef<Tab> = {
  icon: faPaintbrush,
  tooltip: 'Paintbrush',
  value: {tool: 'paintbrush'},
};
const PAINT_BUCKET: TabDef<Tab> = {
  icon: faFill,
  tooltip: 'Paint bucket',
  value: {tool: 'paintBucket'},
};

const TABS: TabDef<Tab>[] = [MAP_SETTINGS, PAINTBRUSH, PAINT_BUCKET];

export default function Sidebar(props: SidebarProps) {
  const [selected, setSelected] = useState<Tab>(PAINTBRUSH.value);
  const [collapsed, setCollapsed] = useState(false);

  const ctx = useMapContext();
  const toolbox = ctx.map.state.toolbox;

  function selectTab(tab: Tab) {
    setSelected(tab);
    if (tab.tool) {
      toolbox.selectedTool = tab.tool;
    }
  }

  return (
    <div className="Sidebar">
      <div className="TabColumn">
        <TabColumn<Tab>
          selected={selected}
          onChange={selectTab}
          tabs={TABS}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
      </div>
      <div className="ContentColumn">
        {!collapsed && (
          <div className="ContentContainer">
            {(() => {
              switch (selected) {
                case MAP_SETTINGS.value:
                  return <MapSettingsUi />;
                case PAINTBRUSH.value:
                  return <PaintbrushUi />;
                case PAINT_BUCKET.value:
                  return <PaintBucketUi />;
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
