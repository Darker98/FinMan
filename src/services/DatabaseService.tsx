// Singleton pattern implementation for database connection
export class DatabaseService {
  private static instance: DatabaseService;
  private connection: any; // In a real app, this would be a database connection
  
  private constructor() {
    // Initialize database connection
    this.connection = {
      connected: true,
      lastAccessTime: new Date(),
      query: (sql: string, params: any[] = []) => {
        console.log(`Executing query: ${sql} with params: ${JSON.stringify(params)}`);
        return Promise.resolve({ rows: [], rowCount: 0 });
      }
    };
  }
  
  // Get the singleton instance
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  // Get the database connection
  public getConnection(): any {
    this.connection.lastAccessTime = new Date();
    return this.connection;
  }
  
  // Execute a query
  public async query(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.connection.query(sql, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
  
  // Check connection status
  public isConnected(): boolean {
    return this.connection && this.connection.connected;
  }
  
  // Close the connection (for cleanup)
  public closeConnection(): void {
    if (this.connection && this.connection.connected) {
      console.log('Closing database connection');
      this.connection.connected = false;
    }
  }
}

// Example usage:
// const db = DatabaseService.getInstance();
// db.query('SELECT * FROM transactions WHERE user_id = $1', [userId]);