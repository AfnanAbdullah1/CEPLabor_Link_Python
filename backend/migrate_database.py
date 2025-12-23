"""
Database Migration Script
Cleans up old tables and ensures new schema is correct
"""
import sqlite3
import os
from pathlib import Path

# Get the database path
db_path = Path(__file__).parent / "laborlink.db"
backup_path = Path(__file__).parent / "laborlink_backup.db"

def migrate_database():
    """Migrate database to new schema"""
    print("Starting database migration...")
    
    # Create backup if not exists
    if not backup_path.exists() and db_path.exists():
        import shutil
        shutil.copy(db_path, backup_path)
        print(f"✓ Backup created: {backup_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all existing tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    existing_tables = [row[0] for row in cursor.fetchall()]
    print(f"\nExisting tables: {existing_tables}")
    
    # Drop old redundant tables if they exist
    tables_to_drop = ['workers', 'hirers']
    for table in tables_to_drop:
        if table in existing_tables:
            try:
                cursor.execute(f"DROP TABLE {table}")
                print(f"✓ Dropped redundant table: {table}")
            except sqlite3.Error as e:
                print(f"✗ Error dropping {table}: {e}")
    
    # Check if old messages table exists with different schema
    if 'messages' in existing_tables:
        # Get the schema
        cursor.execute("PRAGMA table_info(messages);")
        columns = [row[1] for row in cursor.fetchall()]
        
        # Check if it has the correct schema
        required_columns = ['id', 'sender_id', 'receiver_id', 'message', 'timestamp', 'is_read']
        if not all(col in columns for col in required_columns):
            print(f"\n⚠ Old messages table schema detected: {columns}")
            print("Dropping old messages table...")
            cursor.execute("DROP TABLE messages")
            print("✓ Dropped old messages table")
    
    conn.commit()
    conn.close()
    
    print("\n✓ Database migration completed!")
    print("\nNext step: Run the FastAPI application to create new tables:")
    print("  cd backend")
    print("  uvicorn app.main:app --reload")
    print("\nThis will create the new 'messages' table with the correct schema.")

if __name__ == "__main__":
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        print("The database will be created when you first run the application.")
    else:
        migrate_database()
