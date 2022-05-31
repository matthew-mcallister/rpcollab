import './Footer.css';

import MapTabState from './MapTab';

interface FooterProps {
  state: MapTabState;
}

export default function Footer(props: FooterProps) {
  const state = props.state.state;
  return (
    <div className="Footer">
      <div className="FooterContentContainer">
        <div className="FooterLeft">placeholder text :)</div>
        <div className="FooterRight">
          <span>fps: {state.fps().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
