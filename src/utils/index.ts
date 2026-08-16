import queryString from 'query-string';
import { nextTick, onMounted, onActivated } from 'vue';

export const queryObj = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);

/**
 * query-string 解析出的值可能是 string、string[] 或 null。
 * 这里统一取第一个有效值，便于直接绑定到只接受字符串的组件。
 */
export const firstQueryValue = (
  value: string | (string | null)[] | null | undefined,
  fallback = '',
): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.find((v) => v != null) ?? fallback;
  return fallback;
};

export const questionType = (questionType: number) => {
  switch (questionType) {
    case 0:
      return '单选题';
    case 1:
      return '多选题';
    case 2:
      return '判断题';
    case 3:
      return '简答题';
    default:
      return '未知';
  }
};
export const difficulty = (difficulty: number) => {
  switch (difficulty) {
    case 0:
      return '简单';
    case 1:
      return '中等';
    case 2:
      return '困难';
    default:
      return '未知';
  }
};

export const catalogIDType = (catalogID: number) => {
  switch (catalogID) {
    case 0:
      return {
        name: '最热',
        color: '#f50e0e',
      };
    case 1:
      return {
        name: '最新',
        color: '#67C23A',
      };
    case 2:
      return {
        name: '精选',
        color: '#CD7F32',
      };
    default:
      return {
        name: '未知',
        color: '#000',
      };
  }
};
export const transitionTime = (addDate: string | undefined) => {
  if (!addDate) return '';
  const date = new Date(addDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
export const transitionSex = (sex: unknown) => {
  const sexVal = Number(sex);
  if (sexVal === 0) {
    return '女';
  }
  if (sexVal === 1) {
    return '男';
  }
  return '未知';
};
export const isNaN = (value: unknown) => {
  return value !== value;
};
// ==== isNumber  函数====
const toString = Object.prototype.toString;
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}
export function isNumber(val: unknown) {
  return is(val, 'Number');
}

// ==== buildShortUUID  函数====
export function buildShortUUID(prefix = '') {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  return prefix + '_' + random + String(time);
}

// ==== onMountedOrActivated  hook====
export function onMountedOrActivated(hook: () => void) {
  let mounted: boolean;
  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });
  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}

// 解析客观题选项 JSON
export function parsePaperOptions(
  questionDetail: string | undefined,
): Array<{ code: string; value: string }> {
  try {
    const parsed = JSON.parse(questionDetail || '[]');
    if (Array.isArray(parsed)) {
      return parsed.map((o: { code?: string; value?: string }) => ({
        code: String(o?.code ?? ''),
        value: String(o?.value ?? ''),
      }));
    }
  } catch {
    // ignore
  }
  return [];
}

// 把「正确选项：A」补全为「正确选项：A. 选项内容」（判断/简答原样返回）
export function formatAnswerWithValues(
  questionType: number | string | undefined,
  answer: string | undefined,
  questionDetail: string | undefined,
): string {
  const text = answer ?? '';
  const qt = Number(questionType);
  if (qt !== 0 && qt !== 1) return text;
  const m = text.match(/正确选项\s*[:：]\s*([A-Za-z]+)/);
  if (!m) return text;
  const letters = m[1].toUpperCase().split('');
  const opts = parsePaperOptions(questionDetail);
  const valueMap = new Map(opts.map((o) => [o.code.toUpperCase(), o.value]));
  const parts = letters.map((L) => {
    const v = valueMap.get(L);
    return v ? `${L}. ${v}` : L;
  });
  return `正确选项：${parts.join('；')}`;
}

// 导出试卷为 Word(.doc，Word 可直接打开 HTML 格式)
export function exportPaperToWord(
  paperTitle: string,
  questions: Array<{
    question?: string;
    answer?: string;
    questionDetail?: string;
    questionType?: number | string;
  }>,
): void {
  const title = paperTitle || '试卷';
  // HTML 转义：选项值里可能出现 <img>、<div> 等字样，必须转义成文本，否则会被当标签解析导致导出错乱
  const escapeHtml = (s: string): string =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  const body = questions
    .map((q, i) => {
      const qt = Number(q.questionType);
      let optionsHtml = '';
      let answerHtml = '';
      if (qt === 0 || qt === 1 || qt === 2) {
        // 客观题：选项与答案都是纯文本，统一转义
        const opts = parsePaperOptions(q.questionDetail);
        optionsHtml = opts
          .map((o) => `<p>${escapeHtml(o.code)}. ${escapeHtml(o.value)}</p>`)
          .join('');
        answerHtml = `<p style="color:#666">参考答案：${escapeHtml(
          q.answer || '',
        )}</p>`;
      } else {
        // 简答等主观题：题干详情/答案可能是富文本 HTML，保留原格式
        if (q.questionDetail) optionsHtml = `<div>${q.questionDetail}</div>`;
        answerHtml = `<p style="color:#666">参考答案：${q.answer || ''}</p>`;
      }
      return `<div style="margin-bottom:16px">
        <h3>${i + 1}. ${escapeHtml(q.question || '')}</h3>
        ${optionsHtml}
        ${answerHtml}
      </div>`;
    })
    .join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="utf-8"><title>${title}</title></head>
  <body><h2 style="text-align:center">${title}</h2>${body}</body></html>`;
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 导出题目为 CSV（Excel 可直接打开）
/* eslint-disable @typescript-eslint/no-explicit-any */
export function exportQuestionsToCsv(
  questions: any[],
  filename = 'questions',
): void {
  const typeName: Record<string, string> = {
    '0': '单选题',
    '1': '多选题',
    '2': '判断题',
    '3': '简答题',
  };
  const diffName: Record<string, string> = {
    '0': '简单',
    '1': '中等',
    '2': '困难',
  };
  const chkName: Record<string, string> = {
    '0': '未审核',
    '1': '已通过',
    '2': '未通过',
  };
  const escapeCsv = (v: unknown): string => {
    const s = String(v ?? '');
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const headers = [
    'ID',
    '科目ID',
    '题型',
    '难度',
    '题干',
    '答案',
    '选项/详情',
    '标签',
    '上传者',
    '审核状态',
  ];
  const rows = questions.map((q) =>
    [
      q.id,
      q.subjectID,
      typeName[String(q.questionType)] || q.questionType,
      diffName[String(q.difficulty)] || q.difficulty,
      q.question,
      q.answer,
      q.questionDetail,
      q.tags,
      q.creator,
      chkName[String(q.chkState)] || q.chkState,
    ]
      .map(escapeCsv)
      .join(','),
  );
  const csv = '\ufeff' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
