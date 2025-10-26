# Release Guide

This guide explains how to create and publish releases for AI Browser.

## Prerequisites

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Ensure Build Works**:
   ```bash
   npm run build
   ```

## Creating a Release

### 1. Update Version Number

Update the version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### 2. Update CHANGELOG.md

Add release notes to `CHANGELOG.md`:
```markdown
## [1.0.0] - 2025-10-26

### Added
- New feature X
- New feature Y

### Changed
- Updated behavior of Z

### Fixed
- Bug fix for issue #123

### Security
- Security patch for vulnerability ABC
```

### 3. Build Release Packages

#### For All Platforms (from respective OS):

**Windows (requires Windows)**:
```bash
npm run make
```
This creates:
- `.exe` installer (Squirrel)
- `.zip` portable version

**macOS (requires macOS)**:
```bash
npm run make
```
This creates:
- `.zip` for macOS

**Linux (requires Linux)**:
```bash
npm run make
```
This creates:
- `.deb` package (Debian/Ubuntu)
- `.rpm` package (Fedora/RHEL)
- `.zip` portable version

#### Output Location

All packages are created in the `out/make/` directory:
```
out/
└── make/
    ├── squirrel.windows/
    │   └── x64/
    │       └── ai-browser-1.0.0 Setup.exe
    ├── zip/
    │   ├── darwin/
    │   │   └── x64/
    │   │       └── ai-browser-darwin-x64-1.0.0.zip
    │   ├── linux/
    │   │   └── x64/
    │   │       └── ai-browser-linux-x64-1.0.0.zip
    │   └── win32/
    │       └── x64/
    │           └── ai-browser-win32-x64-1.0.0.zip
    ├── deb/
    │   └── x64/
    │       └── ai-browser_1.0.0_amd64.deb
    └── rpm/
        └── x64/
            └── ai-browser-1.0.0-1.x86_64.rpm
```

### 4. Test the Release

Before publishing, test the built packages:

**Windows**:
```bash
# Test the installer
./out/make/squirrel.windows/x64/ai-browser-1.0.0 Setup.exe

# Or test the portable version
Expand-Archive ./out/make/zip/win32/x64/ai-browser-win32-x64-1.0.0.zip -DestinationPath test
cd test
./ai-browser.exe
```

**macOS**:
```bash
unzip ./out/make/zip/darwin/x64/ai-browser-darwin-x64-1.0.0.zip -d test
cd test
open ./ai-browser.app
```

**Linux**:
```bash
# Test .deb
sudo dpkg -i ./out/make/deb/x64/ai-browser_1.0.0_amd64.deb
ai-browser

# Or test .rpm
sudo rpm -i ./out/make/rpm/x64/ai-browser-1.0.0-1.x86_64.rpm
ai-browser

# Or test portable .zip
unzip ./out/make/zip/linux/x64/ai-browser-linux-x64-1.0.0.zip -d test
cd test
./ai-browser
```

### 5. Create Git Tag

```bash
git add .
git commit -m "Release v1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main
git push origin v1.0.0
```

### 6. Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Draft a new release"
3. Choose the tag you just created (e.g., `v1.0.0`)
4. Set the release title (e.g., `v1.0.0 - AI Browser`)
5. Add release notes (copy from CHANGELOG.md)
6. Upload the built packages:
   - `ai-browser-1.0.0 Setup.exe` (Windows installer)
   - `ai-browser-win32-x64-1.0.0.zip` (Windows portable)
   - `ai-browser-darwin-x64-1.0.0.zip` (macOS)
   - `ai-browser-linux-x64-1.0.0.zip` (Linux portable)
   - `ai-browser_1.0.0_amd64.deb` (Debian/Ubuntu)
   - `ai-browser-1.0.0-1.x86_64.rpm` (Fedora/RHEL)
7. Check "Set as the latest release" if this is the latest version
8. Click "Publish release"

## Release Checklist

Before publishing, verify:

- [ ] Version number updated in `package.json`
- [ ] CHANGELOG.md updated with release notes
- [ ] All tests pass (`npm run build` succeeds)
- [ ] Built packages tested on target platforms
- [ ] Git tag created and pushed
- [ ] GitHub release created with all binaries
- [ ] Release notes are clear and complete
- [ ] LICENSE file is up to date
- [ ] README.md reflects any new features or changes

## Automated Releases (Optional)

You can automate releases using GitHub Actions. Add this to `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and package
        run: npm run make
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: release-${{ matrix.os }}
          path: out/make/**/*
```

## Troubleshooting

### Build Fails

**Error**: `electron-forge make` fails
**Solution**: Ensure all dependencies are installed:
```bash
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel @electron-forge/maker-zip @electron-forge/maker-deb @electron-forge/maker-rpm
```

### Missing Icons

**Error**: Icon file not found
**Solution**: Create placeholder icons or remove icon references from `package.json`:
```json
"packagerConfig": {
  "name": "AI Browser",
  "executableName": "ai-browser",
  "asar": true
}
```

### Platform-Specific Builds

**Note**: Some platforms can only build certain installers:
- Windows `.exe` requires Windows
- macOS `.dmg` requires macOS
- Linux `.deb`/`.rpm` requires Linux
- `.zip` files can be created on any platform

For cross-platform builds, use a CI/CD service or build on each platform separately.

## Support

For questions or issues with releases:
- Open an issue on GitHub
- Check the [CONTRIBUTING.md](CONTRIBUTING.md) guide
- Review the [Electron Forge documentation](https://www.electronforge.io/)

