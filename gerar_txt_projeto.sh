#!/bin/bash

OUTPUT="ZELAR2_PROJETO_COMPLETO.txt"

rm -f "$OUTPUT"

echo "============================================================" >> "$OUTPUT"
echo "               DOCUMENTAÇÃO COMPLETA DO PROJETO" >> "$OUTPUT"
echo "============================================================" >> "$OUTPUT"
echo "Projeto : $(basename "$PWD")" >> "$OUTPUT"
echo "Data    : $(date)" >> "$OUTPUT"
echo "Sistema : $(uname -a)" >> "$OUTPUT"
echo >> "$OUTPUT"

echo "==================== ESTRUTURA ====================" >> "$OUTPUT"

find . \
! -path "./node_modules/*" \
! -path "./.git/*" \
! -path "./dist/*" \
! -path "./build/*" \
! -path "./coverage/*" \
! -path "./.gradle/*" \
! -path "./android/.gradle/*" \
! -path "./android/app/build/*" \
! -path "./.idea/*" \
! -path "./.vscode/*" \
| sort >> "$OUTPUT"

echo >> "$OUTPUT"

echo "=================== ESTATÍSTICAS ===================" >> "$OUTPUT"

TOTAL=$(find . \
! -path "./node_modules/*" \
! -path "./.git/*" \
! -path "./dist/*" \
! -path "./build/*" \
! -path "./coverage/*" \
! -path "./.gradle/*" \
! -path "./android/.gradle/*" \
! -path "./android/app/build/*" \
! -path "./.idea/*" \
! -path "./.vscode/*" \
-type f | wc -l)

echo "Total de arquivos: $TOTAL" >> "$OUTPUT"
echo >> "$OUTPUT"

echo "================ LISTA DE ARQUIVOS =================" >> "$OUTPUT"

find . \
! -path "./node_modules/*" \
! -path "./.git/*" \
! -path "./dist/*" \
! -path "./build/*" \
! -path "./coverage/*" \
! -path "./.gradle/*" \
! -path "./android/.gradle/*" \
! -path "./android/app/build/*" \
! -path "./.idea/*" \
! -path "./.vscode/*" \
-type f | sort >> "$OUTPUT"

echo >> "$OUTPUT"

echo "================ CONTEÚDO DOS ARQUIVOS =============" >> "$OUTPUT"

find . -type f \
\( \
-name "*.js" -o \
-name "*.mjs" -o \
-name "*.cjs" -o \
-name "*.ts" -o \
-name "*.tsx" -o \
-name "*.jsx" -o \
-name "*.html" -o \
-name "*.css" -o \
-name "*.scss" -o \
-name "*.sass" -o \
-name "*.less" -o \
-name "*.json" -o \
-name "*.xml" -o \
-name "*.gradle" -o \
-name "*.properties" -o \
-name "*.java" -o \
-name "*.kt" -o \
-name "*.kts" -o \
-name "*.sql" -o \
-name "*.env" -o \
-name "*.txt" -o \
-name "*.md" -o \
-name "*.yaml" -o \
-name "*.yml" -o \
-name "*.toml" -o \
-name "*.ini" -o \
-name "*.conf" -o \
-name "*.config" -o \
-name "*.sh" -o \
-name "*.bat" -o \
-name "*.cmd" -o \
-name "*.gitignore" -o \
-name "*.gitattributes" -o \
-name "*.npmrc" -o \
-name "*.editorconfig" -o \
-name "*.prettierrc" -o \
-name "*.eslintrc" -o \
-name "*.eslintrc.json" -o \
-name "*.eslintignore" \
\) \
! -path "./node_modules/*" \
! -path "./.git/*" \
! -path "./dist/*" \
! -path "./build/*" \
! -path "./coverage/*" \
! -path "./.gradle/*" \
! -path "./android/.gradle/*" \
! -path "./android/app/build/*" \
! -path "./.idea/*" \
! -path "./.vscode/*" \
| sort | while read arquivo
do
    echo >> "$OUTPUT"
    echo "############################################################" >> "$OUTPUT"
    echo "# Arquivo: $arquivo" >> "$OUTPUT"
    echo "# Tamanho: $(stat -c%s "$arquivo") bytes" >> "$OUTPUT"
    echo "############################################################" >> "$OUTPUT"
    cat "$arquivo" >> "$OUTPUT"
    echo >> "$OUTPUT"
done

echo >> "$OUTPUT"
echo "============================================================" >> "$OUTPUT"
echo "Fim da documentação" >> "$OUTPUT"
echo "============================================================" >> "$OUTPUT"

echo
echo "==========================================="
echo "Arquivo gerado com sucesso!"
echo "$OUTPUT"
echo "==========================================="