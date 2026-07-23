#!/bin/bash
set -e

cd ~/Transferências/ZELAR2_PROJETO_COMPLETO

echo "🔨 Buildando frontend..."
npx vite build

echo "🔄 Sincronizando com Android..."
npx cap sync

echo "📱 Buildando APK..."
cd android
./gradlew assembleDebug

echo "📲 Instalando no celular..."
adb install -r app/build/outputs/apk/debug/app-debug.apk

echo "✅ APK instalado com sucesso!"
