import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFileSelection } from './useFileSelection';
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
  {
    name: 'uxtheme.dll',
    device: 'Peach',
    path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
    status: 'available',
  },
];

describe('useFileSelection', () => {
  it('returns the initial empty selection state', () => {
    const { result } = renderHook(() => useFileSelection(files));

    expect(result.current.selected.size).toBe(0);
    expect(result.current.selectableFiles).toEqual(files);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.someSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.getSelectedFiles()).toEqual([]);
  });

  it('toggles a single file selection on and off', () => {
    const { result } = renderHook(() => useFileSelection(files));

    act(() => {
      result.current.toggleFile('smss.exe');
    });

    expect(result.current.selected.has('smss.exe')).toBe(true);
    expect(result.current.selected.size).toBe(1);
    expect(result.current.someSelected).toBe(true);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(true);
    expect(result.current.getSelectedFiles()).toEqual([files[0]]);

    act(() => {
      result.current.toggleFile('smss.exe');
    });

    expect(result.current.selected.size).toBe(0);
    expect(result.current.someSelected).toBe(false);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.getSelectedFiles()).toEqual([]);
  });

  it('selects all files and deselects all files with toggleAll', () => {
    const { result } = renderHook(() => useFileSelection(files));

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.selected.size).toBe(3);
    expect(result.current.selected).toEqual(
      new Set(['smss.exe', 'netsh.exe', 'uxtheme.dll']),
    );
    expect(result.current.allSelected).toBe(true);
    expect(result.current.someSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.getSelectedFiles()).toEqual(files);

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.selected.size).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.someSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
  });

  it('keeps allSelected false for empty file input', () => {
    const { result } = renderHook(() => useFileSelection([]));

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.selected.size).toBe(0);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.someSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.getSelectedFiles()).toEqual([]);
  });

  it('adds unknown file names to selected set but not to selected file objects', () => {
    const { result } = renderHook(() => useFileSelection(files));

    act(() => {
      result.current.toggleFile('unknown.exe');
    });

    expect(result.current.selected.has('unknown.exe')).toBe(true);
    expect(result.current.selected.size).toBe(1);
    expect(result.current.someSelected).toBe(true);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(true);
    expect(result.current.getSelectedFiles()).toEqual([]);
  });
});
