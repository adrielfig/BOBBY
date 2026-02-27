const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Bobby Bilheteria',
    executableName: 'Bobby Bilheteria',
    icon: path.join(__dirname, 'assets', 'images', 'icon'),
    ignore: (filePath) => {
      if (filePath.includes('/cloud')) {
        return true;
      }
      if (filePath === '/README.md') {
        return true;
      }
      if (filePath === '/.gitignore') {
        return true;
      }
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-addons/electron-forge-maker-nsis',
      platforms: ['win32'],
      config: {
      },
    },
    /* {
      name: '@electron-forge/maker-squirrel',
      config: {},
    }, */
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
