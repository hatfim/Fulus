import {
  Fira_Mono as FontSans,
  JetBrains_Mono as FontMono,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
