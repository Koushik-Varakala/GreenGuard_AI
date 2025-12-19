import sys
import os
from pathlib import Path


backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))


if __name__ == "__main__":
    import uvicorn
    from main import app
    
    print("=" * 50)
    print("GreenGuard AI - Starting Backend Server")
    print("=" * 50)
    print(f"Server will run on: http://localhost:8020")
    print(f"API Documentation: http://localhost:8020/docs")
    print("=" * 50)
    print("\nPress CTRL+C to stop the server\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8020, reload=True)

