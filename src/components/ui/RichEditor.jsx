import { Extension, Node } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DOMParser as PMDOMParser, DOMSerializer } from 'prosemirror-model';
import { useEffect, useMemo, useRef, useState } from 'react';

// 세련된 선 중심의 아이콘 컴포넌트 (Lucide Style)
const Icon = {
  // 공통 설정을 적용한 기본 SVG 래퍼
  Wrapper: ({ children, ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: '18px', height: '18px', display: 'block' }} // 인라인 스타일로 크기 보정
      {...props}
    >
      {children}
    </svg>
  ),

  Bold: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </Icon.Wrapper>
  ),

  Italic: (props) => (
    <Icon.Wrapper {...props}>
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </Icon.Wrapper>
  ),

  Underline: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M6 3v7a6 6 0 0 0 12 0V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </Icon.Wrapper>
  ),

  Strike: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M16 4H9a3 3 0 0 0 0 6h7a3 3 0 0 1 0 6H7" />
      <line x1="4" y1="10" x2="20" y2="10" />
    </Icon.Wrapper>
  ),

  UL: (props) => (
    <Icon.Wrapper {...props}>
      {/* 점 부분: stroke 대신 fill을 사용하여 확실히 보이게 함 */}
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
      {/* 선 부분 */}
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
    </Icon.Wrapper>
  ),

  OL: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
    </Icon.Wrapper>
  ),

  Table: (props) => (
    <Icon.Wrapper {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </Icon.Wrapper>
  ),

  PlusCol: (props) => (
    <Icon.Wrapper {...props}>
      <rect x="2" y="3" width="12" height="18" rx="2" />
      <line x1="19" y1="8" x2="19" y2="16" />
      <line x1="16" y1="12" x2="22" y2="12" />
    </Icon.Wrapper>
  ),

  PlusRow: (props) => (
    <Icon.Wrapper {...props}>
      <rect x="3" y="2" width="18" height="12" rx="2" />
      <line x1="8" y1="19" x2="16" y2="19" />
      <line x1="12" y1="16" x2="12" y2="22" />
    </Icon.Wrapper>
  ),

  DeleteTable: (props) => (
    <Icon.Wrapper {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </Icon.Wrapper>
  ),

  Undo: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </Icon.Wrapper>
  ),

  Redo: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </Icon.Wrapper>
  ),

  AlignLeft: (props) => (
    <Icon.Wrapper {...props}>
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="15" y1="12" x2="3" y2="12" />
      <line x1="18" y1="18" x2="3" y2="18" />
    </Icon.Wrapper>
  ),

  AlignCenter: (props) => (
    <Icon.Wrapper {...props}>
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="18" y1="12" x2="6" y2="12" />
      <line x1="21" y1="18" x2="3" y2="18" />
    </Icon.Wrapper>
  ),

  AlignRight: (props) => (
    <Icon.Wrapper {...props}>
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="12" x2="9" y2="12" />
      <line x1="21" y1="18" x2="3" y2="18" />
    </Icon.Wrapper>
  ),

  AlignJustify: (props) => (
    <Icon.Wrapper {...props}>
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="12" x2="3" y2="12" />
      <line x1="21" y1="18" x2="3" y2="18" />
      <line x1="21" y1="21" x2="3" y2="21" style={{ opacity: 0 }} />
    </Icon.Wrapper>
  ),

  Code: (props) => (
    <Icon.Wrapper {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </Icon.Wrapper>
  ),

  Image: (props) => (
    <Icon.Wrapper {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </Icon.Wrapper>
  ),

  Upload: (props) => (
    <Icon.Wrapper {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </Icon.Wrapper>
  ),
};

const HTML_VIEW_POLICIES = new Set(['auto', 'html', 'wysiwyg']);

function normalizeInitialViewPolicy(policy, initialHtmlView) {
  if (typeof policy === 'string') {
    const normalized = policy.trim().toLowerCase();
    if (HTML_VIEW_POLICIES.has(normalized)) return normalized;
  }
  return initialHtmlView ? 'html' : 'wysiwyg';
}

function shouldBootstrapInHtmlView(policy, sourceValue) {
  if (policy === 'html') return true;
  if (policy === 'auto' || policy === 'wysiwyg') {
    return (sourceValue ?? '').trim().length > 0;
  }
  return false;
}

export default function RichEditor({
  theme = 'dark',
  minHeight = 280,
  maxHeight = 700,
  height,
  resizable = true,
  className = '',
  editable = true,
  showHeader = true,
  placeholder = '여기에 내용을 입력하세요…',
  allowTextAlign = true,
  defaultTextAlign = 'left',
  showFontSize = true,
  fontSizes = [12, 14, 16, 18, 20, 24, 28, 32],
  defaultFontSize,
  // 표 열 리사이즈 허용 여부
  columnResizable = true,
  // 행 높이 설정 UI
  showRowHeight = true,
  rowHeights = [24, 32, 40, 48, 60],
  defaultRowHeight,
  // HTML 보기/편집 토글
  showHtmlToggle = true,
  allowHtmlEdit = true,
  initialHtmlView = true,
  initialViewPolicy = 'auto', // 'auto' | 'html' | 'wysiwyg'
  // HTML 소스 정렬(Beautify)
  showHtmlFormat = false,
  autoFormatHtmlOnOpen = true,
  autoFormatHtmlOnApply = false,
  // HTML 소스 새 탭 미리보기
  showHtmlPreviewPopup = true,
  htmlFormatOptions = { printWidth: 100, tabWidth: 2, useTabs: false },
  // 이미지 삽입/업로드 옵션
  showImage = true,
  allowPasteDropImage = true,
  imageUploadMode = 'dataUrl', // 'dataUrl' | 'upload'
  imageUploadEndpoint,
  imageFieldName = 'file',
  onImageUpload,
  // 링크 기능
  showLink = true,
  linkAutolink = true,
  // 동영상(Youtube/일반 비디오) 옵션
  showYouTube = true,
  showVideo = true,
  allowPasteDropVideo = true,
  videoUploadMode = 'objectUrl', // 'objectUrl' | 'dataUrl' | 'upload'
  videoUploadEndpoint,
  videoFieldName = 'file',
  onVideoUpload,
  // 기타 임베드(URL → iframe) 옵션
  showEmbed = true,
  // 임베드(iframe) 크기 조절 옵션
  allowEmbedResize = true,
  embedKeepRatio = true, // 기본: 종횡비 유지, Shift로 자유비율
  embedMinWidth = 200,
  embedMinHeight = 112,
  embedMaxWidth = 1280,
  embedMaxHeight = 720,
  // YouTube 임베드 도메인 설정(개인정보 강화 버전 사용)
  youtubeNoCookie = true,
  value = '',
  onChange,
} = {}) {
  // FontSize Extension: map textStyle.mark attribute -> inline style font-size
  const FontSize = useMemo(
    () =>
      Extension.create({
        name: 'fontSizeBridge',
        addGlobalAttributes() {
          return [
            {
              types: ['textStyle'],
              attributes: {
                fontSize: {
                  default: null,
                  renderHTML: (attributes) => {
                    if (!attributes.fontSize) return {};
                    return { style: `font-size: ${attributes.fontSize}` };
                  },
                  parseHTML: (element) => ({
                    fontSize: element.style.fontSize || null,
                  }),
                },
              },
            },
          ];
        },
      }),
    []
  );

  // RowHeight Extension: apply min-height style to all cells in the current row
  const RowHeight = useMemo(
    () =>
      Extension.create({
        name: 'rowHeight',
        addGlobalAttributes() {
          return [
            {
              types: ['tableCell', 'tableHeader'],
              attributes: {
                rowMinHeight: {
                  default: null,
                  renderHTML: (attrs) => {
                    if (!attrs.rowMinHeight) return {};
                    const v = String(attrs.rowMinHeight);
                    const px = /px$/i.test(v) ? v : `${v}px`;
                    return { style: `min-height: ${px}` };
                  },
                  parseHTML: (element) => ({
                    rowMinHeight: element.style?.minHeight || null,
                  }),
                },
              },
            },
          ];
        },
        addCommands() {
          return {
            setRowMinHeight:
              (value) =>
              ({ state, dispatch }) => {
                const { selection } = state;
                const $from = selection.$from;
                // find parent tableRow
                for (let d = $from.depth; d > 0; d--) {
                  const node = $from.node(d);
                  if (node.type.name === 'tableRow') {
                    const rowPos = $from.before(d);
                    const rowNode = state.doc.nodeAt(rowPos);
                    if (!rowNode) return false;
                    const tr = state.tr;
                    let pos = rowPos + 1; // first child of row
                    const v =
                      value == null || value === ''
                        ? null
                        : /px$/i.test(String(value))
                          ? String(value)
                          : `${value}px`;
                    for (let i = 0; i < rowNode.childCount; i++) {
                      const cell = rowNode.child(i);
                      const attrs = { ...cell.attrs, rowMinHeight: v };
                      tr.setNodeMarkup(pos, cell.type, attrs, cell.marks);
                      pos += cell.nodeSize;
                    }
                    if (tr.docChanged && dispatch) dispatch(tr);
                    return true;
                  }
                }
                return false;
              },
          };
        },
      }),
    []
  );

  // IframeEmbed Node: render <div class="embed"><iframe .../></div> as an atom block
  const IframeEmbed = useMemo(
    () =>
      Node.create({
        name: 'iframeEmbed',
        group: 'block',
        atom: true,
        draggable: true,
        selectable: true,
        addAttributes() {
          return {
            src: { default: null },
            title: { default: null },
            provider: { default: null },
            allow: { default: null },
            referrerpolicy: { default: 'no-referrer-when-downgrade' },
            loading: { default: 'lazy' },
            allowfullscreen: { default: true },
            // 크기 조절을 위해 고정 px 사이즈를 저장 (없으면 responsive)
            width: { default: null },
            height: { default: null },
          };
        },
        parseHTML() {
          return [
            {
              tag: 'div.embed > iframe',
              getAttrs: (element) => {
                const el = element;
                const parent = el?.parentElement;
                // wrapper(div.embed)에 인라인 width/height가 있으면 읽어옴
                const wrapStyle = parent?.getAttribute('style') || '';
                const widthMatch = /width:\s*([0-9.]+)px/i.exec(wrapStyle);
                const heightMatch = /height:\s*([0-9.]+)px/i.exec(wrapStyle);
                return {
                  src: el.getAttribute('src') || null,
                  title: el.getAttribute('title') || null,
                  // provider는 HTML에 없으면 null 유지
                  allow: el.getAttribute('allow') || null,
                  referrerpolicy: el.getAttribute('referrerpolicy') || null,
                  loading: el.getAttribute('loading') || null,
                  allowfullscreen: el.hasAttribute('allowfullscreen')
                    ? true
                    : null,
                  width: widthMatch ? `${widthMatch[1]}px` : null,
                  height: heightMatch ? `${heightMatch[1]}px` : null,
                };
              },
            },
          ];
        },
        renderHTML({ HTMLAttributes }) {
          const attrs = { ...HTMLAttributes };
          // Tip: boolean allowfullscreen는 속성만 존재해도 true 처리
          const iframeAttrs = {
            src: attrs.src,
            title: attrs.title || undefined,
            allow: attrs.allow || undefined,
            referrerpolicy: attrs.referrerpolicy || undefined,
            loading: attrs.loading || 'lazy',
            allowfullscreen: '',
            style: 'width:100%; height:100%; border:0;',
          };
          const wrapStyle = [];
          if (attrs.width) wrapStyle.push(`width:${attrs.width}`);
          if (attrs.height) wrapStyle.push(`height:${attrs.height}`);
          const wrapAttrs = {
            class: 'embed',
            style: wrapStyle.join('; ') || undefined,
          };
          return ['div', wrapAttrs, ['iframe', iframeAttrs]];
        },
        addCommands() {
          return {
            setEmbed:
              (embedAttrs) =>
              ({ chain }) => {
                if (!embedAttrs || !embedAttrs.src) return false;
                return chain()
                  .insertContent({ type: 'iframeEmbed', attrs: embedAttrs })
                  .run();
              },
          };
        },
        addNodeView() {
          const allowResize = !!allowEmbedResize;
          const keepRatio = !!embedKeepRatio;
          const MIN_W = Number.isFinite(embedMinWidth) ? embedMinWidth : 200;
          const MIN_H = Number.isFinite(embedMinHeight) ? embedMinHeight : 112;
          const MAX_W = Number.isFinite(embedMaxWidth) ? embedMaxWidth : 1280;
          const MAX_H = Number.isFinite(embedMaxHeight) ? embedMaxHeight : 720;
          return ({ node, getPos, editor }) => {
            const dom = document.createElement('div');
            dom.className = 'embed';
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', node.attrs.src || '');
            if (node.attrs.title)
              iframe.setAttribute('title', node.attrs.title);
            if (node.attrs.allow)
              iframe.setAttribute('allow', node.attrs.allow);
            if (node.attrs.referrerpolicy)
              iframe.setAttribute('referrerpolicy', node.attrs.referrerpolicy);
            iframe.setAttribute('loading', node.attrs.loading || 'lazy');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('style', 'width:100%; height:100%; border:0;');

            // 초기 크기 적용
            const applySizeToDom = (w, h) => {
              if (w) dom.style.width = String(w);
              else dom.style.removeProperty('width');
              if (h) dom.style.height = String(h);
              else dom.style.removeProperty('height');
              if (w || h) dom.setAttribute('data-fixed-size', 'true');
              else dom.removeAttribute('data-fixed-size');
            };
            applySizeToDom(node.attrs.width, node.attrs.height);

            dom.appendChild(iframe);

            let handle;
            if (allowResize) {
              handle = document.createElement('div');
              handle.className = 'embed-resize-handle';
              dom.appendChild(handle);
            }

            let dragging = false;
            let startX = 0,
              startY = 0;
            let startW = 0,
              startH = 0;
            let ratio = 16 / 9;
            let activePointerId = null;

            const commitSize = () => {
              // 커밋: 현재 dom 스타일을 attrs로 저장
              const w = dom.style.width || null;
              const h = dom.style.height || null;
              try {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos != null) {
                  const tr = editor.state.tr;
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: w,
                    height: h,
                  });
                  editor.view.dispatch(tr);
                }
              } catch {}
            };

            const finishDrag = () => {
              if (!dragging) return;
              dragging = false;
              commitSize();
              try {
                if (activePointerId != null)
                  handle.releasePointerCapture(activePointerId);
              } catch {}
              activePointerId = null;
              window.removeEventListener('blur', finishDrag);
            };

            const onPointerMove = (e) => {
              if (!dragging) return;
              e.preventDefault();
              const dx = e.clientX - startX;
              const dy = e.clientY - startY;
              let newW = Math.max(MIN_W, Math.min(MAX_W, startW + dx));
              let newH;
              if (keepRatio && e.shiftKey === false) {
                newH = Math.round(newW / ratio);
              } else {
                newH = Math.max(MIN_H, Math.min(MAX_H, startH + dy));
              }
              applySizeToDom(`${newW}px`, `${newH}px`);
            };

            const onPointerDown = (e) => {
              if (e.pointerType === 'mouse' && e.button !== 0) return;
              e.preventDefault();
              dragging = true;
              startX = e.clientX;
              startY = e.clientY;
              const rect = dom.getBoundingClientRect();
              startW = rect.width;
              startH = rect.height;
              ratio = startW && startH ? startW / startH : 16 / 9;
              activePointerId = e.pointerId;
              try {
                handle.setPointerCapture(e.pointerId);
              } catch {}
              window.addEventListener('blur', finishDrag);
            };

            const onPointerUp = (e) => {
              e.preventDefault();
              finishDrag();
            };
            const onDblClickHandle = (e) => {
              e.preventDefault();
              // 리셋: responsive로 복귀
              applySizeToDom(null, null);
              try {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos != null) {
                  const tr = editor.state.tr;
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: null,
                    height: null,
                  });
                  editor.view.dispatch(tr);
                }
              } catch {}
            };

            if (handle) {
              handle.style.touchAction = 'none';
              handle.addEventListener('pointerdown', onPointerDown);
              handle.addEventListener('pointermove', onPointerMove);
              handle.addEventListener('pointerup', onPointerUp);
              handle.addEventListener('pointercancel', onPointerUp);
              handle.addEventListener('dblclick', onDblClickHandle);
            }

            return {
              dom,
              update: (updatedNode) => {
                if (updatedNode.type.name !== 'iframeEmbed') return false;
                // src가 바뀌면 교체
                if (updatedNode.attrs.src !== node.attrs.src) {
                  iframe.setAttribute('src', updatedNode.attrs.src || '');
                }
                applySizeToDom(
                  updatedNode.attrs.width,
                  updatedNode.attrs.height
                );
                node = updatedNode;
                return true;
              },
              selectNode: () => dom.classList.add('ProseMirror-selectednode'),
              deselectNode: () =>
                dom.classList.remove('ProseMirror-selectednode'),
              destroy: () => {
                if (handle) {
                  handle.removeEventListener('pointerdown', onPointerDown);
                  handle.removeEventListener('pointermove', onPointerMove);
                  handle.removeEventListener('pointerup', onPointerUp);
                  handle.removeEventListener('pointercancel', onPointerUp);
                  handle.removeEventListener('dblclick', onDblClickHandle);
                }
                window.removeEventListener('blur', finishDrag);
              },
            };
          };
        },
      }),
    []
  );

  // Youtube 노드를 확장해 리사이즈(마우스 그립) 지원 + width/height 보존
  const YoutubeResizable = useMemo(
    () =>
      Youtube.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            // 고정 크기(px) 저장. 없으면 responsive로 100% 폭/비율 처리
            width: { default: null },
            height: { default: null },
            // 기존 Youtube 확장에서는 src만 있으면 동작
          };
        },
        parseHTML() {
          // div.embed > iframe[src*="youtube"] 형태 또는 독립 iframe에서 width/height 스타일을 읽어옴
          return [
            {
              tag: 'div.embed > iframe',
              getAttrs: (el) => {
                const iframe = el;
                const parent = iframe?.parentElement;
                const wrapStyle = parent?.getAttribute('style') || '';
                const widthMatch = /width:\s*([0-9.]+)px/i.exec(wrapStyle);
                const heightMatch = /height:\s*([0-9.]+)px/i.exec(wrapStyle);
                const src = iframe?.getAttribute('src') || null;
                if (
                  !src ||
                  !/(youtube-nocookie\.com|youtube\.com|youtu\.be)/.test(src)
                )
                  return false;
                return {
                  src,
                  width: widthMatch ? `${widthMatch[1]}px` : null,
                  height: heightMatch ? `${heightMatch[1]}px` : null,
                };
              },
            },
            {
              tag: 'iframe',
              getAttrs: (iframe) => {
                const src = iframe?.getAttribute('src') || null;
                if (
                  !src ||
                  !/(youtube-nocookie\.com|youtube\.com|youtu\.be)/.test(src)
                )
                  return false;
                const style = iframe?.getAttribute('style') || '';
                const widthMatch = /width:\s*([0-9.]+)px/i.exec(style);
                const heightMatch = /height:\s*([0-9.]+)px/i.exec(style);
                return {
                  src,
                  width: widthMatch ? `${widthMatch[1]}px` : null,
                  height: heightMatch ? `${heightMatch[1]}px` : null,
                };
              },
            },
          ];
        },
        renderHTML({ HTMLAttributes }) {
          const attrs = { ...HTMLAttributes };
          // youtube 확장은 내부적으로 iframe을 출력하지만, 여기서는 공통 임베드 래퍼를 사용
          const iframeAttrs = {
            src: toYouTubeEmbedUrl(attrs.src, youtubeNoCookie) || attrs.src,
            frameborder: '0',
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen',
            allowfullscreen: '',
            loading: 'lazy',
            style: 'width:100%; height:100%; border:0;',
          };
          const wrapStyle = [];
          if (attrs.width) wrapStyle.push(`width:${attrs.width}`);
          if (attrs.height) wrapStyle.push(`height:${attrs.height}`);
          const wrapAttrs = {
            class: 'embed',
            style: wrapStyle.join('; ') || undefined,
          };
          return ['div', wrapAttrs, ['iframe', iframeAttrs]];
        },
        addNodeView() {
          const allowResize = !!allowEmbedResize;
          const keepRatio = !!embedKeepRatio;
          const MIN_W = Number.isFinite(embedMinWidth) ? embedMinWidth : 200;
          const MIN_H = Number.isFinite(embedMinHeight) ? embedMinHeight : 112;
          const MAX_W = Number.isFinite(embedMaxWidth) ? embedMaxWidth : 1280;
          const MAX_H = Number.isFinite(embedMaxHeight) ? embedMaxHeight : 720;
          return ({ node, getPos, editor }) => {
            const dom = document.createElement('div');
            dom.className = 'embed';
            const iframe = document.createElement('iframe');
            iframe.setAttribute(
              'src',
              toYouTubeEmbedUrl(node.attrs.src, youtubeNoCookie) ||
                node.attrs.src ||
                ''
            );
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute(
              'allow',
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'
            );
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('style', 'width:100%; height:100%; border:0;');

            const applySizeToDom = (w, h) => {
              if (w) dom.style.width = String(w);
              else dom.style.removeProperty('width');
              if (h) dom.style.height = String(h);
              else dom.style.removeProperty('height');
              if (w || h) dom.setAttribute('data-fixed-size', 'true');
              else dom.removeAttribute('data-fixed-size');
            };
            applySizeToDom(node.attrs.width, node.attrs.height);
            dom.appendChild(iframe);

            let handle;
            if (allowResize) {
              handle = document.createElement('div');
              handle.className = 'embed-resize-handle';
              dom.appendChild(handle);
            }

            let dragging = false;
            let startX = 0,
              startY = 0;
            let startW = 0,
              startH = 0;
            let ratio = 16 / 9;
            let activePointerId = null;

            const commitSize = () => {
              const w = dom.style.width || null;
              const h = dom.style.height || null;
              try {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos != null) {
                  const tr = editor.state.tr;
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: w,
                    height: h,
                  });
                  editor.view.dispatch(tr);
                }
              } catch {}
            };
            const finishDrag = () => {
              if (!dragging) return;
              dragging = false;
              commitSize();
              try {
                if (activePointerId != null)
                  handle.releasePointerCapture(activePointerId);
              } catch {}
              activePointerId = null;
              window.removeEventListener('blur', finishDrag);
            };
            const onPointerMove = (e) => {
              if (!dragging) return;
              e.preventDefault();
              const dx = e.clientX - startX;
              const dy = e.clientY - startY;
              let newW = Math.max(MIN_W, Math.min(MAX_W, startW + dx));
              let newH;
              if (keepRatio && e.shiftKey === false) {
                newH = Math.round(newW / ratio);
              } else {
                newH = Math.max(MIN_H, Math.min(MAX_H, startH + dy));
              }
              applySizeToDom(`${newW}px`, `${newH}px`);
            };
            const onPointerDown = (e) => {
              if (e.pointerType === 'mouse' && e.button !== 0) return;
              e.preventDefault();
              dragging = true;
              startX = e.clientX;
              startY = e.clientY;
              const rect = dom.getBoundingClientRect();
              startW = rect.width;
              startH = rect.height;
              ratio = startW && startH ? startW / startH : 16 / 9;
              activePointerId = e.pointerId;
              try {
                handle.setPointerCapture(e.pointerId);
              } catch {}
              window.addEventListener('blur', finishDrag);
            };
            const onPointerUp = (e) => {
              e.preventDefault();
              finishDrag();
            };
            const onDblClickHandle = (e) => {
              e.preventDefault();
              applySizeToDom(null, null);
              try {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos != null) {
                  const tr = editor.state.tr;
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: null,
                    height: null,
                  });
                  editor.view.dispatch(tr);
                }
              } catch {}
            };

            if (handle) {
              handle.style.touchAction = 'none';
              handle.addEventListener('pointerdown', onPointerDown);
              handle.addEventListener('pointermove', onPointerMove);
              handle.addEventListener('pointerup', onPointerUp);
              handle.addEventListener('pointercancel', onPointerUp);
              handle.addEventListener('dblclick', onDblClickHandle);
            }

            return {
              dom,
              update: (updatedNode) => {
                if (updatedNode.type.name !== this.name) return false;
                if (updatedNode.attrs.src !== node.attrs.src) {
                  iframe.setAttribute(
                    'src',
                    toYouTubeEmbedUrl(updatedNode.attrs.src, youtubeNoCookie) ||
                      updatedNode.attrs.src ||
                      ''
                  );
                }
                applySizeToDom(
                  updatedNode.attrs.width,
                  updatedNode.attrs.height
                );
                node = updatedNode;
                return true;
              },
              selectNode: () => dom.classList.add('ProseMirror-selectednode'),
              deselectNode: () =>
                dom.classList.remove('ProseMirror-selectednode'),
              destroy: () => {
                if (handle) {
                  handle.removeEventListener('pointerdown', onPointerDown);
                  handle.removeEventListener('pointermove', onPointerMove);
                  handle.removeEventListener('pointerup', onPointerUp);
                  handle.removeEventListener('pointercancel', onPointerUp);
                  handle.removeEventListener('dblclick', onDblClickHandle);
                }
                window.removeEventListener('blur', finishDrag);
              },
            };
          };
        },
      }),
    [
      allowEmbedResize,
      embedKeepRatio,
      embedMinWidth,
      embedMinHeight,
      embedMaxWidth,
      embedMaxHeight,
      youtubeNoCookie,
    ]
  );

  const isEditable = !!editable;
  const resolvedInitialViewPolicy = useMemo(
    () => normalizeInitialViewPolicy(initialViewPolicy, initialHtmlView),
    [initialViewPolicy, initialHtmlView]
  );
  const initialValue = typeof value === 'string' ? value : '';
  const bootstrapHtmlView = shouldBootstrapInHtmlView(
    resolvedInitialViewPolicy,
    initialValue
  );
  const [isDark, setIsDark] = useState(theme === 'dark');
  const [fontSizeValue, setFontSizeValue] = useState('');
  const [rowHeightValue, setRowHeightValue] = useState(''); // e.g., '40px' or ''
  const [isHtmlView, setIsHtmlView] = useState(() => bootstrapHtmlView);
  const [htmlSource, setHtmlSource] = useState(() => initialValue);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isApplyingHtml, setIsApplyingHtml] = useState(false);
  const [htmlRoundtripWarning, setHtmlRoundtripWarning] = useState(null);
  const [htmlPreviewNotice, setHtmlPreviewNotice] = useState('');
  const editorContainerRef = useRef(null);
  const htmlViewContainerRef = useRef(null);
  const htmlPreviewWindowRef = useRef(null);
  const isHtmlViewRef = useRef(bootstrapHtmlView);
  const onChangeRef = useRef(onChange);
  const lastExternalValueRef = useRef(undefined);
  const lastInternalEmitValueRef = useRef(undefined);
  const [contentHeight, setContentHeight] = useState(null);
  const prettierRef = useMemo(
    () => ({ loaded: false, prettier: null, plugins: null }),
    []
  );
  const [fileInputKey, setFileInputKey] = useState(0); // 파일 입력 초기화용

  const emitChangeValue = (nextHtml) => {
    const emitChange = onChangeRef.current;
    if (typeof emitChange !== 'function') return;
    const normalizedHtml = typeof nextHtml === 'string' ? nextHtml : '';
    lastInternalEmitValueRef.current = normalizedHtml;
    emitChange(normalizedHtml);
  };

  const isBusy = isFormatting || isApplyingHtml;
  const hasHtmlSource = (htmlSource ?? '').trim().length > 0;

  useEffect(() => {
    isHtmlViewRef.current = isHtmlView;
  }, [isHtmlView]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const syncContentHeightFromElement = (element) => {
    if (height != null || !element) return;
    const nextHeight = Math.round(element.getBoundingClientRect().height);
    if (nextHeight > 0) {
      setContentHeight(`${nextHeight}px`);
    }
  };

  // Prettier 로딩 (1회)
  async function ensurePrettierLoaded() {
    if (prettierRef.loaded) return;
    let prettierMod;
    let htmlPluginMod;
    try {
      prettierMod = await import('prettier/standalone.mjs');
    } catch (_) {
      prettierMod = await import('prettier/standalone');
    }
    try {
      htmlPluginMod = await import('prettier/plugins/html.mjs');
    } catch (_) {
      htmlPluginMod = await import('prettier/plugins/html');
    }
    const format =
      prettierMod.format || (prettierMod.default && prettierMod.default.format);
    const pluginHtml = htmlPluginMod.default ?? htmlPluginMod;
    if (!format) throw new Error('Prettier format function not found');
    prettierRef.prettier = { format };
    prettierRef.plugins = [pluginHtml];
    prettierRef.loaded = true;
  }

  // 주어진 문자열을 포맷해서 반환 (state에 직접 쓰지 않음)
  async function formatHtmlString(source) {
    try {
      setIsFormatting(true);
      await ensurePrettierLoaded();
      const opts = {
        parser: 'html',
        plugins: prettierRef.plugins,
        printWidth: htmlFormatOptions?.printWidth ?? 100,
        tabWidth: htmlFormatOptions?.tabWidth ?? 2,
        useTabs: htmlFormatOptions?.useTabs ?? false,
        htmlWhitespaceSensitivity:
          htmlFormatOptions?.htmlWhitespaceSensitivity ?? 'css',
        bracketSameLine: htmlFormatOptions?.bracketSameLine ?? false,
      };
      return await prettierRef.prettier.format(source ?? '', opts);
    } catch (e) {
      console.warn('[RichEditor] HTML format failed:', e);
      return source ?? '';
    } finally {
      setIsFormatting(false);
    }
  }

  // 기존 단축키/버튼에서 사용하는 편의 함수: 현재 state를 포맷하여 state에 반영
  async function formatHtmlSource() {
    const formatted = await formatHtmlString(htmlSource);
    setHtmlSource(formatted);
  }

  function toLossList(beforeMap, afterMap) {
    const out = [];
    beforeMap.forEach((beforeCount, name) => {
      const afterCount = afterMap.get(name) || 0;
      if (beforeCount > afterCount) {
        out.push({ name, count: beforeCount - afterCount });
      }
    });
    out.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return out;
  }

  function collectHtmlSignature(html) {
    const empty = {
      tagCounts: new Map(),
      attrCounts: new Map(),
      stylePropCounts: new Map(),
    };
    if (typeof document === 'undefined' || typeof DOMParser === 'undefined') {
      return empty;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        `<body>${html ?? ''}</body>`,
        'text/html'
      );
      const tagCounts = new Map();
      const attrCounts = new Map();
      const stylePropCounts = new Map();
      doc.body.querySelectorAll('*').forEach((el) => {
        const tag = el.tagName.toLowerCase();
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        el.getAttributeNames().forEach((name) => {
          attrCounts.set(name, (attrCounts.get(name) || 0) + 1);
          if (name === 'style') {
            const styleText = el.getAttribute('style') || '';
            styleText.split(';').forEach((decl) => {
              const [rawProp] = decl.split(':');
              const prop = rawProp?.trim().toLowerCase();
              if (!prop) return;
              stylePropCounts.set(prop, (stylePropCounts.get(prop) || 0) + 1);
            });
          }
        });
      });
      return { tagCounts, attrCounts, stylePropCounts };
    } catch (e) {
      console.warn('[RichEditor] signature parse failed:', e);
      return empty;
    }
  }

  function roundtripHtmlWithSchema(source) {
    if (!editor || typeof document === 'undefined') return source ?? '';
    try {
      const wrap = document.createElement('div');
      wrap.innerHTML = source ?? '';
      const parsedDoc = PMDOMParser.fromSchema(editor.schema).parse(wrap);
      const fragment = DOMSerializer.fromSchema(
        editor.schema
      ).serializeFragment(parsedDoc.content);
      const out = document.createElement('div');
      out.appendChild(fragment);
      return out.innerHTML;
    } catch (e) {
      console.warn('[RichEditor] roundtrip check failed:', e);
      return source ?? '';
    }
  }

  function detectHtmlLossOnRoundtrip(source) {
    const sourceHtml = source ?? '';
    const roundtrippedHtml = roundtripHtmlWithSchema(sourceHtml);
    const sourceSig = collectHtmlSignature(sourceHtml);
    const roundSig = collectHtmlSignature(roundtrippedHtml);
    const removedTags = toLossList(sourceSig.tagCounts, roundSig.tagCounts);
    const removedAttrs = toLossList(sourceSig.attrCounts, roundSig.attrCounts);
    const removedStyleProps = toLossList(
      sourceSig.stylePropCounts,
      roundSig.stylePropCounts
    );
    const hasLoss =
      removedTags.length > 0 ||
      removedAttrs.length > 0 ||
      removedStyleProps.length > 0;
    return {
      hasLoss,
      sourceHtml,
      roundtrippedHtml,
      removedTags,
      removedAttrs,
      removedStyleProps,
    };
  }

  function summarizeLossItems(items) {
    if (!items || items.length === 0) return '-';
    const preview = items
      .slice(0, 8)
      .map((it) => `${it.name}(-${it.count})`)
      .join(', ');
    const rest = items.length - 8;
    return rest > 0 ? `${preview}, 외 ${rest}개` : preview;
  }

  async function applyHtmlSourceToEditor({ force = false } = {}) {
    if (!editor || isApplyingHtml) return;
    setIsApplyingHtml(true);
    try {
      let sourceToApply = htmlSource;
      if (autoFormatHtmlOnApply) {
        sourceToApply = await formatHtmlString(sourceToApply);
      }
      if (!force) {
        const report = detectHtmlLossOnRoundtrip(sourceToApply);
        if (report.hasLoss) {
          setHtmlRoundtripWarning(report);
          return;
        }
      }
      try {
        editor.commands.setContent(sourceToApply || '', false);
        emitChangeValue(editor.getHTML());
        setHtmlRoundtripWarning(null);
        syncContentHeightFromElement(htmlViewContainerRef.current);
        setIsHtmlView(false);
      } catch (e) {
        console.warn('[RichEditor] setContent failed, stay in HTML view:', e);
      }
    } finally {
      setIsApplyingHtml(false);
    }
  }

  async function switchToHtmlMode() {
    if (!editor || isBusy || isHtmlView) return;
    setHtmlRoundtripWarning(null);
    setHtmlPreviewNotice('');
    syncContentHeightFromElement(editorContainerRef.current);
    // 진입: 에디터의 현재 HTML을 로드하고(필요 시) 포맷한 뒤 표시
    let raw = '';
    try {
      raw = editor.getHTML();
    } catch {
      raw = '';
    }
    let toShow = raw;
    if (autoFormatHtmlOnOpen) {
      toShow = await formatHtmlString(raw);
    }
    setHtmlSource(toShow);
    setIsHtmlView(true);
  }

  async function switchToWysiwygMode() {
    if (!editor || isBusy || !isHtmlView) return;
    // 복귀: 수정된 HTML을 적용(편집 허용 시)
    if (allowHtmlEdit) {
      await applyHtmlSourceToEditor();
      return;
    }
    setHtmlRoundtripWarning(null);
    setHtmlPreviewNotice('');
    syncContentHeightFromElement(htmlViewContainerRef.current);
    setIsHtmlView(false);
  }

  function buildHtmlPreviewDocument(source) {
    const safeHtml = source ?? '';
    return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="referrer" content="no-referrer" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; script-src 'none'; connect-src 'none'; img-src https: data: blob:; style-src 'unsafe-inline' https:; font-src https: data:; media-src https: data: blob:;"
    />
    <base target="_blank" />
    <title>HTML Preview</title>
    <style>
      html, body { margin: 0; padding: 0; background: #f4f4f4; }
      body { padding: 14px; box-sizing: border-box; min-height: 100vh; }
      .preview-root { box-sizing: border-box; width: 100%; max-width: 1280px; margin: 0 auto; background: #fff; }
      .preview-meta { position: sticky; top: 0; z-index: 1; margin: 0 0 10px; padding: 8px 10px; background: #f2f7ff; color: #173b69; border: 1px solid #c9defc; font: 12px/1.4 -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
    </style>
  </head>
  <body>
    <div class="preview-meta">읽기 전용 새 탭 미리보기입니다. 저장 데이터는 원본 HTML 문자열입니다.</div>
    <div class="preview-root">${safeHtml}</div>
  </body>
</html>`;
  }

  function openHtmlPreviewPopup() {
    if (typeof window === 'undefined') return;
    if (!hasHtmlSource) {
      setHtmlPreviewNotice('미리보기할 HTML 소스가 없습니다.');
      return;
    }
    setHtmlPreviewNotice('');
    const documentHtml = buildHtmlPreviewDocument(htmlSource);
    try {
      let previewWindow = htmlPreviewWindowRef.current;
      if (!previewWindow || previewWindow.closed) {
        previewWindow = window.open('', 'rich-editor-html-preview');
        if (!previewWindow) {
          setHtmlPreviewNotice(
            '팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도하세요.'
          );
          return;
        }
        htmlPreviewWindowRef.current = previewWindow;
      }
      previewWindow.document.open();
      previewWindow.document.write(documentHtml);
      previewWindow.document.close();
      previewWindow.focus();
    } catch (e) {
      console.warn('[RichEditor] openHtmlPreviewPopup failed:', e);
      setHtmlPreviewNotice('미리보기 창을 열지 못했습니다. 다시 시도하세요.');
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      IframeEmbed,
      Link.configure({
        autolink: !!linkAutolink,
        linkOnPaste: true,
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener nofollow' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      FontSize,
      RowHeight,
      Image.configure({ allowBase64: true }),
      // YouTube 임베드(iframe)
      YoutubeResizable.configure({
        controls: true,
        nocookie: false,
        allowFullscreen: true,
      }),
      // TipTap Table: resizable=true 면 열 경계를 드래그하여 너비 조절 가능
      Table.configure({ resizable: !!columnResizable }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editable: isEditable && !isHtmlView,
    content: '<p></p>',
    onCreate: ({ editor }) => {
      // 기본 정렬 적용
      try {
        editor.chain().setTextAlign(defaultTextAlign).run();
      } catch (_) {
        // 무시: 지원하지 않는 값일 경우 안전하게 패스
      }
      // 기본 글자 크기 적용(옵션)
      if (defaultFontSize) {
        const sizeVal =
          typeof defaultFontSize === 'number'
            ? `${defaultFontSize}px`
            : String(defaultFontSize);
        editor
          .chain()
          .focus()
          .setMark('textStyle', { fontSize: sizeVal })
          .run();
        // 초기 셀렉트 표시값 동기화
        setFontSizeValue(/px$/.test(sizeVal) ? sizeVal : `${sizeVal}px`);
      }
      // 기본 행 높이 적용(옵션, 표 내부에서 의미 있음)
      if (defaultRowHeight != null && defaultRowHeight !== '') {
        const rh =
          typeof defaultRowHeight === 'number'
            ? `${defaultRowHeight}px`
            : String(defaultRowHeight);
        // 현재 커서가 표 안이 아닐 수 있으므로, 적용은 사용자가 표 셀에 포커스했을 때 진행하는 편이 안전함
        // 여기서는 초기 셀렉트 값만 세팅
        setRowHeightValue(/px$/i.test(rh) ? rh : `${rh}px`);
      }
    },
    onUpdate: ({ editor }) => {
      if (isHtmlViewRef.current) return;
      emitChangeValue(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        if (!isEditable) return false;
        if (isHtmlView) return false;
        // 이미지 붙여넣기
        if (allowPasteDropImage) {
          const items = event.clipboardData?.items;
          if (items && items.length > 0) {
            for (const it of items) {
              if (it.type && it.type.startsWith('image/')) {
                const file = it.getAsFile();
                if (file) {
                  insertImageFromFile(file);
                  return true;
                }
              }
            }
          }
        }
        // 비디오 붙여넣기(일부 브라우저에서 동작)
        if (allowPasteDropVideo) {
          const items = event.clipboardData?.items;
          if (items && items.length > 0) {
            for (const it of items) {
              if (it.type && it.type.startsWith('video/')) {
                const file = it.getAsFile();
                if (file) {
                  insertVideoFromFile(file);
                  return true;
                }
              }
            }
          }
        }
        // 텍스트에 동영상 서비스 URL이 있으면 자동 임베드 (YouTube 우선, 그 외 제공자 처리)
        try {
          const text = event.clipboardData?.getData('text/plain')?.trim();
          if (text) {
            // 1) YouTube
            const yt = getYouTubeSrc(text);
            if (yt) {
              event.preventDefault();
              editor.chain().focus().setYoutubeVideo({ src: yt }).run();
              return true;
            }
            // 2) TikTok/Vimeo/Dailymotion 등
            const attrs = getEmbedAttrsForUrl(text);
            if (attrs) {
              event.preventDefault();
              editor.chain().focus().setEmbed(attrs).run();
              return true;
            }
          }
        } catch {}
        const items = event.clipboardData?.items;
        if (!items || items.length === 0) return false;
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!isEditable) return false;
        if (isHtmlView) return false;
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        if (allowPasteDropImage) {
          for (const file of files) {
            if (file.type && file.type.startsWith('image/')) {
              insertImageFromFile(file);
              event.preventDefault();
              return true;
            }
          }
        }
        if (allowPasteDropVideo) {
          for (const file of files) {
            if (file.type && file.type.startsWith('video/')) {
              insertVideoFromFile(file);
              event.preventDefault();
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditable && !isHtmlView);
  }, [editor, isEditable, isHtmlView]);

  // 파일을 이미지로 삽입하는 헬퍼
  async function insertImageFromFile(file) {
    if (!editor || !file) return;
    try {
      // 1) 사용자 제공 업로드 핸들러 우선
      if (typeof onImageUpload === 'function') {
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
          return;
        }
      }
      // 2) 업로드 모드가 'upload'이고 endpoint가 있으면 서버 업로드
      if (imageUploadMode === 'upload' && imageUploadEndpoint) {
        const fd = new FormData();
        fd.append(imageFieldName || 'file', file);
        const res = await fetch(imageUploadEndpoint, {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json().catch(() => null);
        const url = data?.url || data?.location || data?.src;
        if (!url) throw new Error('No image URL in response');
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        return;
      }
      // 3) 기본: data URL로 삽입 (POC)
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        if (typeof src === 'string') {
          editor.chain().focus().setImage({ src, alt: file.name }).run();
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.warn('[RichEditor] insertImageFromFile failed:', e);
    } finally {
      // 같은 파일 재선택 가능하도록 input 초기화 키 변경
      setFileInputKey((k) => k + 1);
    }
  }

  // 파일을 비디오로 삽입하는 헬퍼
  async function insertVideoFromFile(file) {
    if (!editor || !file) return;
    try {
      // 1) 사용자 제공 업로드 핸들러 우선
      if (typeof onVideoUpload === 'function') {
        const url = await onVideoUpload(file);
        if (url) {
          insertVideoBySrc(url, { alt: file.name });
          return;
        }
      }
      // 2) 업로드 모드가 'upload'
      if (videoUploadMode === 'upload' && videoUploadEndpoint) {
        const fd = new FormData();
        fd.append(videoFieldName || 'file', file);
        const res = await fetch(videoUploadEndpoint, {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);
        const data = await res.json().catch(() => null);
        const url = data?.url || data?.location || data?.src;
        if (!url) throw new Error('No video URL in response');
        insertVideoBySrc(url, { alt: file.name });
        return;
      }
      // 3) 로컬 미리보기: object URL 또는 data URL
      if (videoUploadMode === 'dataUrl') {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result;
          if (typeof src === 'string')
            insertVideoBySrc(src, { alt: file.name });
        };
        reader.readAsDataURL(file);
      } else {
        // 기본: object URL (세션 한정 유효)
        const url = URL.createObjectURL(file);
        insertVideoBySrc(url, { alt: file.name });
      }
    } catch (e) {
      console.warn('[RichEditor] insertVideoFromFile failed:', e);
    }
  }

  // 주어진 입력에서 YouTube 영상 src(URL)를 생성
  function getYouTubeSrc(input) {
    if (!input) return '';
    const toSrcFromId = (id) =>
      id ? `https://www.youtube.com/watch?v=${id}` : '';
    try {
      const u = new URL(input);
      const host = u.hostname.replace(/^www\./, '');
      if (host === 'youtu.be') {
        const id = u.pathname.replace(/^\//, '');
        return toSrcFromId(id);
      }
      if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
        // shorts
        if (u.pathname.startsWith('/shorts/')) {
          const id = u.pathname.split('/')[2];
          return toSrcFromId(id);
        }
        // watch?v=
        const id = u.searchParams.get('v');
        if (id) return toSrcFromId(id);
      }
      // ID만 들어온 경우도 지원
      return /^[-_A-Za-z0-9]{6,}$/.test(input) ? toSrcFromId(input) : '';
    } catch {
      // URL 파싱 실패 시 ID처럼 취급 시도
      return /^[-_A-Za-z0-9]{6,}$/.test(input)
        ? `https://www.youtube.com/watch?v=${input}`
        : '';
    }
  }

  // YouTube watch/shorts/youtu.be/ID → embed URL 변환 (nocookie 옵션 지원)
  function toYouTubeEmbedUrl(input, useNoCookie = true) {
    if (!input) return '';
    // 먼저 ID를 뽑아낸다
    let id = '';
    try {
      const u = new URL(input);
      const host = u.hostname.replace(/^www\./, '');
      if (host === 'youtu.be') {
        id = u.pathname.replace(/^\//, '');
      } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
        if (u.pathname.startsWith('/shorts/')) {
          id = u.pathname.split('/')[2] || '';
        } else {
          id = u.searchParams.get('v') || '';
        }
      }
    } catch {
      // input이 순수 ID일 수도 있음
      if (/^[-_A-Za-z0-9]{6,}$/.test(input)) id = input;
    }
    if (!id) return '';
    const origin = useNoCookie
      ? 'https://www.youtube-nocookie.com'
      : 'https://www.youtube.com';
    return `${origin}/embed/${id}`;
  }

  function insertVideoBySrc(src, attrs = {}) {
    if (!editor || !src) return;
    // TipTap에 기본 video 노드가 없으므로 HTML 삽입을 사용
    // 안전하게 <video controls src="...">를 삽입
    const safe = String(src).replace(/"/g, '&quot;');
    editor
      .chain()
      .focus()
      .insertContent(
        `<video src="${safe}" controls style="max-width:100%; height:auto;"></video>`
      )
      .run();
  }

  // 공급자별(URL) 임베드 iframe attrs 생성기: TikTok/Vimeo/Dailymotion 지원
  function getEmbedAttrsForUrl(input) {
    if (!input) return null;
    let u;
    try {
      u = new URL(input);
    } catch {
      return null;
    }
    const host = u.hostname.replace(/^www\./, '');
    const path = u.pathname;
    // TikTok: tiktok.com/@user/video/{id}
    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
      const m = path.match(/\/video\/(\d+)/);
      const vid = m?.[1];
      if (vid) {
        const src = `https://www.tiktok.com/embed/v2/${vid}`;
        return {
          src,
          provider: 'tiktok',
          allow: 'encrypted-media; picture-in-picture; fullscreen',
          referrerpolicy: 'no-referrer-when-downgrade',
          loading: 'lazy',
        };
      }
    }
    // Vimeo: vimeo.com/{id}
    if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
      const m = path.match(/\/(\d+)/);
      const id = m?.[1];
      if (id) {
        const src = `https://player.vimeo.com/video/${id}`;
        return {
          src,
          provider: 'vimeo',
          allow: 'autoplay; fullscreen; picture-in-picture',
          loading: 'lazy',
        };
      }
    }
    // Dailymotion: dailymotion.com/video/{id} 또는 dai.ly/{id}
    if (host === 'dailymotion.com' || host.endsWith('.dailymotion.com')) {
      const m = path.match(/\/video\/([A-Za-z0-9]+)/);
      const id = m?.[1];
      if (id) {
        const src = `https://www.dailymotion.com/embed/video/${id}`;
        return {
          src,
          provider: 'dailymotion',
          allow: 'autoplay; fullscreen; picture-in-picture',
          loading: 'lazy',
        };
      }
    }
    if (host === 'dai.ly') {
      const m = path.match(/\/([A-Za-z0-9]+)/);
      const id = m?.[1];
      if (id) {
        const src = `https://www.dailymotion.com/embed/video/${id}`;
        return {
          src,
          provider: 'dailymotion',
          allow: 'autoplay; fullscreen; picture-in-picture',
          loading: 'lazy',
        };
      }
    }
    return null;
  }

  function insertEmbedByUrl(url) {
    if (!editor) return false;
    const attrs = getEmbedAttrsForUrl(url);
    if (!attrs) return false;
    editor.chain().focus().setEmbed(attrs).run();
    return true;
  }

  // 현재 커서/선택의 글자 크기를 셀렉트에 동기화
  useEffect(() => {
    if (!editor) return;

    const normalize = (v) => {
      if (!v) return '';
      const trimmed = String(v).trim();
      if (trimmed === '') return '';
      return /px$/i.test(trimmed) ? trimmed : `${trimmed}px`;
    };

    const updateFromSelection = () => {
      try {
        const attrs = editor.getAttributes('textStyle') || {};
        setFontSizeValue(normalize(attrs.fontSize));
        // Row height: read current row's common value (if all cells share same rowMinHeight)
        const { state } = editor;
        const $from = state.selection.$from;
        let value = '';
        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d);
          if (node.type.name === 'tableRow') {
            const rowPos = $from.before(d);
            const rowNode = state.doc.nodeAt(rowPos);
            if (rowNode) {
              let same = undefined;
              for (let i = 0; i < rowNode.childCount; i++) {
                const cell = rowNode.child(i);
                const v = cell?.attrs?.rowMinHeight || '';
                if (same === undefined) same = v;
                else if (same !== v) {
                  same = '';
                  break;
                }
              }
              value = same || '';
            }
            break;
          }
        }
        setRowHeightValue(normalize(value));
      } catch {
        setFontSizeValue('');
        setRowHeightValue('');
      }
    };

    updateFromSelection();
    editor.on('selectionUpdate', updateFromSelection);
    editor.on('transaction', updateFromSelection);
    editor.on('update', updateFromSelection);

    return () => {
      editor.off('selectionUpdate', updateFromSelection);
      editor.off('transaction', updateFromSelection);
      editor.off('update', updateFromSelection);
    };
  }, [editor]);

  // value prop 변경 시 외부/내부 반영을 구분하고 정책 기반으로 모드를 결정한다.
  useEffect(() => {
    if (!editor) return;
    const nextValue = typeof value === 'string' ? value : '';
    if (lastExternalValueRef.current === nextValue) return;
    lastExternalValueRef.current = nextValue;

    const isInternalEcho = lastInternalEmitValueRef.current === nextValue;
    if (isInternalEcho) {
      lastInternalEmitValueRef.current = undefined;
      if (isHtmlViewRef.current) {
        setHtmlSource((prev) => (prev === nextValue ? prev : nextValue));
      }
      return;
    }

    const syncHtmlSource = () => {
      setHtmlSource((prev) => (prev === nextValue ? prev : nextValue));
    };

    setHtmlPreviewNotice('');

    if (resolvedInitialViewPolicy === 'html') {
      syncHtmlSource();
      setHtmlRoundtripWarning(null);
      if (!isHtmlViewRef.current) setIsHtmlView(true);
      return;
    }

    if (nextValue.trim().length === 0) {
      setHtmlRoundtripWarning(null);
      if (isHtmlViewRef.current) setIsHtmlView(false);
      if (editor.getHTML() !== nextValue) {
        editor.commands.setContent(nextValue, false);
      }
      return;
    }

    const report = detectHtmlLossOnRoundtrip(nextValue);
    if (report.hasLoss) {
      syncHtmlSource();
      if (resolvedInitialViewPolicy === 'auto') {
        setHtmlRoundtripWarning(null);
      } else {
        setHtmlRoundtripWarning(report);
      }
      if (!isHtmlViewRef.current) setIsHtmlView(true);
      return;
    }

    setHtmlRoundtripWarning(null);
    if (isHtmlViewRef.current) setIsHtmlView(false);
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, false);
    }
  }, [value, editor, resolvedInitialViewPolicy]);

  const contentStyle = useMemo(
    () => ({
      minHeight:
        typeof minHeight === 'number' ? `${minHeight}px` : String(minHeight),
      maxHeight:
        typeof maxHeight === 'number' ? `${maxHeight}px` : String(maxHeight),
      height:
        height != null
          ? typeof height === 'number'
            ? `${height}px`
            : String(height)
          : typeof minHeight === 'number'
            ? `${minHeight}px`
            : String(minHeight),
      resize: resizable ? 'vertical' : 'none',
      overflow: 'auto',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }),
    [minHeight, maxHeight, height, resizable]
  );

  const resolvedContentStyle = useMemo(() => {
    if (height != null || !contentHeight) return contentStyle;
    return { ...contentStyle, height: contentHeight };
  }, [contentStyle, contentHeight, height]);

  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container || !editor) return undefined;

    const handleMouseDown = (event) => {
      if (!isEditable || isHtmlView || event.button !== 0) return;
      if (event.target !== container) return;
      editor.commands.focus('end');
    };

    container.addEventListener('mousedown', handleMouseDown);
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
    };
  }, [editor, isEditable, isHtmlView]);

  return (
    <div className={`tiptap-wrap ${isDark ? 'dark' : 'light'} ${className}`}>
      {/* 컴포넌트 로컬 스타일: 다크/라이트 테마 대비 향상 */}
      <style>{`
        .tiptap-wrap { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
        .tiptap-wrap .rte { border: 1px solid; border-radius: 10px; overflow: hidden; transition: box-shadow .15s, border-color .15s, background .15s; width: 100%; max-width: 100%; box-sizing: border-box; }
        .tiptap-wrap .rte:focus-within { box-shadow: 0 0 0 3px rgba(107,156,255,.25); }
        .tiptap-wrap .toolbar { display: flex; gap: 4px; flex-wrap: wrap; padding: 6px; align-items: center; }
        .tiptap-wrap .toolbar .spacer { flex: 1 1 auto; }
        .tiptap-wrap .toolbar .divider { width: 1px; align-self: stretch; opacity: .15; margin: 0 6px; }
        .tiptap-wrap.light { color: #111; }
        .tiptap-wrap.dark { color: #eee; }
        .tiptap-wrap.light .rte { border-color: #ddd; background: #fafafa; }
        .tiptap-wrap.dark .rte { border-color: #333; background: #1a1a1a; }
        // .tiptap-wrap .toolbar .btn { height: 30px; width: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid; cursor: pointer; line-height: 0; }
        /* 뭉개짐 방지를 위한 CSS 수정 */
        .tiptap-wrap .toolbar .btn svg {
          fill: none !important;
          stroke: currentColor !important;
          stroke-width: 2.2; /* 가독성을 위해 살짝 두껍게 조절 */
        }  
        /* UL/OL 아이콘의 '점'과 '선' 가시성 보정 */
        .tiptap-wrap .toolbar .btn svg circle {
          fill: currentColor !important; /* 리스트 점은 채워져야 보임 */
          stroke: none !important;
        }
        .tiptap-wrap .toolbar .btn.wide { width: auto; padding: 0 8px; line-height: 1; gap: 6px; }
        .tiptap-wrap .toolbar .mode-segment { display: inline-flex; align-items: center; border: 1px solid; border-radius: 8px; overflow: hidden; }
        .tiptap-wrap.light .toolbar .mode-segment { border-color: #ddd; background: #fff; }
        .tiptap-wrap.dark .toolbar .mode-segment { border-color: #444; background: #222; }
        .tiptap-wrap .toolbar .mode-segment .mode-btn {
          min-width: 54px;
          width: auto;
          height: 30px;
          padding: 0 10px;
          border: 0;
          border-radius: 0;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0;
        }
        .tiptap-wrap .toolbar .mode-segment .mode-btn + .mode-btn { border-left: 1px solid; }
        .tiptap-wrap.light .toolbar .mode-segment .mode-btn + .mode-btn { border-color: #ddd; }
        .tiptap-wrap.dark .toolbar .mode-segment .mode-btn + .mode-btn { border-color: #444; }
        .tiptap-wrap.light .toolbar .btn { background: #fff; color: #111; border-color: #ddd; }
        .tiptap-wrap.dark .toolbar .btn { background: #222; color: #eee; border-color: #444; }
        .tiptap-wrap .toolbar .btn:hover { filter: brightness(1.06); }
        .tiptap-wrap .toolbar .btn.active {
          background: rgba(107, 156, 255, 0.2) !important;
          border-color: #6b9cff !important;
          color: #6b9cff !important;
        }
        .tiptap-wrap .toolbar .btn:disabled { opacity: .5; cursor: not-allowed; }
        .tiptap-wrap .toolbar .select { height: 30px; border-radius: 6px; border: 1px solid; padding: 0 8px; background: transparent; }
        .tiptap-wrap.light .toolbar .select { background: #fff; color: #111; border-color: #ddd; }
        .tiptap-wrap.dark .toolbar .select { background: #222; color: #eee; border-color: #444; }
        /* 시각적 숨김(스크린 리더용) */
        .tiptap-wrap .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        /* 헤더 스트립 */
        .tiptap-wrap .header { padding: 8px 12px; font-size: 12px; opacity: .9; display: flex; align-items: center; gap: 8px; }
        .tiptap-wrap.light .header { background: #f3f3f3; border-bottom: 1px solid #e5e5e5; color: #333; }
        .tiptap-wrap.dark .header { background: #151515; border-bottom: 1px solid #2a2a2a; color: #ddd; }
        .tiptap-wrap .editor { padding: 12px; text-align: left; width: 100%; max-width: 100%; box-sizing: border-box; overflow: auto; }
        .tiptap-wrap .editor .ProseMirror { outline: none; text-align: left; }
        /* 에디터 내부 리스트 스타일 복구 (중요) */
        .tiptap-wrap .editor .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        
        .tiptap-wrap .editor .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        
        .tiptap-wrap .editor .ProseMirror li {
          display: list-item !important; /* 일부 프레임워크에서 block으로 변경하는 것 방지 */
        }
        .tiptap-wrap.light .editor { background: #fff; }
        .tiptap-wrap.dark .editor { background: #111; }
        /* 임베드(iframe/video) 기본 크기 확보: 고정 크기가 없을 때 16:9 비율 유지 */
        .tiptap-wrap .editor .embed { position: relative; width: 100%; aspect-ratio: 16 / 9; background: rgba(127,127,127,.06); border-radius: 8px; overflow: hidden; }
        .tiptap-wrap .editor .embed[data-fixed-size] { aspect-ratio: auto; }
        .tiptap-wrap .editor .embed iframe, .tiptap-wrap .editor .embed video { display: block; width: 100%; height: 100%; border: 0; }
        .tiptap-wrap .editor .embed-resize-handle { position: absolute; right: 4px; bottom: 4px; width: 14px; height: 14px; border-radius: 3px; background: currentColor; opacity: .75; cursor: se-resize; }
        .tiptap-wrap.light .editor .embed-resize-handle { color: #666; }
        .tiptap-wrap.dark .editor .embed-resize-handle { color: #bbb; }
        .tiptap-wrap .editor .embed-resize-handle:hover { opacity: 1; }
        /* 이미지 표시: 반응형, 테두리 약간 */
        .tiptap-wrap .editor img { max-width: 100%; height: auto; display: inline-block; border-radius: 4px; }
        /* 비디오/임베드 공통 */
        .tiptap-wrap .editor video, .tiptap-wrap .editor iframe { max-width: 100%; height: auto; display: block; border: 0; border-radius: 4px; }
        .tiptap-wrap .editor .video-embed { aspect-ratio: 16 / 9; width: 100%; }
        /* 공통 임베드 래퍼 */
        .tiptap-wrap .editor .embed { width: 100%; aspect-ratio: 16 / 9; position: relative; border-radius: 6px; }
        .tiptap-wrap .editor .embed[data-fixed-size] { aspect-ratio: auto; }
        .tiptap-wrap .editor .embed > iframe, .tiptap-wrap .editor .embed > object { position: absolute; inset: 0; width: 100%; height: 100%; }
        /* 임베드 리사이즈 핸들 */
        .tiptap-wrap .editor .embed .embed-resize-handle { position: absolute; width: 14px; height: 14px; right: 4px; bottom: 4px; border-radius: 3px; cursor: se-resize; display: inline-block; box-sizing: border-box; border: 1px solid; }
        .tiptap-wrap.light .editor .embed .embed-resize-handle { background: #ffffff; border-color: #c9d3f5; box-shadow: 0 0 0 2px rgba(107,156,255,.25); }
        .tiptap-wrap.dark .editor .embed .embed-resize-handle { background: #222; border-color: #4a5a8a; box-shadow: 0 0 0 2px rgba(107,156,255,.25); }
        .tiptap-wrap .editor .embed .embed-resize-handle::after { content: ""; position: absolute; right: 2px; bottom: 2px; width: 7px; height: 7px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; opacity: .5; }
        /* 표 가시성 및 리사이즈 개선 */
        .tiptap-wrap .editor table { border-collapse: collapse; width: 100%; table-layout: fixed; }
        .tiptap-wrap.light .editor th, .tiptap-wrap.light .editor td { border: 1px solid #ddd; }
        .tiptap-wrap.dark .editor th, .tiptap-wrap.dark .editor td { border: 1px solid #444; }
        .tiptap-wrap .editor th, .tiptap-wrap .editor td { padding: 6px; position: relative; }
        /* td/th의 min-height가 잘 드러나도록 높이 자동화(명시 height 제거) */
        .tiptap-wrap .editor th, .tiptap-wrap .editor td { height: auto; }
        /* ProseMirror column resize handle */
        .tiptap-wrap .editor .ProseMirror .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: 0; width: 6px; z-index: 2; cursor: col-resize; }
        .tiptap-wrap.light .editor .ProseMirror .column-resize-handle { background: transparent; }
        .tiptap-wrap.dark .editor .ProseMirror .column-resize-handle { background: transparent; }
        .tiptap-wrap .editor .ProseMirror .column-resize-handle:hover { background: rgba(107,156,255,0.35); }
        .tiptap-wrap .editor .ProseMirror.resize-cursor, .tiptap-wrap .editor .ProseMirror .resize-cursor { cursor: col-resize; }
        /* 기본 텍스트 대비 */
        .tiptap-wrap.dark .editor { color: #eee; }
        .tiptap-wrap.light .editor { color: #111; }
        /* Placeholder 색상 보정 */
        .tiptap-wrap .editor .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #9aa0a6; pointer-events: none; height: 0; }
        /* HTML 소스 보기 영역 */
        .tiptap-wrap .html-view { padding: 12px; width: 100%; max-width: 100%; box-sizing: border-box; overflow: auto; }
        .tiptap-wrap .html-view textarea { width: 100%; box-sizing: border-box; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: 12px; line-height: 1.5; border-radius: 6px; border: 1px solid; padding: 10px; height: 98%; min-height: 160px; resize: vertical; }
        .tiptap-wrap.light .html-view textarea { background: #fff; color: #111; border-color: #ddd; }
        .tiptap-wrap.dark .html-view textarea { background: #111; color: #eee; border-color: #444; }
        .tiptap-wrap .html-alert-stack { position: sticky; top: 0; z-index: 4; display: grid; gap: 8px; margin: 0 0 10px; padding-bottom: 8px; }
        .tiptap-wrap.light .html-alert-stack { background: linear-gradient(to bottom, #fff 72%, rgba(255, 255, 255, 0)); }
        .tiptap-wrap.dark .html-alert-stack { background: linear-gradient(to bottom, #111 72%, rgba(17, 17, 17, 0)); }
        .tiptap-wrap .html-warning { margin: 0; border: 1px solid; border-radius: 8px; padding: 10px; font-size: 12px; line-height: 1.45; }
        .tiptap-wrap.light .html-warning { background: #fff8f8; border-color: #f0c9c9; color: #4d1f1f; }
        .tiptap-wrap.dark .html-warning { background: #2a1717; border-color: #754242; color: #ffd7d7; }
        .tiptap-wrap .html-warning-title { margin: 0; font-weight: 700; }
        .tiptap-wrap .html-warning-desc { margin: 6px 0 0; }
        .tiptap-wrap .html-warning-grid { margin-top: 8px; display: grid; gap: 6px; }
        .tiptap-wrap .html-warning-row { margin: 0; }
        .tiptap-wrap .html-warning-row strong { display: inline-block; min-width: 92px; }
        .tiptap-wrap .html-warning-actions { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
        .tiptap-wrap .html-warning-actions .btn-warning { height: 30px; border-radius: 6px; border: 1px solid; padding: 0 10px; cursor: pointer; }
        .tiptap-wrap.light .html-warning-actions .btn-warning.secondary { background: #fff; color: #111; border-color: #ddd; }
        .tiptap-wrap.dark .html-warning-actions .btn-warning.secondary { background: #222; color: #eee; border-color: #444; }
        .tiptap-wrap.light .html-warning-actions .btn-warning.danger { background: #c62828; color: #fff; border-color: #c62828; }
        .tiptap-wrap.dark .html-warning-actions .btn-warning.danger { background: #de5454; color: #2a1717; border-color: #de5454; }
        .tiptap-wrap .html-warning-actions .btn-warning:disabled { opacity: .6; cursor: not-allowed; }
        .tiptap-wrap .html-preview-notice { margin: 0; padding: 9px 10px; border-radius: 8px; border: 1px solid; font-size: 12px; line-height: 1.4; }
        .tiptap-wrap.light .html-preview-notice { background: #fffbe7; color: #4c3b13; border-color: #efd98f; }
        .tiptap-wrap.dark .html-preview-notice { background: #3a321b; color: #ffe8a3; border-color: #8b7740; }
      `}</style>
      <div className="rte">
        {showHeader && isEditable && (
          <div className="header" aria-hidden="true">
            <span>편집 영역</span>
          </div>
        )}
        <div
          className="toolbar"
          role="toolbar"
          aria-label="Rich text editor toolbar"
        >
          <button
            className="btn"
            title="테마 전환"
            aria-label="Toggle theme"
            onClick={() => setIsDark((v) => !v)}
          >
            {isDark ? '🌙' : '☀️'}
          </button>
          <span className="divider" />
          {showHtmlToggle && (
            <div className="mode-segment" role="group" aria-label="Editor mode">
              <button
                className={`btn mode-btn ${isHtmlView ? 'active' : ''}`}
                title="HTML 모드"
                aria-label="Switch to HTML mode"
                aria-pressed={isHtmlView}
                onClick={switchToHtmlMode}
                disabled={!editor || isBusy || isHtmlView}
              >
                HTML
              </button>
              <button
                className={`btn mode-btn ${!isHtmlView ? 'active' : ''}`}
                title="편집 모드"
                aria-label="Switch to WYSIWYG mode"
                aria-pressed={!isHtmlView}
                onClick={switchToWysiwygMode}
                disabled={!editor || isBusy || !isHtmlView}
              >
                편집
              </button>
            </div>
          )}
          {showHtmlPreviewPopup && (
            <button
              className={`btn wide ${isHtmlView ? '' : 'disabled'}`}
              title={isHtmlView ? '새 탭 미리보기' : 'HTML 모드에서 사용 가능'}
              aria-label="Open HTML preview in a new tab"
              onClick={openHtmlPreviewPopup}
              disabled={!isHtmlView || isBusy || !hasHtmlSource}
            >
              <span style={{ fontSize: 12 }}>미리보기</span>
            </button>
          )}
          {showHtmlFormat && (
            <button
              className={`btn wide ${isHtmlView ? '' : 'disabled'}`}
              title="소스 정렬 (Ctrl/Cmd+Shift+F)"
              aria-label="Format HTML source"
              onClick={async () => {
                if (isHtmlView && allowHtmlEdit) await formatHtmlSource();
              }}
              disabled={!isHtmlView || !allowHtmlEdit || isBusy}
            >
              {/* 간단한 마법봉 아이콘 */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11 2 9.6 3.4 11 4.8 12.4 3.4 11 2Zm6 1-1.4 1.4L17 5.8l1.4-1.4L17 3Zm-12 0L3 5l1.4 1.4L6.4 4.4 5 3Zm13.6 5.2-1.4-1.4-14 14 1.4 1.4 14-14Z" />
              </svg>
              <span style={{ fontSize: 12 }}>정렬</span>
            </button>
          )}
          <span className="divider" />
          {allowTextAlign && (
            <>
              <button
                className={`btn ${editor?.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
                title="왼쪽 정렬"
                aria-label="Align left"
                onClick={() =>
                  editor?.chain().focus().setTextAlign('left').run()
                }
                disabled={!editor || isHtmlView}
              >
                <Icon.AlignLeft />
              </button>
              <button
                className={`btn ${editor?.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
                title="가운데 정렬"
                aria-label="Align center"
                onClick={() =>
                  editor?.chain().focus().setTextAlign('center').run()
                }
                disabled={!editor || isHtmlView}
              >
                <Icon.AlignCenter />
              </button>
              <button
                className={`btn ${editor?.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
                title="오른쪽 정렬"
                aria-label="Align right"
                onClick={() =>
                  editor?.chain().focus().setTextAlign('right').run()
                }
                disabled={!editor || isHtmlView}
              >
                <Icon.AlignRight />
              </button>
              <button
                className={`btn ${editor?.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
                title="양쪽 맞춤"
                aria-label="Align justify"
                onClick={() =>
                  editor?.chain().focus().setTextAlign('justify').run()
                }
                disabled={!editor || isHtmlView}
              >
                <Icon.AlignJustify />
              </button>
              <span className="divider" />
            </>
          )}
          {showImage && (
            <>
              <button
                className="btn"
                title="이미지(URL)"
                aria-label="Insert image by URL"
                onClick={() => {
                  if (!editor || isHtmlView) return;
                  const url = window.prompt('이미지 URL을 입력하세요');
                  if (!url) return;
                  try {
                    editor.chain().focus().setImage({ src: url }).run();
                  } catch {}
                }}
                disabled={!editor || isHtmlView}
              >
                <Icon.Image />
              </button>
              <button
                className="btn"
                title="이미지 업로드"
                aria-label="Upload image from computer"
                onClick={() => {
                  const input = document.getElementById('rte-image-file-input');
                  input?.click();
                }}
                disabled={!editor || isHtmlView}
              >
                <Icon.Upload />
              </button>
              <input
                key={fileInputKey}
                id="rte-image-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) insertImageFromFile(file);
                }}
              />
              <span className="divider" />
            </>
          )}
          {showLink && (
            <>
              <button
                className={`btn ${editor?.isActive('link') ? 'active' : ''}`}
                title="링크 추가/편집"
                aria-label="Add or edit link"
                onClick={() => {
                  if (!editor || isHtmlView) return;
                  const prev = editor.getAttributes('link')?.href || '';
                  const url = window.prompt('링크 URL을 입력하세요', prev);
                  if (url === null) return;
                  if (url === '') {
                    editor.chain().focus().unsetLink().run();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .setLink({
                        href: url,
                        target: '_blank',
                        rel: 'noopener nofollow',
                      })
                      .run();
                  }
                }}
                disabled={!editor || isHtmlView}
              >
                {/* 링크 아이콘 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.6 13.4a1 1 0 0 0 1.4 1.4l4.6-4.6a3 3 0 0 0-4.2-4.2L10 7.8a1 1 0 1 0 1.4 1.4l2.4-2.4a1 1 0 1 1 1.4 1.4l-4.6 4.6ZM13.4 10.6a1 1 0 0 0-1.4-1.4L7.4 13.4a3 3 0 1 0 4.2 4.2L14 15.6a1 1 0 1 0-1.4-1.4l-2.4 2.4a1 1 0 0 1-1.4-1.4l4.6-4.6Z" />
                </svg>
              </button>
              <button
                className="btn"
                title="링크 제거"
                aria-label="Remove link"
                onClick={() => editor?.chain().focus().unsetLink().run()}
                disabled={!editor || isHtmlView}
              >
                {/* 링크 해제 아이콘 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.6 13.4 7.8 16.2a3 3 0 1 1-4.2-4.2l2.8-2.8 1.4 1.4-2.8 2.8a1 1 0 1 0 1.4 1.4l2.8-2.8 1.4 1.4Zm2.8-2.8 2.8-2.8a1 1 0 1 0-1.4-1.4l-2.8 2.8-1.4-1.4 2.8-2.8a3 3 0 1 1 4.2 4.2L16.2 10.6l-1.4-1.4-1.4 1.4Z" />
                </svg>
              </button>
              <span className="divider" />
            </>
          )}
          {showYouTube && (
            <>
              <button
                className="btn"
                title="YouTube 삽입"
                aria-label="Insert YouTube"
                onClick={() => {
                  if (!editor || isHtmlView) return;
                  const url = window.prompt(
                    'YouTube URL 또는 영상 ID를 입력하세요'
                  );
                  if (!url) return;
                  const src = getYouTubeSrc(url);
                  if (!src) return;
                  try {
                    editor.chain().focus().setYoutubeVideo({ src }).run();
                  } catch {}
                }}
                disabled={!editor || isHtmlView}
              >
                {/* YouTube 아이콘 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23 7.1a4 4 0 0 0-2.8-2.8C18.3 3.8 12 3.8 12 3.8s-6.3 0-8.2.5A4 4 0 0 0 1 7.1 41 41 0 0 0 .5 12 41 41 0 0 0 1 16.9a4 4 0 0 0 2.8 2.8c1.9.5 8.2.5 8.2.5s6.3 0 8.2-.5A4 4 0 0 0 23 16.9 41 41 0 0 0 23.5 12 41 41 0 0 0 23 7.1ZM10 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </button>
            </>
          )}
          {showEmbed && (
            <>
              <button
                className="btn"
                title="임베드(URL)"
                aria-label="Insert embed by URL"
                onClick={() => {
                  if (!editor || isHtmlView) return;
                  const url = window.prompt(
                    '임베드할 동영상/콘텐츠 URL을 입력하세요 (TikTok/Vimeo/Dailymotion)'
                  );
                  if (!url) return;
                  const ok = insertEmbedByUrl(url);
                  if (!ok) {
                    window.alert(
                      '지원하지 않는 URL 형식입니다. TikTok/Vimeo/Dailymotion 주소를 입력해 주세요.'
                    );
                  }
                }}
                disabled={!editor || isHtmlView}
              >
                {/* 공통 임베드 아이콘 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4 5h16v2H4V5Zm0 12h16v2H4v-2Zm-1-6h6v2H3v-2Zm8 0h10v2H11v-2Z" />
                </svg>
              </button>
            </>
          )}
          {showVideo && (
            <>
              <button
                className="btn"
                title="비디오(URL) 삽입"
                aria-label="Insert video by URL"
                onClick={() => {
                  if (!editor || isHtmlView) return;
                  const url = window.prompt(
                    '비디오 파일 URL을 입력하세요 (mp4 등)'
                  );
                  if (!url) return;
                  insertVideoBySrc(url);
                }}
                disabled={!editor || isHtmlView}
              >
                {/* 비디오 아이콘 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 5h12a2 2 0 0 1 2 2v2l4-2.5V17.5L17 15v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v10h12V7H3Z" />
                </svg>
              </button>
              <button
                className="btn"
                title="비디오 업로드"
                aria-label="Upload video from computer"
                onClick={() => {
                  const input = document.getElementById('rte-video-file-input');
                  input?.click();
                }}
                disabled={!editor || isHtmlView}
              >
                <Icon.Upload />
              </button>
              <input
                id="rte-video-file-input"
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) insertVideoFromFile(file);
                  e.currentTarget.value = '';
                }}
              />
              <span className="divider" />
            </>
          )}
          {showFontSize && (
            <>
              <label htmlFor="font-size" className="sr-only">
                Font size
              </label>
              <select
                id="font-size"
                className="select"
                title="글자 크기"
                aria-label="Font size"
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) {
                    editor?.chain().focus().unsetMark('textStyle').run();
                    setFontSizeValue('');
                  } else {
                    const sizeVal = /px$/i.test(v) ? v : `${v}px`;
                    editor
                      ?.chain()
                      .focus()
                      .setMark('textStyle', { fontSize: sizeVal })
                      .run();
                    setFontSizeValue(sizeVal);
                  }
                }}
                value={fontSizeValue}
                disabled={!editor || isHtmlView}
              >
                <option value="">기본</option>
                {fontSizes.map((s) => (
                  <option key={s} value={`${s}px`}>
                    {s}px
                  </option>
                ))}
              </select>
              <span className="divider" />
            </>
          )}
          {showRowHeight && (
            <>
              <label htmlFor="row-height" className="sr-only">
                Row height
              </label>
              <select
                id="row-height"
                className="select"
                title="행 높이(선택된 행)"
                aria-label="Row height (selected row)"
                onChange={(e) => {
                  const v = e.target.value;
                  if (!editor) return;
                  if (!v) {
                    editor.chain().focus().setRowMinHeight('').run();
                    setRowHeightValue('');
                  } else {
                    const px = /px$/i.test(v) ? v : `${v}px`;
                    editor.chain().focus().setRowMinHeight(px).run();
                    setRowHeightValue(px);
                  }
                }}
                value={rowHeightValue}
                disabled={!editor || isHtmlView}
              >
                <option value="">행 높이: 기본</option>
                {rowHeights.map((h) => (
                  <option key={h} value={`${h}px`}>
                    {h}px
                  </option>
                ))}
              </select>
              <span className="divider" />
            </>
          )}
          <button
            className={`btn ${editor?.isActive('bold') ? 'active' : ''}`}
            title="굵게"
            aria-label="Bold"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.Bold />
          </button>
          <button
            className={`btn ${editor?.isActive('italic') ? 'active' : ''}`}
            title="기울임"
            aria-label="Italic"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.Italic />
          </button>
          <button
            className={`btn ${editor?.isActive('underline') ? 'active' : ''}`}
            title="밑줄"
            aria-label="Underline"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.Underline />
          </button>
          <button
            className={`btn ${editor?.isActive('strike') ? 'active' : ''}`}
            title="취소선"
            aria-label="Strikethrough"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.Strike />
          </button>
          <button
            className={`btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
            title="글머리 기호"
            aria-label="Bullet list"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.UL />
          </button>
          <button
            className={`btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
            title="번호 목록"
            aria-label="Ordered list"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.OL />
          </button>
          <span className="divider" />
          <button
            className={`btn ${editor?.isActive('table') ? 'active' : ''}`}
            title="표 삽입(3x3)"
            aria-label="Insert table"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            disabled={!editor || isHtmlView}
          >
            <Icon.Table />
          </button>
          <button
            className="btn"
            title="열 추가"
            aria-label="Add column"
            onClick={() => editor?.chain().focus().addColumnAfter().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.PlusCol />
          </button>
          <button
            className="btn"
            title="행 추가"
            aria-label="Add row"
            onClick={() => editor?.chain().focus().addRowAfter().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.PlusRow />
          </button>
          <button
            className="btn"
            title="표 삭제"
            aria-label="Delete table"
            onClick={() => editor?.chain().focus().deleteTable().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.DeleteTable />
          </button>
          <span className="spacer" />
          <button
            className="btn"
            title="되돌리기"
            aria-label="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.Undo />
          </button>
          <button
            className="btn"
            title="다시하기"
            aria-label="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor || isHtmlView}
          >
            <Icon.Redo />
          </button>
        </div>

        {isHtmlView ? (
          <div
            className="html-view"
            style={resolvedContentStyle}
            ref={htmlViewContainerRef}
          >
            {(htmlPreviewNotice || htmlRoundtripWarning?.hasLoss) && (
              <div className="html-alert-stack">
                {htmlPreviewNotice && (
                  <div
                    className="html-preview-notice"
                    role="status"
                    aria-live="polite"
                  >
                    {htmlPreviewNotice}
                  </div>
                )}
                {htmlRoundtripWarning?.hasLoss && (
                  <div className="html-warning" role="alert" aria-live="polite">
                    <p className="html-warning-title">
                      WYSIWYG 복귀 시 일부 HTML이 유실될 수 있습니다.
                    </p>
                    <p className="html-warning-desc">
                      스키마 변환 결과, 아래 항목 손실이 감지되어 적용을
                      차단했습니다.
                    </p>
                    <div className="html-warning-grid">
                      <p className="html-warning-row">
                        <strong>삭제 태그</strong>
                        <span>
                          {summarizeLossItems(htmlRoundtripWarning.removedTags)}
                        </span>
                      </p>
                      <p className="html-warning-row">
                        <strong>삭제 속성</strong>
                        <span>
                          {summarizeLossItems(htmlRoundtripWarning.removedAttrs)}
                        </span>
                      </p>
                      <p className="html-warning-row">
                        <strong>삭제 스타일</strong>
                        <span>
                          {summarizeLossItems(
                            htmlRoundtripWarning.removedStyleProps
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="html-warning-actions">
                      <button
                        className="btn-warning secondary"
                        onClick={() => setHtmlRoundtripWarning(null)}
                        disabled={isBusy}
                      >
                        HTML 보기 유지
                      </button>
                      <button
                        className="btn-warning danger"
                        onClick={async () =>
                          applyHtmlSourceToEditor({ force: true })
                        }
                        disabled={!editor || isBusy}
                      >
                        유실 감수하고 복귀
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <label htmlFor="html-source" className="sr-only">
              HTML source
            </label>
            <textarea
              id="html-source"
              value={htmlSource}
              onChange={(e) => {
                const nextHtml = e.target.value;
                setHtmlSource(nextHtml);
                emitChangeValue(nextHtml);
                if (htmlRoundtripWarning) setHtmlRoundtripWarning(null);
                if (htmlPreviewNotice) setHtmlPreviewNotice('');
              }}
              onKeyDown={async (e) => {
                const isMac = navigator.platform.toUpperCase().includes('MAC');
                const mod = isMac ? e.metaKey : e.ctrlKey;
                if (mod && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
                  e.preventDefault();
                  if (allowHtmlEdit) await formatHtmlSource();
                }
              }}
              readOnly={!allowHtmlEdit}
              spellCheck={false}
            />
          </div>
        ) : (
          <div
            className="editor"
            style={resolvedContentStyle}
            ref={editorContainerRef}
          >
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    </div>
  );
}
