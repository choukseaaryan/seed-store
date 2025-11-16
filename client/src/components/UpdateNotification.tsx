import { useUpdate } from '../context/UpdateContext';

export function UpdateNotification() {
  const {
    updateStatus,
    downloadUpdate,
    installUpdate,
    dismissUpdate,
    updateSettings
  } = useUpdate();

  // Don't show notification if disabled in settings
  if (!updateSettings.notifyOnUpdate) {
    return null;
  }

  // Don't show notification if no update status
  if (!updateStatus || updateStatus.type === 'not-available' || updateStatus.type === 'checking') {
    return null;
  }

  const handleDownload = async () => {
    await downloadUpdate();
  };

  const handleInstall = async () => {
    await installUpdate();
  };

  const getNotificationContent = () => {
    switch (updateStatus.type) {
      case 'available':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Update Available
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Version {updateStatus.version} is available for download.
                </p>
                {updateStatus.releaseNotes && (
                  <p className="text-sm text-blue-600 mt-1">
                    {updateStatus.releaseNotes}
                  </p>
                )}
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Download Update
                  </button>
                  <button
                    onClick={dismissUpdate}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'downloading':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="animate-spin h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Downloading Update
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Downloading version {updateStatus.version}...
                </p>
                {updateStatus.progress && (
                  <div className="mt-2">
                    <div className="bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${updateStatus.progress.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      {Math.round(updateStatus.progress.percent)}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'downloaded':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800">
                  Update Ready
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Version {updateStatus.version} has been downloaded and is ready to install.
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleInstall}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Restart & Install
                  </button>
                  <button
                    onClick={dismissUpdate}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Update Error
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {updateStatus.message || 'Failed to check for updates'}
                </p>
                <div className="mt-3">
                  <button
                    onClick={dismissUpdate}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return getNotificationContent();
}

export default UpdateNotification;