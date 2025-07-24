# Rainbow CSV for Obsidian

A plugin that adds rainbow coloring to CSV content in markdown code blocks, making it easier to visually distinguish columns.

## Features

- **Rainbow Text Coloring**: Each CSV column is colored with a different rainbow color
- **Multiple Delimiter Support**: Automatically detects and supports comma, tab, semicolon, and pipe delimiters
- **Theme Aware**: Automatically adjusts colors for light and dark themes
- **Plain Text Format**: Preserves original CSV formatting - no table conversion
- **Easy Toggle**: Quick enable/disable via command palette
- **Customizable**: Settings panel for configuration options

## Usage

1. **Create CSV Code Blocks**: Use the `csv` language identifier in your markdown code blocks:

```csv
name,age,city,country
John,25,New York,USA
Jane,30,London,UK
Bob,35,Paris,France
```

2. **Automatic Coloring**: Each column will be automatically colored with different rainbow colors:
   - Column 1: Red
   - Column 2: Orange  
   - Column 3: Yellow
   - Column 4: Green
   - Column 5: Blue
   - And so on... (15 colors total, cycling for more columns)

3. **Toggle On/Off**: Use the command palette (`Ctrl/Cmd + P`) and search for "Toggle Rainbow CSV"

## Installation

### From Community Plugins (Recommended)
*Coming soon - this plugin is not yet in the community plugin directory*

### Manual Installation
1. Download the latest release from the [Releases page](../../releases)
2. Extract the files to your vault's `.obsidian/plugins/obsidian-rainbow-csv/` folder
3. Reload Obsidian and enable the plugin in Settings → Community Plugins

## Settings

Access the plugin settings via `Settings → Community Plugins → Rainbow CSV`:

- **Enable Rainbow CSV**: Toggle the plugin on/off
- **Maximum Columns**: Configure how many columns to color before cycling (currently fixed at 15)

## Supported Formats

The plugin automatically detects and supports:
- **CSV**: Comma-separated values (`data,more,data`)
- **TSV**: Tab-separated values (`data	more	data`)
- **SSV**: Semicolon-separated values (`data;more;data`) 
- **PSV**: Pipe-separated values (`data|more|data`)

## Development

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd obsidian-rainbow-csv

# Install dependencies
npm install

# Start development mode (watch for changes)
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck
```

### Project Structure
- `main.ts` - Main plugin entry point
- `csv-parser.ts` - CSV parsing logic with delimiter detection
- `csv-renderer.ts` - Renders CSV with rainbow coloring
- `styles.css` - CSS for rainbow colors and theming
- `manifest.json` - Plugin metadata

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to ensure it compiles
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
