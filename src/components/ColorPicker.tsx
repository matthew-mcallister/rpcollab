import Color from '../math/Color';

export interface ColorPickerProps {
  color: Color;
  onChange?(color: Color): any;
  className?: string;
}

export default function ColorPicker(props: ColorPickerProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const color = Color.fromHex(value);
    if (color) {
      props.onChange && props.onChange(color);
    }
  }
  return (
    <>
      <input
        type="color"
        value={props.color.toHex({prefix: true})}
        onChange={handleChange}
        className={props.className}
      />
    </>
  );
}
