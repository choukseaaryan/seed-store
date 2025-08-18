import { useKeyboard } from '../hooks/useKeyboard';
import { useHotkeys } from 'react-hotkeys-hook';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    key: string;
    description: string;
  }>;
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { key: 'Ctrl+1', description: 'Go to Dashboard' },
      { key: 'Ctrl+2', description: 'Go to Products' },
      { key: 'Ctrl+3', description: 'Go to POS' },
      { key: 'Ctrl+4', description: 'Go to Customers' },
      { key: 'Ctrl+5', description: 'Go to Bills' },
      { key: 'Ctrl+6', description: 'Go to Suppliers' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { key: 'Ctrl+N', description: 'New Sale (on POS page)' },
      { key: 'Ctrl+S', description: 'Save current form' },
      { key: 'Ctrl+K', description: 'Toggle keyboard mode' },
      { key: 'Ctrl+/', description: 'Show this help' },
    ],
  },
  {
    title: 'Navigation (Keyboard Mode)',
    shortcuts: [
      { key: 'Tab', description: 'Next focusable element' },
      { key: 'Shift+Tab', description: 'Previous focusable element' },
      { key: '↑/↓', description: 'Navigate focusable elements' },
      { key: 'Enter', description: 'Activate focused element' },
      { key: 'Escape', description: 'Close modals/panels' },
    ],
  },
];

export default function KeyboardShortcuts() {
  const { isKeyboardMode, showKeyboardHelp, toggleKeyboardHelp } = useKeyboard();

  useHotkeys('ctrl+/', (e) => {
    e.preventDefault();
    toggleKeyboardHelp();
  });

  if (!showKeyboardHelp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Keyboard Shortcuts
            {isKeyboardMode && (
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Keyboard Mode Active
              </span>
            )}
          </h2>
          <button
            onClick={toggleKeyboardHelp}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close shortcuts help"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between py-2">
                    <span className="text-gray-600">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-sm font-mono bg-gray-100 text-gray-800 rounded border">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Press <kbd className="px-1 py-0.5 text-xs font-mono bg-white text-gray-800 rounded border">Ctrl+K</kbd> to toggle keyboard mode
          </p>
        </div>
      </div>
    </div>
  );
}
