import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FileDownloadTable } from './FileDownloadTable';
import type { FileItem } from './types';

const files: FileItem[] = [
  {
    name: 'smss.exe',
    device: 'Mario',
    path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
    status: 'scheduled',
  },
  {
    name: 'netsh.exe',
    device: 'Luigi',
    path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
    status: 'available',
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('FileDownloadTable', () => {
  it('shows no selection initially and disables download button', () => {
    render(<FileDownloadTable files={files} />);

    expect(screen.getByText('None Selected')).toBeTruthy();
    const downloadButton = screen.getByRole('button', {
      name: /download selected/i,
    }) as HTMLButtonElement;
    expect(downloadButton.disabled).toBe(true);
  });

  it('marks select-all as indeterminate when only one file is selected', () => {
    render(<FileDownloadTable files={files} />);

    fireEvent.click(screen.getByLabelText('Select smss.exe'));

    expect(screen.getByText('Selected 1')).toBeTruthy();
    const selectAll = screen.getByLabelText(
      'Select all files',
    ) as HTMLInputElement;
    expect(selectAll.checked).toBe(false);
    expect(selectAll.indeterminate).toBe(true);
  });

  it('selects all files when select-all checkbox is clicked', () => {
    render(<FileDownloadTable files={files} />);

    fireEvent.click(screen.getByLabelText('Select all files'));

    expect(screen.getByText('Selected 2')).toBeTruthy();

    const firstFile = screen.getByLabelText(
      'Select smss.exe',
    ) as HTMLInputElement;
    const secondFile = screen.getByLabelText(
      'Select netsh.exe',
    ) as HTMLInputElement;
    const selectAll = screen.getByLabelText(
      'Select all files',
    ) as HTMLInputElement;

    expect(firstFile.checked).toBe(true);
    expect(secondFile.checked).toBe(true);
    expect(selectAll.checked).toBe(true);
    expect(selectAll.indeterminate).toBe(false);
  });

  it('alerts selected file details when download is clicked', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<FileDownloadTable files={files} />);

    fireEvent.click(screen.getByLabelText('Select smss.exe'));
    fireEvent.click(screen.getByRole('button', { name: /download selected/i }));

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const [message] = alertSpy.mock.calls[0];
    expect(message).toContain('Downloading 1 file(s):');
    expect(message).toContain('Name: smss.exe');
    expect(message).toContain('Device: Mario');
    expect(message).toContain(
      'Path: \\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
    );
  });
});
