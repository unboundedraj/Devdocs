interface ColorPickerValue {
  hex: string;
  hsl?: any;
  rgb?: any;
  hsv?: any;
  oldHue?: number;
  source?: string;
}

export interface ThemeSettings {
  uid: string;
  title: string;
  primary_color: ColorPickerValue | string;
  secondary_color: ColorPickerValue | string;
  accent_color: ColorPickerValue | string;
  background_color: ColorPickerValue | string;
  card_background: ColorPickerValue | string;
  text_primary: ColorPickerValue | string;
  text_secondary: ColorPickerValue | string;
  border_color: ColorPickerValue | string;
  created_at?: string;
  updated_at?: string;
}