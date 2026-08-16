// ==========helper.js==========
const validEvents = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid',
];

const isValidKey = (key: string) => validEvents.indexOf(key) !== -1;

type EventHandler = (event: unknown, editor: unknown) => void;

export const bindHandlers = (
  initEvent: unknown,
  listeners: Record<string, unknown> | undefined,
  editor: { on: (event: string, cb: (e: unknown) => void) => void } | null,
) => {
  if (!editor) return;
  Object.keys(listeners ?? {})
    .filter(isValidKey)
    .forEach((key) => {
      const handler = listeners?.[key];
      if (typeof handler === 'function') {
        const fn = handler as EventHandler;
        if (key === 'onInit') {
          fn(initEvent, editor);
        } else {
          editor.on(key.substring(2), (e: unknown) => fn(e, editor));
        }
      }
    });
};
