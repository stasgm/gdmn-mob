import { Alert } from 'react-native';

import { ICell, ICellGood, ICellMovementLine, ICellName, ICellRef } from '../store/types';
import { ICellData, ICellListModel } from '../store/app/types';

export const alertWithSound = (label: string, text: string, onClose?: () => void) => {
  Alert.alert(label, text, [{ text: 'OK', onPress: onClose }]);
};

/** Convert single ICellRef (barcode) to goods entry */
const refToGood = (ref: ICellRef): ICellGood | null =>
  ref.barcode ? { barcode: ref.barcode, quantity: ref.quantity ?? 1 } : null;

/** Merge and apply lines to compute current goods in a cell */
const computeCellGoods = (baseGoods: ICellGood[], cellName: string, lines: ICellMovementLine[]): ICellGood[] => {
  const byBarcode = new Map<string, number>();
  for (const g of baseGoods) {
    byBarcode.set(g.barcode, (byBarcode.get(g.barcode) ?? 0) + g.quantity);
  }
  for (const line of lines) {
    if (line.fromCell === cellName && line.barcode) {
      const q = (byBarcode.get(line.barcode) ?? 0) - (line.quantity ?? 1);
      if (q <= 0) {
        byBarcode.delete(line.barcode);
      } else {
        byBarcode.set(line.barcode, q);
      }
    }
    if (line.toCell === cellName && line.barcode) {
      byBarcode.set(line.barcode, (byBarcode.get(line.barcode) ?? 0) + (line.quantity ?? 1));
    }
  }
  return Array.from(byBarcode.entries())
    .filter(([, q]) => q > 0)
    .map(([barcode, quantity]) => ({ barcode, quantity }));
};

export const getCellItem = (str: string): ICellName => {
  const parts = str.split('-').filter((p) => p.length > 0);

  if (parts.length >= 3) {
    const [chamber, row, cell] = parts.slice(-3);
    return { chamber, row, cell } as ICellName;
  }

  if (parts.length === 2) {
    const [first, second] = parts;
    const hasLetter = /[A-Za-zА-Яа-я]/.test(first);

    // If first part has a letter, treat it as chamber (no row).
    // Otherwise treat it as row (no chamber).
    if (hasLetter) {
      return { chamber: first, row: '', cell: second } as ICellName;
    }

    return { chamber: '', row: first, cell: second } as ICellName;
  }

  if (parts.length === 1) {
    return { chamber: '', row: '', cell: parts[0] } as ICellName;
  }

  // Fallback for empty/invalid strings
  return { chamber: '', row: '', cell: '' } as ICellName;
};

// Формирует модель с ячейками по подразделениям (поддержка нескольких товаров в одной ячейке)
export const getCellList = (list: ICellRef[], lines: ICellMovementLine[]): ICellListModel => {
  if (!Array.isArray(list) || !Array.isArray(lines)) {
    return {};
  }
  const mergedByCell = new Map<string, { ref: ICellRef; cellItem: ICell; baseGoods: ICellGood[] }>();
  for (const cur of list) {
    const cellNameItem = getCellItem(cur.name);
    const cellItem: ICell = { ...cellNameItem, tier: cur.tier };
    const key = `${cellItem.chamber}|${cellItem.row}|${cellItem.tier}|${cellItem.cell}`;
    const g = refToGood(cur);
    const baseGoods = g ? [g] : [];
    const existing = mergedByCell.get(key);
    if (existing) {
      const combined = [...existing.baseGoods];
      for (const g of baseGoods) {
        const idx = combined.findIndex((x) => x.barcode === g.barcode);
        if (idx >= 0) {
          combined[idx].quantity += g.quantity;
        } else {
          combined.push({ ...g });
        }
      }
      mergedByCell.set(key, { ...existing, baseGoods: combined });
    } else {
      mergedByCell.set(key, { ref: cur, cellItem, baseGoods });
    }
  }
  const model: ICellListModel = {};
  for (const { ref: cur, cellItem, baseGoods } of mergedByCell.values()) {
    const goods = computeCellGoods(baseGoods, cur.name, lines);
    const newCell: ICellData = {
      name: cur.name,
      cell: cellItem.cell,
      goods,
      tier: cur.tier,
      disabled: cur.disabled || false,
      defaultGroup: cur.defaultGroup,
      sortOrder: cur.sortOrder,
    };
    const { chamber, row, tier } = cellItem;
    if (!model[chamber]) {
      model[chamber] = {};
    }
    if (!model[chamber][row]) {
      model[chamber][row] = {};
    }
    if (!model[chamber][row][tier]) {
      model[chamber][row][tier] = [];
    }
    model[chamber][row][tier].push(newCell);
  }
  return model;
};

// Формирует справочник из модели с ячейками (разворачивает goods в отдельные ICellRef)
export const getCellListRef = (model: ICellListModel): ICellRef[] => {
  const list: ICellRef[] = Object.entries(model).reduce((prev: ICellRef[], curChamber) => {
    const chamberData = curChamber[1];
    const cellListByChamber = Object.entries(chamberData).reduce((listByChamber: ICellRef[], curRow) => {
      const rowData = curRow[1];
      const cellListByRow: ICellRef[] = Object.values(rowData).reduce((listByRow: ICellRef[], curCell) => {
        for (const c of curCell) {
          if (c.goods?.length) {
            for (const g of c.goods) {
              listByRow.push({
                name: c.name,
                tier: c.tier,
                barcode: g.barcode,
                quantity: g.quantity,
                defaultGroup: c.defaultGroup,
                disabled: c.disabled,
                sortOrder: c.sortOrder,
              });
            }
          } else {
            listByRow.push({
              name: c.name,
              tier: c.tier,
              defaultGroup: c.defaultGroup,
              disabled: c.disabled,
              sortOrder: c.sortOrder,
            });
          }
        }
        return listByRow;
      }, []);
      return [...listByChamber, ...cellListByRow];
    }, []);
    return [...prev, ...cellListByChamber];
  }, []);

  return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
};

/** Check if cell contains a given barcode */
export const cellHasBarcode = (cellData: ICellData, barcode: string): boolean =>
  cellData.goods?.some((g) => g.barcode === barcode) ?? false;

/** Get quantity of a barcode in a cell */
export const getCellGoodQuantity = (cellData: ICellData, barcode: string): number => {
  const g = cellData.goods?.find((x) => x.barcode === barcode);
  return g?.quantity ?? 0;
};
