import './Footer.css';
import useMapContext from './hooks/useMapContext';

interface FooterProps {}

export default function Footer(props: FooterProps) {
  const state = useMapContext().map.state;
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
