import { CSVParser, CSVData } from './csv-parser';

interface RainbowCSVSettings {
    enabled: boolean;
    maxColumns: number;
}

export class CSVRenderer {
    private settings: RainbowCSVSettings;
    
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
    
    private renderColoredText(csvData: CSVData): HTMLElement {
        const container = document.createElement('div');
        container.className = 'rainbow-csv-code-block';
        
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        
        for (let rowIndex = 0; rowIndex < csvData.rows.length; rowIndex++) {
            const row = csvData.rows[rowIndex];
            
            for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
                const cell = row.cells[colIndex];
                
                // Create colored span for each cell
                const span = document.createElement('span');
                span.className = `rainbow-csv-col-${colIndex % 15}`;
                span.textContent = cell;
                
                code.appendChild(span);
                
                // Add delimiter after each cell except the last one
                if (colIndex < row.cells.length - 1) {
                    const delimiterSpan = document.createElement('span');
                    delimiterSpan.textContent = csvData.delimiter;
                    code.appendChild(delimiterSpan);
                }
            }
            
            // Add newline after each row except the last one
            if (rowIndex < csvData.rows.length - 1) {
                code.appendChild(document.createTextNode('\n'));
            }
        }
        
        pre.appendChild(code);
        container.appendChild(pre);
        return container;
    }
}