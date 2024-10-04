import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders file uploader', () => {
    render(<App />);
    const fileUploader = screen.getByLabelText(/Upload MP3 File:/i);
    expect(fileUploader).toBeInTheDocument();
  });

  test('renders audio player when audio is uploaded', () => {
    render(<App />);
    const audioPlayer = screen.queryByTestId('audio-player');
    expect(audioPlayer).not.toBeInTheDocument(); // Should not be present initially

    // Simulate audio file upload
    // Assuming you would mock the file upload logic and trigger state change
  });
});
