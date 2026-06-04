# BOSS ES-8 Linux

This repository exists because BOSS does not provide a native Linux distribution of the ES-8 Editor. It packages the official BOSS ES-8 Editor assets inside a community-maintained Electron wrapper for Linux.

## Important Usage Rule

For the most reliable startup, connect your BOSS ES-8 over USB and power it on before launching the editor.

If the editor starts without the device attached, the window should stay open, but MIDI connection errors can appear and the editor will not sync until the hardware is available.

## Installation

### Option A: Debian, Ubuntu, Mint, Pop!_OS

1. Download the `.deb` file from the release.
2. Open it with your system installer or run `sudo dpkg -i BOSS-ES8-Editor-*.deb`.

### Option B: AppImage

1. Download the `.AppImage` file from the release.
2. Make it executable with `chmod +x BOSS-ES8-Editor-*.AppImage`.
3. Launch it directly.

## USB Permission Fix

If the editor opens but cannot detect the pedalboard, install the bundled udev rule:

```bash
sudo cp 80-boss-es8.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules
sudo udevadm trigger
```

Disconnect and reconnect the ES-8 after reloading the rules.

## Licensing

The original BOSS/Roland editor assets included in `app-core/` remain copyrighted by Roland Corporation and are not relicensed by this repository.

The third-party bundled components already shipped with the editor, such as jQuery and jQuery UI, retain their own upstream licenses as noted in the application about dialog.

Any new wrapper code, release notes, and documentation added for this community Linux packaging should be treated separately from the original vendor assets.

## Build From Source

Install dependencies and build both Linux packages locally:

```bash
npm install
npm run pack
```

Successful builds are written to the `dist/` directory as AppImage and deb artifacts.