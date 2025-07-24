import { CSVParser, CSVData } from './csv-parser';

interface RainbowCSVSettings {
    enabled: boolean;
    maxColumns: number;
    maxRows: number;
}

export class CSVRenderer {
    private settings: RainbowCSVSettings;
    private static readonly PERFORMANCE_THRESHOLD = 1000; // Switch to fast mode for large CSVs
    
    constructor(settings: RainbowCSVSettings) {
        this.settings = settings;
    }
    
    updateSettings(settings: RainbowCSVSettings) {
        this.settings = settings;
    }
    
    renderCSV(content: string): HTMLElement {
        if (!this.settings.enabled) {
            return this.renderPlainText(content);
        }
        
        // Early exit for very large content
        const lineCount = content.split('\n').length;
        if (lineCount > CSVRenderer.PERFORMANCE_THRESHOLD) {
            return this.renderLargeCSV(content);
        }
        
        const csvData = CSVParser.parse(content);
        
        if (csvData.rows.length === 0) {
            return this.renderPlainText(content);
        }
        
        return this.renderColoredText(csvData);
    }
    
    private renderPlainText(content: string): HTMLElement {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = content;
        pre.appendChild(code);
        return pre;
    }
    
    private renderLargeCSV(content: string): HTMLElement {
        const lines = content.split('\n');
        const maxRows = Math.min(this.settings.maxRows || 500, lines.length);
        const truncatedContent = lines.slice(0, maxRows).join('\n');
        
        const container = document.createElement('div');
        container.className = 'rainbow-csv-code-block';
        
        const warning = document.createElement('div');
        warning.className = 'rainbow-csv-warning';
        warning.textContent = `Large CSV detected (${lines.length} rows). Showing first ${maxRows} rows for performance.`;
        
        const csvData = CSVParser.parse(truncatedContent);
        const content_div = this.renderColoredText(csvData);
        
        container.appendChild(warning);
        container.appendChild(content_div);
        return container;
    }
    
    private renderColoredText(csvData: CSVData): HTMLElement {
        const container = document.createElement('div');
        container.className = 'rainbow-csv-code-block';
        
        // Pre-calculate color classes to avoid repeated string operations
        const colorClasses = Array.from({length: 15}, (_, i) => `rainbow-csv-col-${i}`);
        
        // Build HTML string for better performance
        const htmlParts: string[] = [];
        
        for (let rowIndex = 0; rowIndex < csvData.rows.length; rowIndex++) {
            const row = csvData.rows[rowIndex];
            
            for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
                const cell = this.escapeHtml(row.cells[colIndex]);
                const colorClass = colorClasses[colIndex % 15];
                
                htmlParts.push(`<span class="${colorClass}">${cell}</span>`);
                
                // Add delimiter after each cell except the last one
                if (colIndex < row.cells.length - 1) {
                    htmlParts.push(this.escapeHtml(csvData.delimiter));
                }
            }
            
            // Add newline after each row except the last one
            if (rowIndex < csvData.rows.length - 1) {
                htmlParts.push('\n');
            }
        }
        
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.innerHTML = htmlParts.join('');
        
        pre.appendChild(code);
        container.appendChild(pre);
        return container;
    }
    
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}