import { useState } from 'react';
import { Card, Title, Text, Switch, Select, SelectItem, Button, Callout } from '@tremor/react';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem('settings', JSON.stringify({
        theme,
        notifications,
        refreshInterval,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTheme('auto');
    setNotifications(true);
    setRefreshInterval(30);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <Title className="text-2xl text-gray-900 dark:text-white">Settings</Title>
        <Text className="text-gray-500 dark:text-gray-400">
          Manage your dashboard preferences
        </Text>
      </div>

      {saved && (
        <Callout className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" title="Settings saved" color="emerald">
          Your preferences have been saved successfully.
        </Callout>
      )}

      {/* Appearance */}
      <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
        <Title className="text-lg text-gray-900 dark:text-white mb-4">Appearance</Title>

        <div className="space-y-6">
          <div>
            <Text className="text-gray-500 dark:text-gray-400 mb-2">Theme</Text>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mx-auto mb-2 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mx-auto mb-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark</span>
              </button>

              <button
                onClick={() => setTheme('auto')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'auto'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mx-auto mb-2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System</span>
              </button>
            </div>
            <Text className="text-xs text-gray-400 mt-2">
              Current: {resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'}
            </Text>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
        <Title className="text-lg text-gray-900 dark:text-white mb-4">Notifications</Title>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-gray-700 dark:text-gray-300">Push Notifications</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Receive alerts for important updates
              </Text>
            </div>
            <Switch
              checked={notifications}
              onChange={setNotifications}
            />
          </div>
        </div>
      </Card>

      {/* Data Refresh */}
      <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
        <Title className="text-lg text-gray-900 dark:text-white mb-4">Data Refresh</Title>

        <div className="space-y-6">
          <div>
            <Text className="text-gray-700 dark:text-gray-300 mb-2">
              Auto-refresh interval: {refreshInterval} seconds
            </Text>
            <Select value={String(refreshInterval)} onValueChange={(v) => setRefreshInterval(Number(v))}>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="120">120 seconds</SelectItem>
            </Select>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={handleReset}
          disabled={isSaving}
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
