import './Footer.css';
import useMapContext from './hooks/useMapContext';

interface FooterProps {}

export default function Footer(props: FooterProps) {
  const state = useMapContext().map.state;
  const hl = state.highlightedCell;
  return (
    <div className="Footer">
      <div className="FooterContentContainer">
        <div className="FooterLeft">placeholder text :)</div>
        <div className="FooterRight">
          {hl && (
            <>
              <span>
                {hl.x + 1}, {hl.y + 1}
              </span>
              <span> | </span>
            </>
          )}
          <span>fps: {state.fps().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
