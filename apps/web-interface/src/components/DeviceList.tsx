import React, { useRef, useState } from 'react';
import { IColumn, DetailsList, SelectionMode, Stack, PrimaryButton, Selection } from 'office-ui-fabric-react';
import { IItem } from '../types';
import { IDeviceInfo } from '../../../common';

export interface IDeviceListProps {
  devices: IDeviceInfo[];
  onRemoveDevices: (uIds: string[]) => void;
  onBlockDevices:  (uIds: string[], isUnBlock: boolean) => void;
  onGetCode: ( deviceId: string) => void;
  onClearError: () => void;
  isCanEditDevices?: boolean;
}

export const DeviceList = ({ devices, onClearError, onRemoveDevices, onBlockDevices, onGetCode, isCanEditDevices }: IDeviceListProps) => {
  const [selectedItems, setSelectedItems] = useState([] as string[]);
  const selection = useRef(new Selection({
    onSelectionChanged: () => {
      const newSelection = selection.current.getSelection().map(s => s.key).filter( s => typeof s === 'string' ) as typeof selectedItems;
      setSelectedItems(newSelection);
    }
  }));

  const deviceItems: IItem[] = devices.map(d => ({key: d.id, name: d.deviceName, state: d.state})) || [];
  const deviceColumns: IColumn[] = [{
    key: 'title',
    name: 'Устройство',
    minWidth: 200,
    fieldName: 'name',
  },
  {
    key: 'deviceStatus',
    name: 'Статус',
    minWidth: 200,
    fieldName: 'state',
  }];

  return (
    <Stack>
      <Stack.Item>
        <DetailsList
          items={deviceItems}
          columns={deviceColumns}
          isHeaderVisible={true}
          selectionMode={isCanEditDevices ? SelectionMode.multiple : SelectionMode.none}
          selection={selection.current}
          setKey="set"
        />
      </Stack.Item>
      <Stack.Item styles={{root: {paddingTop: '10px'}}}>
      { !!selectedItems.length && isCanEditDevices &&
          <div>
            <PrimaryButton
              text="Удалить"
              style={{marginLeft: '10px', float: 'right'}}
              disabled={!onRemoveDevices}
              onClick={() => {
                onClearError();
                onRemoveDevices(selectedItems);
                selection.current.setAllSelected(false);
              }}
            />
            <PrimaryButton
              text="Заблокировать"
              style={{marginLeft: '10px', float: 'right'}}
              onClick={() => {
                onClearError();
                onBlockDevices(selectedItems, false);
                selection.current.setAllSelected(false);
              }}
            />
            <PrimaryButton
              text="Разблокировать"
              style={{marginLeft: '10px', float: 'right'}}
              onClick={() => {
                onClearError();
                onBlockDevices(selectedItems, true);
                selection.current.setAllSelected(false);
              }}
            />
            { selectedItems.length === 1 &&
              <PrimaryButton
                text="Получить код"
                style={{float: 'right'}}
                onClick={() => {
                  onClearError();
                  onGetCode(selectedItems[0]);
                  selection.current.setAllSelected(false);
                }}
              />
            }
          </div>
        }
        </Stack.Item>
    </Stack>
  )
}
