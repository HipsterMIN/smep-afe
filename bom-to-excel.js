import fs from 'fs';
import * as XLSX from 'xlsx';

// 1. 경로 설정
const inputJson = './bom.json';
const outputExcel = './SMEP_AFE_Architecture_BOM.xlsx';

// 2. 카테고리 분류 로직 (Python 스크립트 방식 참고 및 프론트엔드 최적화)
function classifyCategory(group, name) {
    const g = (group || "").toLowerCase();
    const n = (name || "").toLowerCase();

    if (n.includes('react') || n.includes('zustand') || n.includes('router')) return 'Framework (React/Core)';
    if (n.includes('tiptap') || n.includes('prosemirror')) return 'Editor (RichText/Tiptap)';
    if (n.includes('vite') || n.includes('eslint') || n.includes('prettier') || n.includes('postcss')) return 'Development (Build/Lint)';
    if (n.includes('testing') || n.includes('vitest') || n.includes('jest') || n.includes('jsdom')) return 'Development (Testing)';
    if (n.includes('axios') || n.includes('fetch')) return 'Network (API/Http)';
    if (n.includes('types') || g.includes('types')) return 'Development (Types/TS)';
    if (n.includes('svar-ui') || n.includes('grid')) return 'UI Component (Grid/Table)';

    return 'Other Libraries';
}

if (!fs.existsSync(inputJson)) {
    console.error(`❌ 오류: ${inputJson} 파일이 없습니다.`);
} else {
    const bomData = JSON.parse(fs.readFileSync(inputJson, 'utf8'));

    // 데이터 가공 및 정렬
    const excelData = bomData.components.map(comp => {
        const category = classifyCategory(comp.group, comp.name);
        let licenseInfo = 'Unknown';
        if (comp.licenses && comp.licenses.length > 0) {
            licenseInfo = comp.licenses
                .map(l => l.license?.id || l.license?.name || l.expression || 'Unknown')
                .join(', ');
        }

        return {
            'Category': category,
            'Package Name': comp.name,
            'Installed Version': comp.version,
            'License': licenseInfo,
            'Description': comp.description || comp.name
        };
    }).sort((a, b) => a.Category.localeCompare(b.Category) || a['Package Name'].localeCompare(b['Package Name']));

    // 엑셀 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    worksheet['!cols'] = [
        { wch: 25 }, // Category
        { wch: 35 }, // Package Name
        { wch: 15 }, // Installed Version
        { wch: 20 }, // License
        { wch: 60 }  // Description
    ];

    // [스타일링 대안] XLSX 라이브러리 기본 버전은 인라인 스타일링이 제한적이므로
    // 셀 병합(Merging) 정보를 계산하여 추가합니다.
    const mergeCells = [];
    let startRow = 1; // 0-based, 1은 데이터의 첫 줄
    let currentCat = excelData[0].Category;

    for (let i = 1; i < excelData.length; i++) {
        if (excelData[i].Category !== currentCat) {
            if (i - startRow > 1) {
                mergeCells.push({ s: { r: startRow, c: 0 }, e: { r: i, c: 0 } });
            }
            currentCat = excelData[i].Category;
            startRow = i + 1;
        }
    }
    // 마지막 그룹 병합
    if (excelData.length - startRow > 0) {
        mergeCells.push({ s: { r: startRow, c: 0 }, e: { r: excelData.length, c: 0 } });
    }
    worksheet['!merges'] = mergeCells;

    // 워크북 저장
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SBOM');
    XLSX.writeFile(workbook, outputExcel);

    console.log(`✅ 성공: ${outputExcel} 생성 완료! (카테고리 분류 및 병합 적용)`);
}