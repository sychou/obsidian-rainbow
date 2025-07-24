export interface CSVRow {
    cells: string[];
    raw: string;
}

export interface CSVData {
    rows: CSVRow[];
    delimiter: string;
    columnCount: number;
}

export class CSVParser {
    private static readonly DELIMITERS = [',', '\t', ';', '|'];
    
    static parse(text: string): CSVData {
        const delimiter = this.detectDelimiter(text);
        const rows = this.parseRows(text, delimiter);
        const columnCount = Math.max(...rows.map(row => row.cells.length));
        
        return {
            rows,
            delimiter,
            columnCount
        };
    }
    
    private static detectDelimiter(text: string): string {
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length === 0) return ',';
        
        const sampleLine = lines[0];
        let bestDelimiter = ',';
        let maxCount = 0;
        
        for (const delimiter of this.DELIMITERS) {
            const count = this.countDelimiter(sampleLine, delimiter);
            if (count > maxCount) {
                maxCount = count;
                bestDelimiter = delimiter;
            }
        }
        
        return bestDelimiter;
    }
    
    private static countDelimiter(line: string, delimiter: string): number {
        let count = 0;
        let inQuotes = false;
        let escapeNext = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            
            if (!inQuotes && char === delimiter) {
                count++;
            }
        }
        
        return count;
    }
    
    private static parseRows(text: string, delimiter: string): CSVRow[] {
        const lines = text.split('\n');
        const rows: CSVRow[] = [];
        
        for (const line of lines) {
            if (line.trim().length === 0) continue;
            
            const cells = this.parseLine(line, delimiter);
            rows.push({
                cells,
                raw: line
            });
        }
        
        return rows;
    }
    
    private static parseLine(line: string, delimiter: string): string[] {
        const cells: string[] = [];
        let currentCell = '';
        let inQuotes = false;
        let escapeNext = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (escapeNext) {
                currentCell += char;
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            
            if (!inQuotes && char === delimiter) {
                cells.push(currentCell.trim());
                currentCell = '';
                continue;
            }
            
            currentCell += char;
        }
        
        cells.push(currentCell.trim());
        return cells;
    }
}