@echo off
echo ================================================
echo GreenGuard AI - Quick Setup Script
echo ================================================
echo.

echo [1/3] Installing dependencies...
pip install -r requirements.txt
echo.

echo [2/3] Training ML model...
cd ml
python train_model.py
cd ..
echo.

echo [3/3] Setup complete!
echo.
echo You can now start the server with:
echo   python start_server.py
echo   or
echo   python main.py
echo.
pause

