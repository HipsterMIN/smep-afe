/**
 * SmepEditor — RichEditor → @smep/smart-editor 호환 래퍼
 *
 * # 설계 원칙
 * 1. 기존 RichEditor Props 를 그대로 수용 → 각 사용처 파일에서 import 경로만 교체
 * 2. 추가 기능(영상, YouTube 등)은 extraSlashItems / extraProps 로 쉽게 확장 가능하도록 구조화
 * 3. 이미지 업로드는 세 가지 방식 모두 지원
 *
 * # 사용 예시
 * ```jsx
 * // 편집 모드 (기본)
 * import SmepEditor from '@components/ui/SmepEditor.jsx'
 *
 * <SmepEditor
 *   theme="light"
 *   value={formData.content}
 *   onChange={(html) => handleChange('content', html)}
 * />
 *
 * // 읽기 전용
 * <SmepEditor readOnly value={data.content} />
 *
 * // 이미지 서버 업로드
 * <SmepEditor
 *   value={content}
 *   onChange={setContent}
 *   onImageUpload={async (file) => {
 *     const fd = new FormData()
 *     fd.append('file', file)
 *     const res = await http.post('/api/upload', fd)
 *     return res.data.url
 *   }}
 * />
 * ```
 *
 * # 영상/YouTube 확장 방법 (향후)
 * SmartEditor 의 `extraSlashItems` prop 으로 슬래시 커맨드를 추가하거나,
 * @smep/smart-editor 패키지를 업데이트한 뒤 tgz 를 재설치하세요.
 * 현재 사용처에서 `showVideo`, `showYouTube` prop 을 전달하는 경우가 없으므로
 * 해당 props 는 수신만 하고 무시합니다(미래 확장 대비).
 */

import SmartEditor from '@smep/smart-editor'
import '@smep/smart-editor/style.css'

// 기본 글자 크기 목록 (RichEditor 기본값과 동일)
const DEFAULT_FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48]

/**
 * @param {object} props
 * @param {string}   [props.value='']         - HTML 콘텐츠 (controlled)
 * @param {string}   [props.defaultValue]     - 초기 HTML (uncontrolled)
 * @param {function} [props.onChange]         - onChange(htmlString) 콜백
 * @param {function} [props.onImageUpload]    - 이미지 업로드 핸들러 (File → Promise<URL>)
 * @param {string}   [props.imageUploadEndpoint] - 이미지 업로드 API 엔드포인트
 * @param {string}   [props.imageFieldName='file'] - FormData 필드명
 * @param {'light'|'dark'|'auto'} [props.theme='auto'] - 테마
 * @param {string}   [props.placeholder]     - 플레이스홀더
 * @param {number}   [props.minHeight=280]   - 최소 높이 (px)
 * @param {number}   [props.maxHeight]       - 최대 높이 (px)
 * @param {boolean}  [props.editable=true]   - false 면 읽기 전용 (readOnly)
 * @param {boolean}  [props.readOnly=false]  - 읽기 전용 (editable 과 동일 의미)
 * @param {string}   [props.className='']    - 추가 CSS 클래스
 * @param {object}   [props.style]           - 루트 인라인 스타일
 * @param {boolean}  [props.autoFocus=false] - 자동 포커스
 * @param {number[]} [props.fontSizes]       - 글자 크기 목록 (빈 배열이면 숨김)
 * @param {Array}    [props.extraSlashItems] - 추가 슬래시 커맨드 항목
 * -- 하위 호환 전용 (동작 없음, 미래 확장 대비) --
 * @param {boolean}  [props.showHeader]      - (무시) 툴바 항상 표시
 * @param {boolean}  [props.showHtmlToggle]  - (무시) HTML 탭 항상 제공
 * @param {boolean}  [props.showImage]       - (무시) 이미지 항상 허용
 * @param {boolean}  [props.showLink]        - (무시) 링크 항상 허용
 * @param {boolean}  [props.showYouTube]     - (수신만, 현재 미구현)
 * @param {boolean}  [props.showVideo]       - (수신만, 현재 미구현)
 * @param {boolean}  [props.allowTextAlign]  - (무시) 정렬 항상 허용
 * @param {boolean}  [props.showFontSize]    - (무시) fontSizes 배열로 제어
 * @param {number[]} [props.fontSizes]       - 글자 크기 목록
 */
