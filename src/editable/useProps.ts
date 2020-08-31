import { useState, useEffect, useMemo, useRef } from 'react';
import produce from 'immer';

import useTabChange from './useTabChange';
import computedEditColumns from './computedEditColumns';
import { CellType } from './Cell';
import { EditableColumn, OnCellChange } from './Editable';

const useProps = <T extends object>(
  dataSource: T[],
  columns: Array<EditableColumn<T>>,
  onCellChange: OnCellChange<T>,
  form: any,
) => {

  // 当前被激活的单元格，默认为null
  const [curCell, setCurCell] = useState<CellType>(null);
  // 更新 curCell 的唯一通道，统一在此校验 curCell 对应的表单域
  function handleSetCurCell(nextCell: CellType, cb?: () => void) {
    // 当前单元格无错误才能更新
    const curField = curCell && `${curCell!.dataIndex}-${curCell!.rowIndex}`
    form.validateFields([curField], (err: object) => {
      if(!err) setCurCell(nextCell);
      if(cb) cb()
    })
  }

  // 缓存dataSource 为 cacheSource，以供内部维护
  const { cacheSource, setCacheSource } = useDataSource(dataSource, form);
  // 用 ref 记录每次被更新的单元格
  const beforeCell = useRef<CellType>(null);
  // 每当 curCell 更新，取值更新 cacheSource 并触发 onCellChange
  useEffect(() => {
    if (beforeCell && beforeCell.current) {
      const { dataIndex, rowIndex } = beforeCell.current;
      const value = form.getFieldValue(`${dataIndex}-${rowIndex}`);
      const nextSource = produce(cacheSource, draft => {
        draft[rowIndex][dataIndex] = value;
      });
      setCacheSource(nextSource);
      onCellChange(nextSource, value, cacheSource[rowIndex][dataIndex], rowIndex, dataIndex);
    }
    // 重新设置 Ref 记录的值
    beforeCell.current = curCell;
  }, [curCell]);

  // 缓存处理过后的 editColumns 和 dataIndexMap。 只在 columns 和 curCell 更改后更新
  // 如果要更改handleSetCurCell函数，注意此处的闭包和性能问题
  const { editColumns, dataIndexMap } = useMemo(
    () => computedEditColumns(columns, curCell, handleSetCurCell, form),
    [columns, curCell],
  );

  // tab键切换
  useTabChange(curCell, handleSetCurCell, cacheSource, dataIndexMap);

  // 提供给外部使用的获取cacheSource的方法，绑定于tableRef上
  function getDataSource() {
    return new Promise(resolve => {
      if (curCell) {
          handleSetCurCell(null, () => resolve(cacheSource));
      } else {
        resolve(cacheSource);
      }
    });
  }

  return {
    cacheSource,
    editColumns,
    curCell,
    getDataSource,
  };
};

const useDataSource = (dataSource: any[], form: any) => {
  const [cacheSource, setCacheSource] = useState(dataSource);
  // 外部 dataSource 更新了同步更新缓存的 dataSource 和 表单域的值
  useEffect(() => {
    setCacheSource(dataSource);
    form.resetFields();
  }, [dataSource]);
  return { cacheSource, setCacheSource };
};

// Form.create的options，监听表单的改变
const useCreateForm = () => {
  // 缓存change时更改的表单域，避免检查整个表单从而减少循环次数
  const [errs, setErrs] = useState({});
  const [hasErr, setHasErr] = useState(false);
  return {
    hasErr,
    onFieldsChange: (props, changedFields) => {
      const fileds = Object.keys(changedFields)
      if (fileds.length) {
        let vldtEnd = false
        // 取出errs缓存并隔离引用
        let curErrs = { ...errs }
        Object.keys(changedFields).forEach(key => {
          const curFiled = changedFields[key]
          // 有校验的表单域会触发两次change，validating标示为fasle（即校验结束）
          if (!curFiled.validating) {
            vldtEnd = true
            if (curFiled.errors) curErrs[key] = curFiled.errors
            else {
              const { [key]: pass, ...resErrs } = curErrs as { [key:string]: any }
              curErrs = resErrs
            }
          }
        });
        if (vldtEnd) {
          setErrs(curErrs)
          setHasErr(Object.keys(curErrs).length > 0)
        }
      }
    },
  };
}

export default useProps;
export { useCreateForm };
