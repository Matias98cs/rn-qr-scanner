export interface QrCode {
  id: number;
  session_id: string;
  text: string;
  url: string | null;
  created_at: string;
}