export default function SmepEditor({
  // 콘텐츠
  value,
  defaultValue,
  onChange,

  // 이미지 업로드
  onImageUpload,
  imageUploadEndpoint,
  imageFieldName = 'file',

  // 스타일/레이아웃
  theme = 'auto',
  placeholder,
  minHeight = 280,
  maxHeight,
  className = '',
  style,
  autoFocus = false,

  // 편집 모드
  editable = true,
  readOnly = false,

  // 글자 크기
  fontSizes = DEFAULT_FONT_SIZES,

  // 슬래시 커맨드 확장
  extraSlashItems = [],

  // ── 하위 호환 props (무시하되 구조분해해서 ...rest 에 포함되지 않도록) ──
  showHeader: _showHeader,
  showHtmlToggle: _showHtmlToggle,
  showImage: _showImage,
  showLink: _showLink,
  allowTextAlign: _allowTextAlign,
  showFontSize: _showFontSize,
  allowHtmlEdit: _allowHtmlEdit,
  initialHtmlView: _initialHtmlView,
  initialViewPolicy: _initialViewPolicy,
  showHtmlFormat: _showHtmlFormat,
  autoFormatHtmlOnOpen: _autoFormatHtmlOnOpen,
  showHtmlPreviewPopup: _showHtmlPreviewPopup,
  allowPasteDropImage: _allowPasteDropImage,
  linkAutolink: _linkAutolink,
  columnResizable: _columnResizable,
  showRowHeight: _showRowHeight,
  resizable: _resizable,
  height: _height,
  defaultTextAlign: _defaultTextAlign,
  defaultFontSize: _defaultFontSize,
  // 미구현 기능 (수신만)
  showYouTube: _showYouTube,
  showVideo: _showVideo,
  showEmbed: _showEmbed,
  allowPasteDropVideo: _allowPasteDropVideo,
  videoUploadMode: _videoUploadMode,
  youtubeNoCookie: _youtubeNoCookie,
  htmlFormatOptions: _htmlFormatOptions,
  autoFormatHtmlOnApply: _autoFormatHtmlOnApply,
  embedKeepRatio: _embedKeepRatio,
  embedMinWidth: _embedMinWidth,
  embedMinHeight: _embedMinHeight,
  embedMaxWidth: _embedMaxWidth,
  embedMaxHeight: _embedMaxHeight,
  imageUploadMode: _imageUploadMode,
  allowEmbedResize: _allowEmbedResize,
  videoUploadEndpoint: _videoUploadEndpoint,
  videoFieldName: _videoFieldName,
  onVideoUpload: _onVideoUpload,

  // 그 외 SmartEditor 에 그대로 전달 가능한 props
  ...rest
}) {
  const isReadOnly = readOnly || !editable

  // ── 이미지 업로드 핸들러 통합 ───────────────────────────────────────────
  // 우선순위: onImageUpload prop > imageUploadEndpoint > 기본(base64)
  const imageHandler = onImageUpload ?? (
    imageUploadEndpoint
      ? async (file) => {
          const fd = new FormData()
          fd.append(imageFieldName, file)
          const res = await fetch(imageUploadEndpoint, { method: 'POST', body: fd })
          if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
          const json = await res.json()
          return json.url ?? json.imageUrl ?? json.filePath ?? json.path
        }
      : undefined   // undefined → SmartEditor 내부 base64 처리
  )

  // ── 읽기 전용 ─────────────────────────────────────────────────────────────
  if (isReadOnly) {
    return (
      <SmartEditor
        readOnly
        defaultValue={value ?? defaultValue ?? ''}
        theme={theme}
        style={{
          width: '100%',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          minHeight,
          ...style,
        }}
        className={className}
        {...rest}
      />
    )
  }

  // ── 편집 모드 ─────────────────────────────────────────────────────────────
  return (
    <SmartEditor
      value={value}
      defaultValue={defaultValue}
      onChange={(content) => onChange?.(content.html)}
      onImageUpload={imageHandler}
      placeholder={placeholder}
      minHeight={minHeight}
      maxHeight={maxHeight}
      theme={theme}
      autoFocus={autoFocus}
      fontSizes={fontSizes}
      extraSlashItems={extraSlashItems}
      className={className}
      style={{ width: '100%', ...style }}
      {...rest}
    />
  )
}
